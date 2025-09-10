'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { ebookReferensi, mockMateri, videoTutorials } from '@/data/mockMateri';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DownloadIcon, EyeIcon } from 'lucide-react';

// Komponen CourseSelector
const CourseSelector = ({ selectedCourse, setSelectedCourse, mockMateri }) => {
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
          {Object.keys(mockMateri).map((course) => (
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
              {mockMateri[selectedCourse].semester}
            </p>
          </div>
          <span
            className={`inline-block px-3 py-1 text-xs rounded-full ${
              mockMateri[selectedCourse].kategori === 'Wajib'
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}
          >
            {mockMateri[selectedCourse].kategori}
          </span>
        </div>

        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          <p>Total materi: {mockMateri[selectedCourse].materi.length}</p>
          {mockMateri[selectedCourse].tugas && (
            <p>Total tugas: {mockMateri[selectedCourse].tugas.length}</p>
          )}
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
          onClick={() => setActiveTab('materi')}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'materi'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Materi
        </button>
        <button
          onClick={() => setActiveTab('tugas')}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'tugas'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Tugas
        </button>
        <button
          onClick={() => setActiveTab('ebook')}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'ebook'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          E-Book & Referensi
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'video'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Video Tutorial
        </button>
      </nav>
    </div>
  );
};

// Komponen FilterAndSearch
const FilterAndSearch = ({ search, setSearch, filter, setFilter }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-card shadow-2xl border-b-[2px] text-gray-700 dark:text-gray-300'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setFilter('slide')}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === 'slide'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-card shadow-2xl border-b-[2px] text-gray-700 dark:text-gray-300'
          }`}
        >
          Slide
        </button>
        <button
          onClick={() => setFilter('pdf')}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === 'pdf'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-card shadow-2xl border-b-[2px] text-gray-700 dark:text-gray-300'
          }`}
        >
          PDF
        </button>
        <button
          onClick={() => setFilter('video')}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === 'video'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-card shadow-2xl border-b-[2px] text-gray-700 dark:text-gray-300'
          }`}
        >
          Video
        </button>
      </div>
      <div className="relative w-full md:w-auto">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari materi..."
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

// Komponen MateriList
const MateriList = ({ filteredMateri, handlePreview, handleDownload }) => {
  return (
    <div>
      {filteredMateri.length > 0 ? (
        <div className="space-y-4">
          {filteredMateri.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.tipe === 'Slide'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : item.type === 'PDF'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      }`}
                    >
                      {item.tipe}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {item.tanggal}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-1">
                    {item.judul}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {item.deskripsi}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{item.ukuran}</span>
                    <span>{item.downloads} downloads</span>
                  </div>
                </div>
                <div className="flex space-x-1 ml-4">
                  <button
                    onClick={() => handlePreview(item.file)}
                    className="px-2 py-1 bg-gray-200 dark:bg-card shadow-2xl border-b-[2px] text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    <p className="hidden lg:block">Preview</p>
                    <EyeIcon className="lg:hidden size-3" />
                  </button>
                  <button
                    onClick={() => handleDownload(item.file)}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <p className="hidden lg:block">Download</p>
                    <DownloadIcon className="lg:hidden size-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Tidak ada materi yang sesuai filter
          </p>
        </div>
      )}
    </div>
  );
};

// Komponen TugasList
const TugasList = ({ selectedCourse, mockMateri }) => {
  return (
    <div>
      {mockMateri[selectedCourse].tugas.length > 0 ? (
        <div className="space-y-4">
          {mockMateri[selectedCourse].tugas.map((tugas) => (
            <div
              key={tugas.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {tugas.judul}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Deadline: {tugas.deadline}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      tugas.status === 'Sudah Dikumpulkan'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                  >
                    {tugas.status}
                  </span>
                  {tugas.nilai && (
                    <p className="mt-2 font-semibold text-gray-800 dark:text-white">
                      Nilai: {tugas.nilai}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  Lihat Tugas
                </button>
                <button className="px-4 py-2 bg-gray-200 dark:bg-card shadow-2xl border-b-[2px] text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  Submit
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Belum ada tugas untuk mata kuliah ini
          </p>
        </div>
      )}
    </div>
  );
};

// Komponen EbookList
const EbookList = ({ ebookReferensi, handleDownload }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {ebookReferensi.map((ebook) => (
        <div
          key={ebook.id}
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-20 bg-gray-200 dark:bg-card shadow-2xl border-b-[2px] rounded flex items-center justify-center">
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
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {ebook.judul}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {ebook.penulis} • {ebook.penerbit} ({ebook.tahun})
              </p>
              <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                {ebook.kategori}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {ebook.ukuran}
              </p>
              <button
                onClick={() => handleDownload(ebook.file)}
                className="mt-3 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Komponen VideoList
const VideoList = ({ videoTutorials, handlePreview }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {videoTutorials.map((video) => (
        <div
          key={video.id}
          className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="relative">
            <div className="aspect-video bg-gray-200 dark:bg-card shadow-2xl border-b-[2px] flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
              {video.durasi}
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              {video.judul}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {video.channel} • {video.views} views
            </p>
            <button
              onClick={() => handlePreview(video.file)}
              className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Tonton
            </button>
          </div>
        </div>
      ))}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Cara Efektif Belajar
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Baca materi sebelum perkuliahan</li>
            <li>• Catat poin penting saat video</li>
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
            <li>• MIT OpenCourseWare</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Komponen PreviewModal
const PreviewModal = ({ showPreview, previewFile, closePreview }) => {
  if (!showPreview) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-card shadow-2xl border-b-[2px] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Preview Materi
            </h2>
            <button
              onClick={closePreview}
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
          <div className="bg-gray-100 dark:bg-card shadow-2xl border-b-[2px] rounded-lg p-8 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Preview untuk: {previewFile}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Fitur preview akan segera hadir!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen Utama
export default function MateriPage() {
  const [selectedCourse, setSelectedCourse] = useState('Kalkulus II');
  const [materi, setMateri] = useState([]);
  const [activeTab, setActiveTab] = useState('materi');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [previewFile, setPreviewFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setMateri(mockMateri[selectedCourse].materi);
  }, [selectedCourse]);

  // Filter materi berdasarkan pencarian
  const filteredMateri = materi.filter((item) => {
    if (filter === 'all') {
      return (
        item.judul.toLowerCase().includes(search.toLowerCase()) ||
        item.deskripsi.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      return (
        item.tipe.toLowerCase() === filter &&
        (item.judul.toLowerCase().includes(search.toLowerCase()) ||
          item.deskripsi.toLowerCase().includes(search.toLowerCase()))
      );
    }
  });

  // Handle download
  const handleDownload = (file) => {
    alert(`Mengunduh: ${file}`);
    // Implementasi download sesungguhnya akan menggunakan API
  };

  // Handle preview
  const handlePreview = (file) => {
    setPreviewFile(file);
    setShowPreview(true);
  };

  // Close preview
  const closePreview = () => {
    setShowPreview(false);
    setPreviewFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-card transition-colors duration-300 max-w-7xl mx-auto">
      <Head>
        <title>Materi - Angkatan 25 Gamatika</title>
        <meta
          name="description"
          content="Materi pembelajaran Angkatan 25 Program Studi Matematika"
        />
      </Head>

      {/* Header */}
      <header className="bg-white dark:bg-card shadow-2xl border-b-[2px]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Materi Pembelajaran
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Angkatan 25 Program Studi Matematika
              </p>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Semua Materi
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                E-Book
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <CourseSelector
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          mockMateri={mockMateri}
        />

        <div className="bg-white dark:bg-card shadow-2xl border-b-[2px] rounded-lg mb-8">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="p-6">
            <FilterAndSearch
              search={search}
              setSearch={setSearch}
              filter={filter}
              setFilter={setFilter}
            />

            {/* Materi Tab */}
            {activeTab === 'materi' && (
              <MateriList
                filteredMateri={filteredMateri}
                handlePreview={handlePreview}
                handleDownload={handleDownload}
              />
            )}

            {/* Tugas Tab */}
            {activeTab === 'tugas' && (
              <TugasList
                selectedCourse={selectedCourse}
                mockMateri={mockMateri}
              />
            )}

            {/* E-Book Tab */}
            {activeTab === 'ebook' && (
              <EbookList
                ebookReferensi={ebookReferensi}
                handleDownload={handleDownload}
              />
            )}

            {/* Video Tab */}
            {activeTab === 'video' && (
              <VideoList
                videoTutorials={videoTutorials}
                handlePreview={handlePreview}
              />
            )}
          </div>
        </div>

        <TipsResources />
      </main>

      <PreviewModal
        showPreview={showPreview}
        previewFile={previewFile}
        closePreview={closePreview}
      />
    </div>
  );
}
