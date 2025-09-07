'use client';
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

export function FilterBar({ filters, setFilters }) {
  const categories = [
    { label: 'Semua', value: 'all' },
    { label: 'Teknologi', value: 'Teknologi' },
    { label: 'Pendidikan', value: 'Pendidikan' },
    { label: 'Keuangan', value: 'Keuangan' },
    { label: 'Kesehatan', value: 'Kesehatan' },
  ];

  const locations = [
    { label: 'Semua', value: 'all' },
    { label: 'Jakarta', value: 'Jakarta' },
    { label: 'Surabaya', value: 'Surabaya' },
    { label: 'Bandung', value: 'Bandung' },
    { label: 'Yogyakarta', value: 'Yogyakarta' },
  ];

  const salaryRanges = [
    { label: 'Semua', value: 'all' },
    { label: 'Rp 3-5 Juta', value: '3000000' },
    { label: 'Rp 5-8 Juta', value: '5000000' },
    { label: 'Rp 8+ Juta', value: '8000000' },
  ];

  const [showClearButton, setShowClearButton] = useState(false);

  const handleFilterChange = (key, value) => {
    if (value === 'all') {
      setFilters({ ...filters, [key]: '' });
    } else {
      setFilters({ ...filters, [key]: value });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Cari lowongan..."
              className="pl-10 w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              value={filters.search}
              onChange={(e) => {
                setFilters({ ...filters, search: e.target.value });
                setShowClearButton(e.target.value.length > 0);
              }}
            />
            {showClearButton && (
              <button
                onClick={() => {
                  setFilters({ ...filters, search: '' });
                  setShowClearButton(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="w-full">
          <Select
            value={filters.category || 'all'}
            onValueChange={(value) => handleFilterChange('category', value)}
          >
            <SelectTrigger className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Dropdown */}
        <div className="w-full">
          <Select
            value={filters.location || 'all'}
            onValueChange={(value) => handleFilterChange('location', value)}
          >
            <SelectTrigger className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors">
              <SelectValue placeholder="Pilih lokasi" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {locations.map((loc) => (
                <SelectItem key={loc.value} value={loc.value}>
                  {loc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Salary Range Dropdown */}
        <div className="w-full">
          <Select
            value={filters.salary || 'all'}
            onValueChange={(value) => handleFilterChange('salary', value)}
          >
            <SelectTrigger className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors">
              <SelectValue placeholder="Pilih rentang gaji" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {salaryRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
