'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { mockJobs } from '../../data/mockJobs';
import { FilterBar } from './FilterBar';
import { JobCard } from './JobCard';
import { JobDetailModal } from './JobDetailModal';
import { JobCardSkeleton, JobListSkeleton } from '../JobCardSkeleton';
export default function LokerPage() {
  const [jobs] = useState(mockJobs);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    location: '',
    salary: '',
  });
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('light');

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme, mounted]);

  const filteredJobs = jobs?.filter((job) => {
    return (
      job.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.category ? job.category === filters.category : true) &&
      (filters.location ? job.location === filters.location : true) &&
      (filters.salary ? job.salary >= parseInt(filters.salary) : true)
    );
  });

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs?.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs?.length / jobsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Head>
        <title>Ingfo Loker Cok</title>
        <meta
          name="description"
          content="Temukan peluang karir di Delta Civitas"
        />
      </Head>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600/5 to-purple-600/5 dark:bg-slate-900 dark:text-white py-18 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Ingfo Loker Cok</h1>
          <p className="text-xl mb-6">
            Temukan peluang karir yang sesuai dengan minat dan bakatmu
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white text-black bg-opacity-20 px-4 py-2 rounded-lg">
              <span className="font-medium">Total Lowongan:</span>{' '}
              {jobs?.length || 0}
            </div>
            <div className="bg-white text-black bg-opacity-20 px-4 py-2 rounded-lg">
              <span className="font-medium">Kategori:</span> Teknologi,
              Pendidikan, Keuangan, Kesehatan
            </div>
            <div className="bg-white text-black bg-opacity-20 px-4 py-2 rounded-lg">
              <span className="font-medium">Lokasi:</span> Jakarta, Surabaya,
              Bandung, Yogyakarta
            </div>
          </div>
        </div>
      </section>
      {/* Filter Section */}
      <section className="container mx-auto px-4 py-8">
        <FilterBar filters={filters} setFilters={setFilters} />
      </section>
      {/* Job Listings */}
      <section className="container mx-auto px-4 pb-16">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Lowongan Tersedia
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Menampilkan {indexOfFirstJob + 1}-
            {Math.min(indexOfLastJob, filteredJobs.length)} dari{' '}
            {filteredJobs.length} lowongan
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentJobs.length < 0
            ? Array.from({ length: 6 }).map((_, i) => {
                return <JobCardSkeleton key={i} />;
              })
            : currentJobs.map((job) => (
                <JobCard key={job.id} job={job} onSelect={setSelectedJob} />
              ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-4 sm:mb-0">
              Halaman {currentPage} dari {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                }`}
              >
                Sebelumnya
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                }`}
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 inline-block mb-4 transition-colors duration-300">
              <svg
                className="w-12 h-12 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Tidak ada lowongan yang sesuai dengan kriteria Anda
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Coba ubah filter atau kata kunci pencarian
            </p>
          </div>
        )}
      </section>
      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">
                Ingfo Loker Delta Civitas
              </h3>
              <p className="text-gray-400 dark:text-gray-500">
                Delta Civitas Career Hub — wadah informasi lowongan kerja untuk
                semua mahasiswa dan fresh graduate, baik full-time, part-time,
                remote, maupun onsite.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Kontak</h3>
              <ul className="text-gray-400 dark:text-gray-500 space-y-2">
                <li>Email: info@deltacivitas.com</li>
                <li>Telepon: 021-1234567</li>
                <li>Alamat: Jakarta, Indonesia</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Ikuti Kami</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 dark:text-gray-500 hover:text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 dark:text-gray-500 hover:text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 dark:text-gray-500 hover:text-white"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 dark:border-gray-800 mt-8 pt-6 text-center text-gray-400 dark:text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} Ingfo Loker Delta Civitas. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal Detail Lowongan */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
