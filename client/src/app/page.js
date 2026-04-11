'use client';
import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Heart,
  BookOpen,
  MessageCircle,
  Briefcase,
  FileText,
  MessageSquare,
  Trophy,
  Users,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { Globe } from '@/components/Globe';
import Footer from '@/components/Footer';
import { stats, testimonials, features, whyChoose } from '@/data/homePageData';

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

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 transition-colors duration-300">
      <section className="relative overflow-hidden py-20">
        {isClient && bubbles.length > 0 && (
          <div className="absolute inset-0 overflow-hidden">
            {bubbles.map((bubble, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-linear-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-600/20 dark:to-purple-600/20 animate-bubble"
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
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Evolusi Digital untuk Mahasiswa
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                  {' '}
                  Sains.
                </span>{' '}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl text-justify">
                <span className="font-semibold text-justify">
                  Platform MIPA pertama yang menghargai kontribusimu dengan aset
                  digital (NFT), Bukan sekadar forum diskusi. Disini kamu bisa
                  akses ribuan jurnal, bangun CV lolos sistem ATS, Masa depanmu dimulai di sini.
                </span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <button className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300">
                    Mulai Akselerasi Karir{' '}
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
                <div className="text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 transition-transform duration-300 hover:scale-110">
                  {stat.value}
                </div>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-linear-to-br from-blue-600/5 to-purple-600/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Fitur Unggulan Kami
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Platform khusus untuk mahasiswa Fakultas MIPA dengan fitur yang
              relevan untuk mendukung pembelajaran dan pengembangan karir
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-2 transition-all duration-300 animate-on-scroll ${
                  hoveredCard === index
                    ? 'border-blue-500 dark:border-blue-400 shadow-xl transform -translate-y-2'
                    : 'border-gray-100 dark:border-slate-700'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setActiveFeature(index)}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`bg-linear-to-r ${feature.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="text-white" size={28} />
                  </div>
                  {feature.feature && (
                    <div className="px-3 py-1 bg-linear-to-br from-yellow-500 to-amber-500 rounded-lg font-bold text-white text-sm">
                      {feature.feature}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {feature.description}
                </p>
                {feature.id === 3 && (
                  <Link
                    href="/Cv-Budi-Santoso(2).pdf"
                    className={`text-black dark:text-white font-sans mb-2 inline-block px-2 py-1 bg-linear-to-r ${feature.gradient} rounded-md cursor-pointer`}
                  >
                    lihat template
                  </Link>
                )}
                <div
                  className={`h-1 w-full bg-linear-to-r ${feature.gradient} rounded-full`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-linear-to-br from-blue-600/5 to-purple-600/5 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Kenapa Memilih Delta Civitas?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Platform yang dirancang khusus untuk memenuhi kebutuhan mahasiswa
              Fakultas MIPA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChoose.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center border border-gray-100 dark:border-slate-700 animate-on-scroll"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="bg-linear-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
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
      <section className="py-20 bg-linear-to-br from-blue-600/5 to-purple-600/5 dark:bg-slate-900">
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
                <div className="absolute top-0 left-0 bg-linear-to-r from-blue-500 to-purple-500 text-white p-2 rounded-tl-xl rounded-br-xl">
                  <Heart className="size-4" />
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="text-yellow-400 fill-current"
                      size={16}
                    />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                  &quot;{testimonial.comment}&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
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
      <section className="py-20 bg-linear-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-on-scroll">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Users className="text-white" size={48} />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Siap Bergabung dengan Komunitas MIPA?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan 500+ mahasiswa MIPA yang telah merasakan
              manfaat platform kami. Dapatkan akses ke forum diskusi, pembuatan
              CV otomatis, dan reward NFT untuk top contributor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300">
                  Daftar Sekarang
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
