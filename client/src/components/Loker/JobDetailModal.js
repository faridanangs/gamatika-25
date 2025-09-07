'use client';
import React from 'react';

export function JobDetailModal({ job, onClose }) {
  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {job.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">{job.company}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
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
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Lokasi
              </h3>
              <p className="text-gray-800 dark:text-white flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {job.location}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Gaji
              </h3>
              <p className="text-gray-800 dark:text-white flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {job.salary
                  ? `Rp ${job.salary.toLocaleString('id-ID')}/bulan`
                  : 'Nego'}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Deadline
              </h3>
              <p className="text-gray-800 dark:text-white flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {new Date(job.deadline).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold text-xl mb-4 text-gray-800 dark:text-white">
              Deskripsi Pekerjaan
            </h3>
            <div className="prose max-w-none dark:prose-invert">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {job.description}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Kami mencari kandidat yang berpengalaman dan berdedikasi untuk
                bergabung dengan tim kami. Posisi ini menawarkan kesempatan
                untuk berkembang dalam industri yang dinamis dan kompetitif.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold text-xl mb-4 text-gray-800 dark:text-white">
              Persyaratan
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex space-x-4">
            <button className="flex-1 bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-300 font-medium">
              Lamar Sekarang
            </button>
            <button className="flex-1 border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-300 font-medium">
              Simpan Lowongan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
