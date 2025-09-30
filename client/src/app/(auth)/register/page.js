'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import toast from 'react-hot-toast';
import { prodis } from '@/data/prodi';
import { registerUser } from '@/lib/action';

export default function RegisterPage() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      fullName: document.getElementById('fullName').value,
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      nim: document.getElementById('nim').value,
      prodi: document.getElementById('prodi').value,
      password: document.getElementById('password').value,
    };

    try {
      const response = await registerUser(formData);

      if (!response.success) {
        response?.errors.map((e) => {
          toast.error(e.message);
        });
        return;
      }

      toast.success(response.message);

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      console.log(error.message, 'error kocak');
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center">
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Buat Akun
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Daftar ke DeltaCivitas
              </p>
            </div>

            {/* Register Form */}
            <Card className="bg-white dark:bg-card shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Informasi Pribadi
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Isi formulir di bawah untuk membuat akun
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name Input */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Nama Lengkap
                    </Label>
                    <div className="relative">
                      <Input
                        id="fullName"
                        name="fullName"
                        required
                        placeholder="John Doe"
                        className="pl-10"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Username Input */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Username
                    </Label>
                    <div className="relative">
                      <Input
                        id="username"
                        name="username"
                        required
                        placeholder="johndoe"
                        className="pl-10"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="nama@universitas.edu"
                        className="pl-10"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="nim"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      NIM
                    </Label>
                    <div className="relative">
                      <Input
                        id="nim"
                        name="nim"
                        type="text"
                        required
                        title="NIM minimal 8 digit"
                        placeholder="X12345678"
                        className="pl-10"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
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
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="prodi"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Program Studi
                    </Label>
                    <Select
                      required
                      onValueChange={(value) => {
                        document.getElementById('prodi').value = value;
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Program Studi" />
                      </SelectTrigger>
                      <SelectContent>
                        {prodis.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* Hidden input untuk menyimpan nilai prodi */}
                    <input type="hidden" id="prodi" name="prodi" value="" />
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        minLength="6"
                        placeholder="••••••••"
                        className="pl-10"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                  >
                    Daftar
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
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
    </div>
  );
}
