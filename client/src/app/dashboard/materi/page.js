'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DetailBookModal,
  EbookFilterAndSearch,
  EbookList,
} from '@/components/Dashboard/Materi/DetailEbook';
import {
  DetailJournalModal,
  JournalFilterAndSearch,
  JournalList,
} from '@/components/Dashboard/Materi/DetailJournal';
import { mipaCourses } from '@/data/mockMateri';
import { getJurnals } from '@/data/getJurnal';
import { getEBooks } from '@/data/getEBook';

// Komponen CourseSelector
const CourseSelector = ({ selectedCourse, setSelectedCourse }) => {
  return (
    <div className="bg-white dark:bg-card border-b-[2px] rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Pilih Mata Kuliah
      </h2>

      <Select value={selectedCourse} onValueChange={setSelectedCourse}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Pilih mata kuliah" />
        </SelectTrigger>
        <SelectContent>
          {mipaCourses.map((course) => (
            <SelectItem key={course} value={course}>
              <div className="flex flex-col">
                <span className="font-medium">{course}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Course details */}
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white">
              {selectedCourse}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Fakultas Matematika dan Ilmu Pengetahuan Alam
            </p>
          </div>
          <span className="inline-block px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            MIPA
          </span>
        </div>
      </div>
    </div>
  );
};

// Komponen TabNavigation
const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8 px-6">
        <button
          onClick={() => setActiveTab('ebook')}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'ebook'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          E-Book
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'journal'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Jurnal
        </button>
      </nav>
    </div>
  );
};

// Komponen TipsResources
const TipsResources = () => {
  return (
    <div className="bg-white dark:bg-card shadow-2xl border-b-[2px] rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Tips & Resources
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Cara Efektif Belajar
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Baca materi sebelum perkuliahan</li>
            <li>• Diskusikan dengan teman sejawat</li>
          </ul>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
            Tools Pendukung
          </h3>
          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
            <li>• MATLAB untuk perhitungan</li>
            <li>• R Studio untuk statistika</li>
            <li>• GeoGebra untuk visualisasi</li>
          </ul>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
            Referensi Tambahan
          </h3>
          <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
            <li>• Khan Academy</li>
            <li>• Coursera Math Courses</li>
            <li>• MIT OpenLibrary</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Komponen Utama
export default function MateriPage() {
  const [selectedCourse, setSelectedCourse] = useState('Kalkulus II');
  const [books, setBooks] = useState([]);
  const [journals, setJournals] = useState([]);
  const [activeTab, setActiveTab] = useState('ebook');
  const [search, setSearch] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [journalLoading, setJournalLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [journalTotalPages, setJournalTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const data = await getEBooks(selectedCourse);

        const transformedBooks = data.docs.map((book) => ({
          key: book.key,
          title: book.title,
          author_name: book.author_name,
          first_publish_year: book.first_publish_year,
          publishers: book.publishers,
          subject: book.subject,
          cover_i: book.cover_i,
          preview_url: book.preview_url,
          description: book.excerpt?.[0] || book.description || null,
        }));

        setBooks(transformedBooks);
        setTotalPages(Math.ceil(transformedBooks.length / 6));
      } catch (error) {
        setBooks([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [selectedCourse]);

  useEffect(() => {
    const fetchJournals = async () => {
      setJournalLoading(true);
      setError(null);
      try {
        const data = await getJurnals(selectedCourse, currentPage);

        setApiResponse(data);

        const transformedJournals = data.results.map((journal) => ({
          id: journal.id,
          bibjson: journal.bibjson || journal,
        }));

        setJournals(transformedJournals);

        if (data.total) {
          setJournalTotalPages(Math.ceil(data.total / 6));
        }
      } catch (error) {
        setError(error.message);
        setJournals([]);
        setJournalTotalPages(1);
      } finally {
        setJournalLoading(false);
      }
    };

    fetchJournals();
  }, [selectedCourse, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Filter books based on search
  const filteredBooks = books.filter((book) => {
    return (
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      (book.author_name &&
        book.author_name.some((author) =>
          author.toLowerCase().includes(search.toLowerCase())
        )) ||
      (book.subject &&
        book.subject.some((subject) =>
          subject.toLowerCase().includes(search.toLowerCase())
        ))
    );
  });

  // Filter journals based on search
  const filteredJournals = journals.filter((journal) => {
    const bibjson = journal.bibjson || {};
    return (
      (bibjson.title &&
        bibjson.title.toLowerCase().includes(search.toLowerCase())) ||
      (bibjson.journal?.title &&
        bibjson.journal.title.toLowerCase().includes(search.toLowerCase())) ||
      (bibjson.author &&
        bibjson.author.some((author) =>
          author.name.toLowerCase().includes(search.toLowerCase())
        )) ||
      (bibjson.abstract &&
        bibjson.abstract.toLowerCase().includes(search.toLowerCase()))
    );
  });

  // Handle book detail
  const handleBookDetail = (book) => {
    setSelectedBook(book);
    setShowDetail(true);
  };

  // Handle journal detail
  const handleJournalDetail = (journal) => {
    setSelectedJournal(journal);
    setShowDetail(true);
  };

  // Close detail
  const closeDetail = () => {
    setShowDetail(false);
    setSelectedBook(null);
    setSelectedJournal(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-card transition-colors duration-300 max-w-7xl mx-auto">
      <Head>
        <title>E-Book & Jurnal - Delta Civitas</title>
        <meta name="description" content="E-Book & Jurnal Delta Civitas" />
      </Head>

      {/* Header */}
      <header className="bg-white dark:bg-card shadow-2xl border-b-[2px]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                E-Book & Jurnal
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Fakultas MIPA
              </p>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                E-Book
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Jurnal
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <CourseSelector
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
        />

        <div className="bg-white dark:bg-card shadow-2xl border-b-[2px] rounded-lg mb-8">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="p-6">
            {activeTab === 'ebook' && (
              <>
                <EbookFilterAndSearch
                  search={search}
                  setSearch={setSearch}
                  selectedCourse={selectedCourse}
                />
                <EbookList
                  books={books}
                  handleBookDetail={handleBookDetail}
                  loading={loading}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                  filteredBooks={filteredBooks}
                />
              </>
            )}

            {/* Journal Tab */}
            {activeTab === 'journal' && (
              <>
                <JournalFilterAndSearch
                  search={search}
                  setSearch={setSearch}
                  selectedCourse={selectedCourse}
                />

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">
                          <span className="font-medium">Error:</span> {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <JournalList
                  journals={journals}
                  handleJournalDetail={handleJournalDetail}
                  loading={journalLoading}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={journalTotalPages}
                  filteredJournals={filteredJournals}
                  apiResponse={apiResponse}
                />
              </>
            )}
          </div>
        </div>

        <TipsResources />
      </main>

      {/* Conditional rendering for detail modals */}
      {activeTab === 'ebook' && (
        <DetailBookModal
          showDetail={showDetail}
          book={selectedBook}
          closeDetail={closeDetail}
        />
      )}

      {activeTab === 'journal' && (
        <DetailJournalModal
          showDetail={showDetail}
          journal={selectedJournal}
          closeDetail={closeDetail}
        />
      )}
    </div>
  );
}
