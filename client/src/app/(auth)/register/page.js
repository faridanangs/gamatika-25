'use client';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    nim: '',
    prodi: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi';
    }

    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email tidak valid';
    }

    if (!formData.nim) {
      newErrors.nim = 'NIM wajib diisi';
    } else if (formData.nim.length < 8) {
      newErrors.nim = 'NIM minimal 8 karakter';
    }

    if (!formData.prodi) {
      newErrors.prodi = 'Program studi wajib diisi';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Anda harus menyetujui syarat dan ketentuan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert('Registrasi berhasil! Silakan login.');
      router.push('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-card relative overflow-hidden pt-16 pb-6">
      <Head>
        <title>Register - Gamatika Prodi Matematika</title>
        <meta
          name="description"
          content="Daftar ke sistem Gamatika Prodi Matematika"
        />
      </Head>

      {/* Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Circle 1 - Light Mode: Gray-200, Dark Mode: Gray-700 */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-tr dark:from-gray-400 dark:to-gray-800 rounded-full opacity-40 blur-2xl"></div>
        {/* Circle 2 */}
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-tr dark:from-gray-400 dark:to-gray-800 rounded-full opacity-40 blur-2xl"></div>
        {/* Circle 3 */}
        <div className="absolute bottom-20 left-1/4 w-44 h-44 bg-gradient-to-tr dark:from-gray-400 dark:to-gray-800 rounded-full opacity-40 blur-2xl"></div>
        {/* Circle 4 */}
        <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-gradient-to-tr dark:from-gray-400 dark:to-gray-800 rounded-full opacity-40 blur-2xl"></div>
        {/* Circle 5 */}
        <div className="absolute top-1/3 left-1/2 w-52 h-52 bg-gradient-to-tr dark:from-gray-400 dark:to-gray-800 rounded-full opacity-40 blur-2xl"></div>
        {/* Circle 6 */}
        <div className="absolute top-1/2 right-10 w-32 h-32 bg-gradient-to-tr dark:from-gray-400 dark:to-gray-800 rounded-full opacity-40 blur-2xl"></div>
        {/* Circle 7 */}
        <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-gradient-to-tr dark:from-gray-400 dark:to-gray-800 rounded-full opacity-40 blur-2xl"></div>
        {/* Circle 8 */}
        <div className="absolute top-20 left-1/3 w-48 h-48 bg-gradient-to-tr dark:from-gray-400 dark:to-gray-800 rounded-full opacity-40 blur-2xl"></div>
        {/* Circle 9 - Additional circle for better coverage */}
        <div className="absolute bottom-1/3 left-10 w-36 h-36 bg-gradient-to-tr dark:from-gray-400 dark:to-gray-800 rounded-full opacity-40 blur-2xl"></div>
        {/* Circle 10 */}
        <div className="absolute top-1/4 right-1/4 w-44 h-44 bg-gradient-to-tr dark:from-gray-400 dark:to-gray-800 rounded-full opacity-40 blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-black dark:bg-white rounded-2xl shadow-lg mb-4 transform transition-transform hover:scale-105">
              <svg
                className="w-10 h-10 text-white dark:text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
              Buat Akun
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Daftar ke Gamatika Prodi Matematika
            </p>
          </div>

          {/* Register Card */}
          <div className="bg-white dark:bg-card rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 transform transition-all hover:shadow-2xl relative z-10">
            <form onSubmit={handleSubmit}>
              {/* Full Name Input */}
              <div className="mb-4">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-black dark:text-white mb-1"
                >
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black dark:bg-card dark:text-white dark:border-gray-700 dark:focus:ring-white dark:focus:border-white transition duration-200 ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Email Input */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-black dark:text-white mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black dark:bg-card dark:text-white dark:border-gray-700 dark:focus:ring-white dark:focus:border-white transition duration-200 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="nama@universitas.edu"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* NIM Input */}
              <div className="mb-4">
                <label
                  htmlFor="nim"
                  className="block text-sm font-medium text-black dark:text-white mb-1"
                >
                  NIM
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <input
                    id="nim"
                    name="nim"
                    type="text"
                    value={formData.nim}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black dark:bg-card dark:text-white dark:border-gray-700 dark:focus:ring-white dark:focus:border-white transition duration-200 ${
                      errors.nim ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="12345678"
                  />
                </div>
                {errors.nim && (
                  <p className="mt-1 text-sm text-red-600">{errors.nim}</p>
                )}
              </div>

              {/* Study Program Input */}
              <div className="mb-4">
                <label
                  htmlFor="prodi"
                  className="block text-sm font-medium text-black dark:text-white mb-1"
                >
                  Program Studi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <select
                    id="prodi"
                    name="prodi"
                    value={formData.prodi}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black dark:bg-card dark:text-white dark:border-gray-700 dark:focus:ring-white dark:focus:border-white appearance-none transition duration-200 ${
                      errors.prodi ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Pilih Program Studi</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Statistika">Statistika</option>
                    <option value="Pendidikan Matematika">
                      Pendidikan Matematika
                    </option>
                    <option value="Ilmu Komputer">Ilmu Komputer</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {errors.prodi && (
                  <p className="mt-1 text-sm text-red-600">{errors.prodi}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-black dark:text-white mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black dark:bg-card dark:text-white dark:border-gray-700 dark:focus:ring-white dark:focus:border-white transition duration-200 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-black dark:text-white mb-1"
                >
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black dark:bg-card dark:text-white dark:border-gray-700 dark:focus:ring-white dark:focus:border-white transition duration-200 ${
                      errors.confirmPassword
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="mb-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeTerms"
                      name="agreeTerms"
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black dark:bg-card dark:border-gray-700"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="agreeTerms"
                      className="text-black dark:text-gray-300"
                    >
                      Saya menyetujui{' '}
                      <Link
                        href="/terms"
                        className="font-medium text-black hover:underline dark:text-white"
                      >
                        Syarat dan Ketentuan
                      </Link>{' '}
                      serta{' '}
                      <Link
                        href="/privacy"
                        className="font-medium text-black hover:underline dark:text-white"
                      >
                        Kebijakan Privasi
                      </Link>
                    </label>
                  </div>
                </div>
                {errors.agreeTerms && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.agreeTerms}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Memproses...
                  </div>
                ) : (
                  'Daftar'
                )}
              </button>
            </form>
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sudah punya akun?{' '}
              <Link
                href="/login"
                className="font-medium text-black hover:underline dark:text-white"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
