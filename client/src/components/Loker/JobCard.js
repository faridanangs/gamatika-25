'use client';
import React from 'react';

export function JobCard({ job, onSelect }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-12 h-12 rounded-full mr-3 object-cover"
            />
            <div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                {job.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{job.company}</p>
            </div>
          </div>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
            {job.category}
          </span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
          {job.description}
        </p>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <svg
              className="w-5 h-5 mr-1"
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
          </div>
          <div className="text-green-600 dark:text-green-400 font-semibold">
            {job.salary
              ? `Rp ${job.salary.toLocaleString('id-ID')}/bulan`
              : 'Nego'}
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          <svg
            className="inline w-4 h-4 mr-1"
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
          Deadline:{' '}
          {new Date(job.deadline).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>
        <button
          onClick={() => onSelect(job)}
          className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-300 font-medium"
        >
          Lihat Detail
        </button>
      </div>
    </div>
  );
}
