'use client';
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await signIn('credentials', {
        redirect: false,
        callbackUrl: '/dashboard/profile',
        email,
        password,
      });

      if (res?.error) {
        try {
          // Try to parse as JSON first
          const errorData = JSON.parse(res.error);
          toast.error(errorData.message || 'Login failed');

          if (errorData.fieldErrors && errorData.fieldErrors.length > 0) {
            const fieldErrors = {};
            errorData.fieldErrors.forEach((err) => {
              fieldErrors[err.field] = err.message;
            });
            setErrors(fieldErrors);
          }
        } catch (parseError) {
          toast.error(res.error);
        }
        setIsLoading(false);
      } else {
        toast.success('Login successful!');
        window.location.assign('/dashboard/profile');
      }
    } catch (error) {
      toast.error('An unexpected error occurred during login');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden pt-16 pb-6">
      <Head>
        <title>Login - DeltaCivitas</title>
        <meta name="description" content="Login ke sistem DeltaCivitas" />
      </Head>
      <BackgroundCircle />
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
              Masuk ke akun Delta Civitas
            </p>
          </div>
          {/* Login Card */}
          <Card className="bg-white dark:bg-card border border-gray-200 dark:border-gray-700 shadow-xl transform transition-all hover:shadow-2xl relative z-10">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-black dark:text-white">
                Masuk ke Akun
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                Masukkan email dan password Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-black dark:text-white"
                  >
                    Email
                  </Label>
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
                    <Input
                      id="email"
                      type="email"
                      required
                      disabled={isLoading}
                      placeholder="nama@universitas.edu"
                      className={`pl-10 ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-black dark:text-white"
                  >
                    Password
                  </Label>
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
                    <Input
                      id="password"
                      type="password"
                      required
                      disabled={isLoading}
                      placeholder="••••••••"
                      className={`pl-10 ${
                        errors.password ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* General Error Message */}
                {errors.general && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-md">
                    {errors.general}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
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
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Belum punya akun?{' '}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center"
              >
                Daftar di sini
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BackgroundCircle() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-40">
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
  );
}
