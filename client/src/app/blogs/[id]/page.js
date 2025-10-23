'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Calendar,
  Tag,
  FileText,
  Download,
  Share2,
  Heart,
  MessageCircle,
  Bookmark,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { getAllArtikel, getArtikelByID } from '@/data/getArtikelData';
import { formatReadableTime } from '@/components/Forum/ForumPost';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { BlogDetailSkeleton } from '@/components/skeleton/BlogSkeleton';

// Fungsi untuk mengacak array
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [artikel, setArtikel] = useState(null);
  const [artikels, setArtikels] = useState([]);
  const [relatedArtikels, setRelatedArtikels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const id = params.id;

  // Fetch data artikel berdasarkan ID
  const fetchArtikel = async (id) => {
    setIsLoading(true);
    try {
      const response = await getArtikelByID(id);
      if (!response.success) {
        toast.error(response.message);
      }
      setArtikel(response.data);
    } catch (error) {
      console.error('Error fetching artikel:', error);
      setArtikel(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllArtikels = async () => {
    try {
      const resp = await getAllArtikel();
      const allArtikels = resp.data || [];
      setArtikels(allArtikels);

      const filtered = allArtikels.filter((item) => item.id !== id);
      const shuffled = shuffleArray(filtered);
      setRelatedArtikels(shuffled.slice(0, 3));
    } catch (error) {
      console.error('Error fetching all artikels:', error);
      setArtikels([]);
      setRelatedArtikels([]);
    }
  };

  useEffect(() => {
    if (id) {
      fetchArtikel(id);
      fetchAllArtikels();
    }
  }, [id]);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Implementasi bookmark sesungguhnya
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: artikel?.title,
        text: artikel?.content?.substring(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link disalin ke clipboard!');
    }
  };

  const goBack = () => {
    router.push('/blogs');
  };

  if (isLoading) {
    return <BlogDetailSkeleton />;
  }

  if (!artikel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <FileText className="h-16 w-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Artikel Tidak Ditemukan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Maaf, artikel yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <Button onClick={goBack} className="bg-blue-600 hover:bg-blue-700">
            Kembali ke Blogs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen pt-12">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-4 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  artikel.category === 'Penting'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : artikel.category === 'Akademik'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : artikel.category === 'Beasiswa'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                }`}
              >
                {artikel.category}
              </span>

              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                {formatReadableTime(artikel.created_at)}
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
              {artikel.title}
            </h1>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleBookmark}
                className={`flex items-center ${
                  isBookmarked ? 'bg-blue-50 border-blue-200 text-blue-700' : ''
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 mr-2 ${
                    isBookmarked ? 'fill-current' : ''
                  }`}
                />
                {isBookmarked ? 'Tersimpan' : 'Simpan'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Bagikan
              </Button>
            </div>
          </div>
        </div>

        {/* Artikel Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-x-auto mb-8">
          <div className="p-4 md:p-8 prose dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
            >
              {artikel.content || ''}
            </ReactMarkdown>
          </div>
        </div>

        {/* Tags */}
        {artikel.tags && artikel.tags.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Tag
              </h3>
              <div className="flex flex-wrap gap-2">
                {artikel.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related Articles */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4 text-lg">
              Blogs Lainnya
            </h3>
            <div className="space-y-4">
              {relatedArtikels.length > 0 ? (
                relatedArtikels.map((item) => (
                  <Link
                    key={item.id}
                    className="flex items-start p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                    href={`/blogs/${item.id}`}
                  >
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mr-3">
                      <FileText className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatReadableTime(item.created_at)}
                      </p>
                      {item.category && (
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full mt-2 inline-block ${
                            item.category === 'Penting'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : item.category === 'Akademik'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : item.category === 'Beasiswa'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          }`}
                        >
                          {item.category}
                        </span>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  Tidak ada blog terkait yang tersedia
                </p>
              )}
            </div>

            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={goBack}
                className="w-full md:w-auto"
              >
                Lihat Semua Blogs
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Delta Civitas. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
