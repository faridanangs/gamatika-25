'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Save, Eye, FileText, X } from 'lucide-react';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { createArtikel } from '@/lib/action';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Spinner } from '../ui/spinner';
import { artikelCategories } from '@/data/mockCategories';
import SyntaxHighlighter from 'react-syntax-highlighter';

const ArticlePreview = ({ article }) => {
  return (
    <div className="prose max-w-none dark:prose-invert overflow-x-auto text-justify">
      <h1 className="text-2xl font-bold mb-4">{article.title}</h1>

      <div className="mb-4">
        <span className="text-sm text-gray-600 dark:text-gray-200">
          Kategori: {article.category || 'Tidak ada'}
        </span>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200 px-2 py-1 rounded text-sm no-underline"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={atomDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto">
                <table className="min-w-full my-4 border-collapse border border-gray-300 dark:border-gray-700">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 px-4 py-2 text-left font-semibold">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                {children}
              </td>
            );
          },
        }}
      >
        {article.content || ''}
      </ReactMarkdown>
    </div>
  );
};

export default function CreateArticlePage({ token }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState({
    title: '',
    category: '',
    tags: [],
    content: '',
  });

  const [currentTag, setCurrentTag] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handlePublish = async () => {
    try {
      setLoading(true);
      const resp = await createArtikel(token, article);
      if (!resp.success) {
        resp?.errors?.map((e) => {
          toast.error(e.message);
        });
        return;
      }

      toast.success(resp.message);
      setTimeout(() => {
        router.push(`/blogs/${resp.data.id}`);
      }, 600);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (currentTag && !article.tags.includes(currentTag)) {
      setArticle((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag],
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setArticle((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <div>
      {/* Header */}
      <header className="">
        <div className="flex justify-end">
          <div className="flex items-center gap-2">
            <Button
              disabled={
                article.title.length == 0 && article.content.length == 0
                  ? true
                  : false
              }
              variant="outline"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="sm:text-sm"
            >
              <Eye className={`w-4 h-4 mr-1`} />
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button
              onClick={handlePublish}
              disabled={loading}
              className="sm:text-sm"
            >
              {loading ? (
                <>
                  <Spinner /> Publish
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-1" />
                  Publish
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-4">
        {isPreviewMode ? (
          <div className="bg-white dark:bg-gray-600 rounded-lg shadow p-2">
            <ArticlePreview article={article} />
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="">
              <CardHeader>
                <CardTitle>Informasi Artikel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div>
                  <Label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Judul Artikel
                  </Label>
                  <Input
                    id="title"
                    placeholder="Masukkan judul artikel..."
                    value={article.title}
                    onChange={(e) =>
                      setArticle((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full"
                  />
                </div>

                {/* Category */}
                <div>
                  <Label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Kategori
                  </Label>
                  <Select
                    value={article.category}
                    onValueChange={(value) =>
                      setArticle((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {artikelCategories.map((e, i) => (
                        <SelectItem value={e.toLowerCase()} key={i}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Tag
                  </Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Tambahkan tag..."
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      className="flex-1"
                    />
                    <Button onClick={addTag} size="sm">
                      Tambah
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <div>
                    <Label
                      htmlFor="content"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Konten Artikel
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Tulis konten artikel Anda di sini."
                      value={article.content}
                      onChange={(e) =>
                        setArticle((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      // 👇 Tambahkan properti className di sini
                      className=" max-h-[600px]"
                    />
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-gray-500 rounded-lg text-sm">
                    <div className="text-blue-800 dark:text-gray-200">
                      <strong>Tips:</strong> Untuk menulis rumus matematika,
                      gunakan:
                      <ul className="list-disc pl-5 mt-1">
                        <li>
                          Rumus inline:{' '}
                          <code className="dark:bg-gray-600 bg-blue-100 px-1 mx-1 rounded">
                            $E = mc^2$
                          </code>
                        </li>
                        <li>
                          Rumus display:{' '}
                          <code className="dark:bg-gray-600 bg-blue-100 px-1 mx-1 rounded">
                            {'$$int_{a}^{b} x^2 , dx$$'}
                          </code>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistik Artikel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-200">
                    Jumlah Kata
                  </span>
                  <span className="font-medium">
                    {article.content.split(/\s+/).filter(Boolean).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-200">
                    Jumlah Tag
                  </span>
                  <span className="font-medium">{article.tags.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-200">
                    Status
                  </span>
                  <span className="font-medium text-green-600">Draft</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
