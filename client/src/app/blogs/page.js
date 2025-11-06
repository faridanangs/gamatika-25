'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  Tag,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getArtikelPerPage } from '@/data/getArtikelData';
import { artikelCategories } from '@/data/mockCategories';
import { BlogsPageSkeleton } from '@/components/skeleton/BlogSkeleton';
import { formatReadableTime } from '@/lib/timeReadable';
import { RenderReactMarkDown } from '@/lib/reactMarkDown';
import Footer from '@/components/Footer';

export default function BlogsPage() {
  const router = useRouter();
  const [artikel, setArtikel] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState('semua');
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showClearButton, setShowClearButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalArtikel, setTotalArtikel] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const resp = await getArtikelPerPage(
          itemsPerPage,
          currentPage,
          selectedKategori,
          searchTerm
        );
        setArtikel(resp.data);
        setTotalArtikel(resp.total);
      } catch (error) {
        setArtikel([]);
        setTotalArtikel(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [itemsPerPage, currentPage, selectedKategori, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedKategori]);

  const totalPages = Math.ceil(totalArtikel / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setShowClearButton(false);
  };

  const handleArtikelClick = (id) => {
    router.push(`/blogs/${id}`);
  };

  if (isLoading) {
    return <BlogsPageSkeleton />;
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Head>
        <title>Blogs - Delta Civitas</title>
        <meta name="description" content="Blogs resmi Delta Civitas" />
      </Head>

      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg z-10 pt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-white">Blogs Resmi</h1>
              <p className="text-blue-100 mt-1">Fakultas MIPA</p>
            </div>
            <div className="bg-blue-500/20 px-4 py-2 rounded-lg">
              <p className="text-white text-sm">Total: {totalArtikel} Blogs</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cari Blogs
              </label>
              <div className="relative">
                <Search
                  className="absolute right-3 cursor-pointer top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                  onClick={handleSearch}
                />
                <Input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setShowClearButton(e.target.value.length > 0);
                  }}
                  placeholder="Cari judul atau isi Blogs..."
                  className="pl-10 pr-10 w-full h-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                />
                {showClearButton && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter Kategori
              </label>
              <Select
                value={selectedKategori}
                onValueChange={setSelectedKategori}
              >
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="Semua" value="semua">
                    Semua
                  </SelectItem>
                  {artikelCategories.map((kategori) => (
                    <SelectItem key={kategori} value={kategori.toLowerCase()}>
                      {kategori}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Daftar Blogs */}
        {artikel.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <FileText className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tidak ada Blogs ditemukan
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {artikel.map((article) => (
                <div
                  key={article.id}
                  className="bg-white dark:bg-gray-800 rounded-xl flex flex-col justify-between shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => handleArtikelClick(article.id)}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`}
                      >
                        {article.category}
                      </span>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatReadableTime(article.created_at)}
                      </div>
                    </div>

                    <h1 className="font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                      {article.title}
                    </h1>

                    <div className="inline-block text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {article.content && (
                        <RenderReactMarkDown
                          content={article.content}
                          isSubstring={true}
                          lenght={200}
                        />
                      )}
                    </div>

                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs flex items-center"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-gray-500 dark:text-gray-400 text-xs">
                            +{article.tags.length - 3} lainnya
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3 text-sm text-blue-600 dark:text-blue-400 font-medium">
                    Baca selengkapnya →
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    currentPage === 1
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                </button>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    currentPage === totalPages
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow'
                  }`}
                >
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
