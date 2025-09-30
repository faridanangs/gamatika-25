import { ChevronLeft, ChevronRight } from 'lucide-react';

export const DetailJournalModal = ({ showDetail, journal, closeDetail }) => {
  if (!showDetail || !journal) return null;

  const bibjson = journal.bibjson || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-card shadow-2xl border-b-[2px] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Detail Jurnal
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
              {bibjson.cover_url ? (
                <img
                  src={bibjson.cover_url}
                  alt={bibjson.title}
                  className="w-full max-w-xs object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-full max-w-xs h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <svg class="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    `;
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
                {bibjson.title || 'Judul tidak tersedia'}
              </h3>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Penerbit
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {bibjson.journal?.title || 'Penerbit tidak tersedia'}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Tahun Terbit
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {bibjson.year || 'Tahun tidak tersedia'}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Volume & Nomor
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Vol. {bibjson.journal?.volume || '0'}, No.{' '}
                  {bibjson.journal?.number || '0'}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Halaman
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Hal. {bibjson.start_page || '0'} - {bibjson.end_page || '0'}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  ISSN
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {bibjson.identifier?.find((id) => id.type === 'pissn')?.id ||
                    bibjson.identifier?.find((id) => id.type === 'eissn')?.id ||
                    'ISSN tidak tersedia'}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Bahasa
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {bibjson.language?.[0] || 'Bahasa tidak tersedia'}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Abstrak
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {bibjson.abstract || 'Abstrak tidak tersedia'}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Penulis
                </h4>
                {bibjson.author && bibjson.author.length > 0 ? (
                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                    {bibjson.author.map((author, index) => (
                      <li key={index}>
                        {author.name}{' '}
                        {author.affiliation && `(${author.affiliation})`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Penulis tidak tersedia</p>
                )}
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  DOI
                </h4>
                {bibjson.identifier?.find((id) => id.type === 'doi') ? (
                  <a
                    href={`https://doi.org/${
                      bibjson.identifier.find((id) => id.type === 'doi').id
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {bibjson.identifier.find((id) => id.type === 'doi').id}
                  </a>
                ) : (
                  <p className="text-gray-500">DOI tidak tersedia</p>
                )}
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Link
                </h4>
                {bibjson.link && bibjson.link.length > 0 ? (
                  <div>
                    <a
                      href={bibjson.link[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {bibjson.link[0].url.slice(0, 30)}...
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-500">Link tidak tersedia</p>
                )}
              </div>

              <div className="flex space-x-4">
                <a
                  href={bibjson.link?.[0]?.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Baca Artikel
                </a>
                {bibjson.identifier?.find((id) => id.type === 'doi') && (
                  <a
                    href={`https://doi.org/${
                      bibjson.identifier.find((id) => id.type === 'doi').id
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    DOI
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const JournalList = ({
  journals,
  handleJournalDetail,
  loading,
  currentPage,
  setCurrentPage,
  totalPages,
  filteredJournals,
  apiResponse,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJournals.map((journal) => (
          <div
            key={journal.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {journal.bibjson?.cover_url ? (
                  <img
                    src={journal.bibjson.cover_url}
                    alt={journal.bibjson.title}
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
                  {journal.bibjson?.title || 'Judul tidak tersedia'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {journal.bibjson?.journal?.title || 'Penerbit tidak tersedia'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                    {journal.bibjson?.year || 'Tahun tidak tersedia'}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Vol. {journal.bibjson?.journal?.volume || '0'}, No.{' '}
                    {journal.bibjson?.journal?.number || '0'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {journal.bibjson?.author?.[0]?.name ||
                    'Penulis tidak tersedia'}
                </p>
                <button
                  onClick={() => handleJournalDetail(journal)}
                  className="mt-3 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                >
                  Detail Jurnal
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {apiResponse && (
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => {
              const prevPage = apiResponse.page > 1 ? apiResponse.page - 1 : 1;
              setCurrentPage(prevPage);
            }}
            disabled={apiResponse.page === 1}
            className={`flex items-center px-4 py-2 rounded-lg ${
              apiResponse.page === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <ChevronLeft className="mr-2" size={16} />
          </button>

          <div className="text-sm text-gray-700 dark:text-gray-300">
            Halaman {apiResponse.page} dari {Math.ceil(apiResponse.total / 6)}(
            {apiResponse.total} total hasil)
          </div>

          <button
            onClick={() => {
              const nextPage =
                apiResponse.page < Math.ceil(apiResponse.total / 6)
                  ? apiResponse.page + 1
                  : Math.ceil(apiResponse.total / 6);
              setCurrentPage(nextPage);
            }}
            disabled={apiResponse.page >= Math.ceil(apiResponse.total / 6)}
            className={`flex items-center px-4 py-2 rounded-lg ${
              apiResponse.page >= Math.ceil(apiResponse.total / 6)
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <ChevronRight className="ml-2" size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export const JournalFilterAndSearch = ({
  search,
  setSearch,
  selectedCourse,
}) => {
  // Filter berdasarkan mata kuliah
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
      case 'Fisika Modern':
        return 'Fisika Modern';
      case 'Blockchain':
        return 'Blockchain';
      case 'Kecerdasan Buatan':
        return 'Kecerdasan Buatan';
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
          placeholder="Cari berdasarkan judul, penerbit, abstrak, atau penulis..."
          className="w-full md:w-64 px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-card shadow-2xl border-b-[2px] dark:text-white"
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
