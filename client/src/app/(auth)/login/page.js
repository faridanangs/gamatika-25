'use client';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi proses login
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-card relative overflow-hidden pt-16 pb-6">
      <Head>
        <title>Login - Gamatika Prodi Matematika</title>
        <meta
          name="description"
          content="Login ke sistem Gamatika Prodi Matematika"
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
              Selamat Datang
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Masuk ke akun Gamatika Prodi Matematika
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-card rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 transform transition-all hover:shadow-2xl relative z-10">
            <form onSubmit={handleSubmit}>
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
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black focus:border-black dark:bg-card dark:text-white dark:focus:ring-white dark:focus:border-white transition duration-200"
                    placeholder="nama@universitas.edu"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="mb-6">
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
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-black focus:border-black dark:bg-card dark:text-white dark:focus:ring-white dark:focus:border-white transition duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded dark:bg-card dark:border-gray-600"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-black dark:text-gray-300"
                  >
                    Ingat saya
                  </label>
                </div>
                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-black hover:underline dark:text-white"
                  >
                    Lupa password?
                  </Link>
                </div>
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
                  'Masuk'
                )}
              </button>
            </form>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Belum punya akun?{' '}
              <Link
                href="/register"
                className="font-medium text-black hover:underline dark:text-white"
              >
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
