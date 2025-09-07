'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  days,
  jadwalData,
  kalenderAkademik,
  mockJadwal,
  timeSlots,
} from '@/data/mockJadwal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function JadwalPage() {
  const [selectedSemester, setSelectedSemester] = useState(
    'Semester Ganjil 2023/2024'
  );
  const [jadwal, setJadwal] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setJadwal(mockJadwal[selectedSemester]);
  }, [selectedSemester]);

  // Filter jadwal berdasarkan pencarian
  const filteredJadwal = jadwal.filter((item) => {
    if (filter === 'all') {
      return (
        item.mataKuliah.toLowerCase().includes(search.toLowerCase()) ||
        item.dosen.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      return (
        item.kelas === filter &&
        (item.mataKuliah.toLowerCase().includes(search.toLowerCase()) ||
          item.dosen.toLowerCase().includes(search.toLowerCase()))
      );
    }
  });

  // Fungsi export ke PDF (simulasi)
  const exportToPDF = () => {
    alert('Fitur export PDF akan segera hadir!');
  };

  // Fungsi export ke Calendar (simulasi)
  const exportToCalendar = () => {
    alert('Fitur export ke Google Calendar akan segera hadir!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-card shadow-xl border-b-[1px] transition-colors duration-300 max-w-7xl mx-auto">
      <Head>
        <title>Jadwal - Angkatan 25 Gamatika</title>
        <meta
          name="description"
          content="Jadwal perkuliahan Angkatan 25 Program Studi Matematika"
        />
      </Head>

      {/* Header */}
      <header className="bg-white dark:bg-card shadow-xl border-b-[1px]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Jadwal Perkuliahan
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Angkatan 25 Program Studi Matematika
              </p>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button
                onClick={exportToPDF}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Export PDF
              </button>
              <button
                onClick={exportToCalendar}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Kalender
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filter Section */}
        <FilterSection />

        {/* Kalender Akademik */}
        <div className="bg-white dark:bg-card shadow-xl border-b-[1px] rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Kalender Akademik
          </h2>
          <div className="space-y-4">
            {kalenderAkademik.map((event, index) => (
              <div
                key={index}
                className={`flex items-start p-4 rounded-lg ${
                  event.type === 'semester'
                    ? 'bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500'
                    : 'bg-green-50 dark:bg-green-900 border-l-4 border-green-500'
                }`}
              >
                <div className="flex-shrink-0">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      event.type === 'semester'
                        ? 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100'
                        : 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100'
                    }`}
                  >
                    {event.type === 'semester' ? 'Semester' : 'Ujian'}
                  </span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                    {event.event}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {event.tanggal}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Penting */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Perhatian!
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>
                  Jadwal dapat berubah sewaktu-waktu. Selalu periksa halaman ini
                  secara berkala atau hubungi kaprodi untuk informasi terbaru.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FilterSection() {
  const [selectedSemester, setSelectedSemester] = useState('Semester 1');
  const [filter, setFilter] = useState('Matematika A');
  const [search, setSearch] = useState('');

  // Filter jadwal berdasarkan pencarian dan filter kelas
  const filteredJadwal = Object.entries(jadwalData).map(([day, courses]) => ({
    day,
    courses: courses.filter(
      (course) =>
        course.kelas === filter &&
        (course.mataKuliah.toLowerCase().includes(search.toLowerCase()) ||
          course.dosen.toLowerCase().includes(search.toLowerCase()))
    ),
  }));

  return (
    <div className="bg-white dark:bg-card shadow-xl border-b-[1px] rounded-lg p-6 mb-8">
      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Semester
          </label>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semester 1">Semester 1</SelectItem>
              <SelectItem value="Semester 2">Semester 2</SelectItem>
              <SelectItem value="Semester 3">Semester 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter Kelas
          </label>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Matematika A">Matematika A</SelectItem>
              <SelectItem value="Matematika B">Matematika B</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cari
          </label>
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari mata kuliah atau dosen..."
            className="w-full"
          />
        </div>
      </div>

      {/* Jadwal Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Header with time slots */}
          <thead>
            <tr>
              <th className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                Waktu / Hari
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {timeSlots.map((time) => (
              <tr key={time}>
                <td className="border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {time}
                </td>
                {days.map((day) => {
                  const course = filteredJadwal
                    .find((d) => d.day === day)
                    ?.courses.find(
                      (c) => c.jamMulai <= time && c.jamSelesai > time
                    );

                  return (
                    <td
                      key={`${day}-${time}`}
                      className="border border-gray-200 dark:border-gray-700 p-1 align-top"
                    >
                      {course ? (
                        <div className="bg-blue-50 dark:bg-blue-900 p-2 rounded m-1 text-xs">
                          <div className="font-semibold text-blue-800 dark:text-blue-200">
                            {course.mataKuliah}
                          </div>
                          <div className="text-blue-700 dark:text-blue-300">
                            {course.jamMulai} - {course.jamSelesai}
                          </div>
                          <div className="text-blue-600 dark:text-blue-400">
                            {course.dosen}
                          </div>
                          <div className="text-blue-500 dark:text-blue-400">
                            {course.kelas}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded mr-1"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Matkul
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-700 rounded mr-1"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Overlap Matkul
          </span>
        </div>
      </div>
    </div>
  );
}
