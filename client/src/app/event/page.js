'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { mockPengumuman } from '@/data/mockEvent';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Kategori pengumuman
const kategoriList = ['Semua', 'Penting', 'Akademik', 'Beasiswa', 'Event'];

export default function PengumumanPage() {
  const [pengumuman, setPengumuman] = useState(mockPengumuman);
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);

  // Filter pengumuman berdasarkan kategori dan pencarian
  const filteredPengumuman = pengumuman.filter((item) => {
    const matchKategori =
      selectedKategori === 'Semua' || item.kategori === selectedKategori;
    const matchSearch =
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.konten.toLowerCase().includes(search.toLowerCase());
    return matchKategori && matchSearch;
  });

  // Urutkan berdasarkan penting dan tanggal
  const sortedPengumuman = [...filteredPengumuman].sort((a, b) => {
    if (a.penting && !b.penting) return -1;
    if (!a.penting && b.penting) return 1;
    return new Date(b.tanggal) - new Date(a.tanggal);
  });

  // Handle lihat detail
  const handleDetail = (item) => {
    setSelectedItem(item);
    setShowDetail(true);
  };

  // Handle download lampiran
  const handleDownload = (file) => {
    if (file) {
      alert(`Mengunduh: ${file}`);
      // Implementasi download sesungguhnya
    }
  };

  // Tutup detail
  const closeDetail = () => {
    setShowDetail(false);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 max-w-7xl mx-auto">
      <Head>
        <title>Pengumuman - Gamatika</title>
        <meta
          name="description"
          content="Pengumuman resmi Program Studi Matematika"
        />
      </Head>

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md z-10 pt-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Pengumuman Resmi
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Program Studi Matematika
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Pencarian dan Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cari Pengumuman
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setShowClearButton(e.target.value.length > 0);
                    }}
                    placeholder="Cari judul atau isi pengumuman..."
                    className="pl-10 pr-10 w-full h-[2.32rem] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                  />
                  {showClearButton && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
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
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {kategoriList.map((kategori) => (
                    <SelectItem key={kategori} value={kategori}>
                      {kategori}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Daftar Pengumuman */}
        <div className="space-y-4">
          {sortedPengumuman.length > 0 ? (
            sortedPengumuman.map((item) => (
              <div
                key={item.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer ${
                  item.penting ? 'border-l-4 border-red-500' : ''
                }`}
                onClick={() => handleDetail(item)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {item.penting && (
                        <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-semibold px-2 py-1 rounded-full">
                          PENTING
                        </span>
                      )}
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          item.kategori === 'Penting'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : item.kategori === 'Akademik'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : item.kategori === 'Beasiswa'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        }`}
                      >
                        {item.kategori}
                      </span>
                      {item.expired && (
                        <span className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs font-semibold px-2 py-1 rounded-full">
                          EXPIRED
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
                      {item.judul}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                      {item.konten}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {item.tanggal}
                    </div>
                  </div>

                  <div className="flex flex-col items-end ml-4">
                    {item.lampiran && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(item.lampiran);
                        }}
                        className="mb-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm flex items-center"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download
                      </button>
                    )}
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
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
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                Tidak ada pengumuman
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Tidak ada pengumuman yang sesuai dengan filter yang dipilih
              </p>
            </div>
          )}
        </div>

        {/* Subscribe Notifikasi */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Dapatkan Notifikasi Pengumuman Terbaru
            </h2>
            <p className="mb-6">
              Daftarkan email Anda untuk menerima pengumuman penting langsung ke
              inbox Anda
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-grow px-4 border border-white py-3 rounded-lg text-white"
              />
              <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {showDetail && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    {selectedItem.penting && (
                      <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-semibold px-2 py-1 rounded-full">
                        PENTING
                      </span>
                    )}
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        selectedItem.kategori === 'Penting'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : selectedItem.kategori === 'Akademik'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : selectedItem.kategori === 'Beasiswa'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      }`}
                    >
                      {selectedItem.kategori}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {selectedItem.judul}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    {selectedItem.tanggal}
                  </p>
                </div>
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

              <div className="prose dark:prose-invert max-w-none mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedItem.konten}
                </p>
              </div>

              {selectedItem.lampiran && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                    Lampiran
                  </h3>
                  <button
                    onClick={() => handleDownload(selectedItem.lampiran)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download Lampiran
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Gamatika. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Program Studi Matematika | Universitas XYZ
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
