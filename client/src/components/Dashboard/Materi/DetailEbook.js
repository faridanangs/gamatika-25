import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';

export const DetailBookModal = ({ showDetail, book, closeDetail }) => {
  if (!showDetail || !book) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-card shadow-2xl border-b-[2px] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Detail Buku
            </h2>
            <button
              onClick={closeDetail}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex justify-center">
              {book.cover_i ? (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
                  alt={book.title}
                  className="w-full max-w-xs object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full max-w-xs h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {book.title}
              </h3>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Penulis
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {book.author_name?.join(', ') || 'Penulis tidak tersedia'}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Tahun Terbit
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {book.first_publish_year || 'Tahun tidak tersedia'}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Penerbit
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {book.publishers?.join(', ') || 'Penerbit tidak tersedia'}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Kategori
                </h4>
                <div className="flex flex-wrap gap-2">
                  {book.subject?.slice(0, 5).map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
                    >
                      {subject}
                    </span>
                  ))}
                  {book.subject && book.subject.length > 5 && (
                    <span className="px-3 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full">
                      +{book.subject.length - 5} lainnya
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Deskripsi
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {book.description || 'Deskripsi tidak tersedia'}
                </p>
              </div>

              <div className="flex space-x-4">
                <a
                  href={`https://openlibrary.org${book.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Lihat di OpenLibrary
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EbookList = ({
  books,
  handleBookDetail,
  loading,
  currentPage,
  setCurrentPage,
  totalPages,
  filteredBooks,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div className="animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Hitung buku untuk halaman saat ini
  const itemsPerPage = 6;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentBooks.map((book) => (
          <div
            key={book.key}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {book.cover_i ? (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                    alt={book.title}
                    className="w-16 h-20 object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                          <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {book.author_name?.join(', ') || 'Penulis tidak tersedia'}
                </p>
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                  {book.subject?.[0] || 'Buku Akademik'}
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {book.first_publish_year || 'Tahun tidak tersedia'}
                </p>
                <button
                  onClick={() => handleBookDetail(book)}
                  className="mt-3 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  Detail Buku
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {filteredBooks.length > 6 && (
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`flex items-center px-4 py-2 rounded-lg ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <ChevronLeft size={16} />
          </button>

          <div className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} dari {totalPages}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`flex items-center px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export const EbookFilterAndSearch = ({ search, setSearch, selectedCourse }) => {
  const getCourseFilter = () => {
    switch (selectedCourse) {
      case 'Kalkulus II':
        return 'Kalkulus';
      case 'Aljabar Linear':
        return 'Aljabar Linear';
      case 'Fisika Dasar':
        return 'Fisika';
      case 'Kimia Dasar':
        return 'Kimia';
      case 'Biologi':
        return 'Biologi';
      case 'Matematika Diskrit':
        return 'Matematika Diskrit';
      case 'Statistika':
        return 'Statistika';
      case 'Pancasila':
        return 'pancasila';
      case 'Fisika Modern':
        return 'Fisika Modern';
      case 'Kimia Organik':
        return 'Kimia Organik';
      case 'Biologi Molekuler':
        return 'Biologi Molekuler';
      case 'Matematika Terapan':
        return 'Matematika Terapan';
      case 'Fisika Komputasi':
        return 'Fisika Komputasi';
      case 'Kimia Analitik':
        return 'Kimia Analitik';
      case 'Biologi Evolusioner':
        return 'Biologi Evolusioner';
      case 'Matematika Finansial':
        return 'Matematika Finansial';
      case 'Fisika Kuantum':
        return 'Fisika Kuantum';
      case 'Kimia Fisik':
        return 'Kimia Fisik';
      case 'Biologi Sel':
        return 'Biologi Sel';
      default:
        return 'Matematika';
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Filter berdasarkan mata kuliah yang dipilih:{' '}
        <span className="font-semibold">{getCourseFilter()}</span>
      </div>
      <div className="relative w-full md:w-auto">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berdasarkan judul, penulis, atau subjek..."
          className="w-full md:w-64 px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-card shadow-2xl border-b-[2px] dark:text-white"
        />
        <svg
          className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
};
