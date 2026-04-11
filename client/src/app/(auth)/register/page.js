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
import { useState } from 'react';
import { BackgroundCircle } from '../login/page';
import {
  User,
  Mail,
  Lock,
  BookOpen,
  Shield,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  UserCircle,
  Fingerprint,
  GraduationCap,
  MessageSquare,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState('form');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State untuk menampilkan/menyembunyikan password

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    prodi: '',
    password: '',
  });
  const [verificationCode, setVerificationCode] = useState('');

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleProdiChange = (value) => {
    setFormData((prev) => ({ ...prev, prodi: value }));
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    toast.loading('Mengirim kode verifikasi...');

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      toast.dismiss();

      if (!response.ok) {
        toast.error(result.message || 'Gagal mengirim kode.');
        setIsLoading(false);
        return;
      }

      toast.success(result.message);
      setStep('verify');
    } catch (error) {
      toast.dismiss();
      toast.error('Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    toast.loading('Memverifikasi kode...');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode }),
      });

      const result = await response.json();
      toast.dismiss();

      if (!response.ok) {
        if (result.errors) {
          result.errors.map((err) => toast.error(err.message));
        } else {
          toast.error(result.message || 'Gagal mendaftar.');
        }
        setIsLoading(false);
        return;
      }

      toast.success(result.message);
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (error) {
      toast.dismiss();
      toast.error('Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk toggle visibilitas password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <BackgroundCircle />
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8 mt-9">
              <div className="flex justify-center mb-4">
                <div className="bg-linear-to-r from-blue-600 to-purple-600 p-3 rounded-full">
                  <UserCircle className="h-10 w-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {step === 'form' ? 'Buat Akun' : 'Verifikasi Email Anda'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {step === 'form'
                  ? 'Daftar ke Delta Civitas'
                  : `Kami telah mengirim kode 6 digit ke ${formData.email}`}
              </p>
            </div>

            {step === 'form' && (
              <Card className="bg-white dark:bg-card shadow-xl border-0">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <User className="mr-2 h-6 w-6 text-blue-600" />
                    Informasi Pribadi
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Isi formulir di bawah untuk membuat akun
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleRequestCode} className="space-y-4">
                    {/* Full Name Input */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="flex items-center">
                        Nama Lengkap
                      </Label>
                      <div className="relative">
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={handleFormChange}
                          required
                          placeholder="John Doe"
                          className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Username Input */}
                    <div className="space-y-2">
                      <Label htmlFor="username" className="flex items-center">
                        Username
                      </Label>
                      <div className="relative">
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={handleFormChange}
                          required
                          placeholder="johndoe"
                          className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserCircle className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center">
                        Email
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          required
                          placeholder="nama@universitas.edu"
                          className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Prodi Select */}
                    <div className="space-y-2">
                      <Label htmlFor="prodi" className="flex items-center">
                        Program Studi
                      </Label>
                      <Select
                        required
                        onValueChange={handleProdiChange}
                        value={formData.prodi}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="flex items-center">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'} // Ubah tipe input berdasarkan state
                          value={formData.password}
                          onChange={handleFormChange}
                          required
                          minLength="6"
                          placeholder="••••••••"
                          className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Memuat...
                        </>
                      ) : (
                        <>
                          Daftar & Kirim Kode
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* ----- FORM VERIFIKASI (STEP 2) ----- */}
            {step === 'verify' && (
              <Card className="bg-white dark:bg-card shadow-xl border-0">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Shield className="mr-2 h-6 w-6 text-green-600" />
                    Masukkan Kode Verifikasi
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Cek email Anda untuk kode 6 digit.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form
                    onSubmit={handleVerifyAndRegister}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="code" className="flex items-center">
                        <MessageSquare className="mr-2 h-4 w-4 text-gray-500" />
                        Kode Verifikasi
                      </Label>
                      <div className="flex justify-center space-x-2">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <Input
                            key={index}
                            id={`code-${index}`}
                            type="text"
                            maxLength={1}
                            value={verificationCode[index] || ''}
                            onChange={(e) => {
                              const newCode = verificationCode.split('');
                              newCode[index] = e.target.value;
                              setVerificationCode(newCode.join(''));

                              // Auto focus to next input
                              if (e.target.value && index < 5) {
                                document
                                  .getElementById(`code-${index + 1}`)
                                  .focus();
                              }
                            }}
                            onKeyDown={(e) => {
                              // Handle backspace
                              if (
                                e.key === 'Backspace' &&
                                !verificationCode[index] &&
                                index > 0
                              ) {
                                document
                                  .getElementById(`code-${index - 1}`)
                                  .focus();
                              }
                            }}
                            required
                            className="w-12 h-12 text-center text-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 text-center mt-2">
                        Masukkan kode 6 digit yang dikirim ke {formData.email}
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || verificationCode.length !== 6}
                      className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Memverifikasi...
                        </>
                      ) : (
                        <>
                          Verifikasi & Buat Akun
                          <CheckCircle className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="flex flex-col space-y-3">
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center"
                      onClick={() => setStep('form')}
                      disabled={isLoading}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Kembali ke Form Registrasi
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full flex items-center justify-center text-blue-600 hover:text-blue-800"
                      onClick={handleRequestCode}
                      disabled={isLoading}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Kirim Ulang Kode
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sudah punya akun?{' '}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center"
                >
                  Masuk di sini
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
