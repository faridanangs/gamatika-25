'use client';
import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Users,
  Briefcase,
  FileText,
  MessageSquare,
  Trophy,
  Calendar,
  Star,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  GraduationCap,
  Award,
  Zap,
  Moon,
  Sun,
  Search,
  Bell,
  User,
  Menu,
  X,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Globe } from '@/components/Globe';

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [bubbles, setBubbles] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (isClient) {
      setBubbles(
        [...Array(5)].map(() => ({
          width: `${Math.random() * 300 + 100}px`,
          height: `${Math.random() * 300 + 100}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          x: Math.random() * 100 - 60,
          y: Math.random() * 100 - 60,
          duration: Math.random() * 2 + 10,
        }))
      );
    }
  }, [isClient]);

  // Animasi CSS dengan transition
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(el);
    });

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const features = [
    {
      id: 1,
      title: 'Forum Diskusi',
      description:
        'Berkomentar, berdiskusi, dan berbagi pengetahuan dengan sesama mahasiswa',
      icon: MessageCircle,
      color: 'from-blue-500 to-cyan-500',
      gradient: 'from-blue-600/10 to-cyan-600/10',
    },
    {
      id: 2,
      title: 'Info Loker',
      description:
        'Temukan pekerjaan part-time, remote, dan lokasi dekat kampus',
      icon: Briefcase,
      color: 'from-green-500 to-emerald-500',
      gradient: 'from-green-600/10 to-emerald-600/10',
    },
    {
      id: 3,
      title: 'Pembuatan CV Otomatis',
      description:
        'Buat CV profesional dalam hitungan menit dengan template yang disesuaikan',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      gradient: 'from-purple-600/10 to-pink-600/10',
    },
    {
      id: 7,
      title: 'E-Book & Jurnal',
      description:
        'Akses e-book dan jurnal berdasarkan mata kuliah MIPA untuk mendukung pembelajaran dan penelitian.',
      icon: BookOpen,
      color: 'from-pink-500 to-red-500',
      gradient: 'from-pink-600/10 to-red-600/10',
    },

    {
      id: 4,
      title: 'Chat dengan AI',
      description: 'Asisten AI untuk membantu belajar dan konsultasi akademik',
      icon: MessageSquare,
      color: 'from-orange-500 to-red-500',
      gradient: 'from-orange-600/10 to-red-600/10',
    },
    {
      id: 5,
      title: 'Reward NFT',
      description: 'Dapatkan NFT sebagai hadiah untuk top contributor',
      icon: Trophy,
      color: 'from-yellow-500 to-amber-500',
      gradient: 'from-yellow-600/10 to-amber-600/10',
    },
    {
      id: 6,
      title: 'Event & Pengumuman',
      description: 'Semua informasi penting dan agenda kegiatan kampus',
      icon: Calendar,
      color: 'from-indigo-500 to-blue-500',
      gradient: 'from-indigo-600/10 to-blue-600/10',
    },
  ];

  const whyChoose = [
    {
      icon: GraduationCap,
      title: 'Didesain untuk MIPA',
      description:
        'Platform khusus untuk mahasiswa Fakultas MIPA dengan fitur yang relevan',
    },
    {
      icon: Award,
      title: 'Reward Berharga',
      description: 'Top contributor mendapatkan NFT yang bisa diperjualbelikan',
    },
    {
      icon: Zap,
      title: 'Cepat & Mudah',
      description: 'Interface intuitif dengan proses yang disederhanakan',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah W.',
      role: 'Mahasiswa Matematika',
      comment:
        'Platform ini sangat membantu saya dalam membuat CV dan mencari pekerjaan part-time yang sesuai dengan jadwal kuliah.',
    },
    {
      name: 'Ahmad R.',
      role: 'Mahasiswa Fisika',
      comment:
        'Forum diskusinya sangat aktif dan AI chat-nya membantu saya memahami konsep yang sulit.',
    },
    {
      name: 'Maya S.',
      role: 'Mahasiswa Kimia',
      comment:
        'Saya sudah mendapatkan NFT karena menjadi top contributor di forum diskusi. Sangat membantu!',
    },
  ];

  const stats = [
    { label: 'Mahasiswa Aktif', value: '5,000+' },
    { label: 'Postingan Forum', value: '10,000+' },
    { label: 'Lowongan Kerja', value: '500+' },
    { label: 'CV Dibuat', value: '3,000+' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 transition-colors duration-300">
      <section className="relative overflow-hidden py-20">
        {isClient && bubbles.length > 0 && (
          <div className="absolute inset-0 overflow-hidden">
            {bubbles.map((bubble, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-600/20 dark:to-purple-600/20 animate-bubble"
                style={{
                  width: bubble.width,
                  height: bubble.height,
                  left: bubble.left,
                  top: bubble.top,
                  animationDuration: `${bubble.duration}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              className="lg:pl-2 animate-on-scroll"
              style={{ transitionDelay: '0.2s' }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Platform{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Delta Civitas
                </span>{' '}
                untuk Mahasiswa MIPA
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
                Solusi lengkap untuk mahasiswa MIPA - dari pembuatan CV hingga
                mencari pekerjaan part-time, semuanya dalam satu platform modern
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300">
                    Mulai Sekarang{' '}
                    <ArrowRight className="inline ml-2" size={20} />
                  </button>
                </Link>
              </div>
            </div>

            <div
              className="relative hidden lg:block animate-on-scroll"
              style={{ transitionDelay: '0.4s' }}
            >
              <Globe />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-on-scroll"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 transition-transform duration-300 hover:scale-110">
                  {stat.value}
                </div>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20  bg-gradient-to-br from-blue-600/5 to-purple-600/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Fitur Unggulan Kami
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Semua yang dibutuhkan mahasiswa MIPA dalam satu platform yang
              modern dan mudah digunakan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 cursor-pointer border-2 transition-all duration-300 animate-on-scroll ${
                  hoveredCard === index
                    ? 'border-blue-500 dark:border-blue-400 shadow-xl transform -translate-y-2'
                    : 'border-gray-100 dark:border-slate-700'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setActiveFeature(index)}
              >
                <div
                  className={`bg-gradient-to-r ${feature.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}
                >
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600/5 to-purple-600/5 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Kenapa Memilih Platform Kami?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChoose.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center border border-gray-100 dark:border-slate-700 animate-on-scroll"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600/5 to-purple-600/5 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Apa Kata Mereka?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Pengalaman mahasiswa MIPA yang telah menggunakan platform kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6 relative border border-gray-200 dark:border-slate-600 animate-on-scroll"
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                <div className="absolute top-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-tl-xl rounded-br-xl">
                  <Heart className="size-4" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                  &quot;{testimonial.comment}&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Siap Memulai Perjalanan Belajar Anda?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Bergabunglah, ribuan mahasiswa MIPA telah merasakan manfaat
              platform kami
            </p>
            <Link href="/register">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300">
                Daftar Gratis Sekarang
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Delta Civitas</h3>
              <p className="text-gray-400">
                Platform khusus untuk mahasiswa Fakultas MIPA dalam mencari
                pekerjaan, belajar, dan berkembang.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Fitur</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <p className="hover:text-white transition">Forum Diskusi</p>
                </li>
                <li>
                  <p className="hover:text-white transition">Info Loker</p>
                </li>
                <li>
                  <p className="hover:text-white transition">Pembuatan CV</p>
                </li>
                <li>
                  <p className="hover:text-white transition">AI Chat</p>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Komunitas</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Event
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    NFT Marketplace
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Bantuan
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hubungi Kami</h4>
              <p className="text-gray-400 mb-4">support@deltacivitas.ac.id</p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <MessageCircle size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <Share2 size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <GraduationCap size={24} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Delta Civitas. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
