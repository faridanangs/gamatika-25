import {
  GraduationCap,
  MessageCircle,
  Share2,
  Mail,
  BookOpen,
  FilePlus,
  Trophy,
  Briefcase,
  FileText,
  MessageSquare,
  Newspaper,
} from 'lucide-react';
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-br from-gray-900 to-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <GraduationCap className="h-8 w-8 text-blue-400 mr-2" />
              <h3 className="text-xl font-bold">Delta Civitas</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Platform khusus untuk mahasiswa Fakultas MIPA dengan fitur yang
              relevan. Bergabunglah untuk belajar, berbagi, dan berkembang.
            </p>
            <div className="flex space-x-2">
              <div className="bg-blue-500/10 rounded-lg p-2">
                <span className="text-blue-400 font-semibold">5,000+</span>
                <span className="text-gray-400 text-sm block">Mahasiswa</span>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-2">
                <span className="text-purple-400 font-semibold">10,000+</span>
                <span className="text-gray-400 text-sm block">Postingan</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 flex items-center">
              <Briefcase className="mr-2 text-green-400" /> Fitur Utama
            </h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center hover:text-white transition cursor-pointer">
                <MessageCircle className="mr-2 h-4 w-4 text-blue-400" />
                Forum Diskusi
              </li>
              <li className="flex items-center hover:text-white transition cursor-pointer">
                <Briefcase className="mr-2 h-4 w-4 text-green-400" />
                Info Loker
                <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                  Coming Soon
                </span>
              </li>
              <li className="flex items-center hover:text-white transition cursor-pointer">
                <FileText className="mr-2 h-4 w-4 text-purple-400" />
                Pembuatan CV Otomatis
              </li>
              <li className="flex items-center hover:text-white transition cursor-pointer">
                <MessageSquare className="mr-2 h-4 w-4 text-orange-400" />
                Chat dengan AI
              </li>
              <li className="flex items-center hover:text-white transition cursor-pointer">
                <Trophy className="mr-2 h-4 w-4 text-yellow-400" />
                Reward NFT
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 flex items-center">
              <BookOpen className="mr-2 text-pink-400" /> Komunitas & Sumber
              Belajar
            </h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center hover:text-white transition cursor-pointer">
                <BookOpen className="mr-2 h-4 w-4 text-pink-400" />
                E-Book & Jurnal
              </li>
              <li className="flex items-center hover:text-white transition cursor-pointer">
                <FilePlus className="mr-2 h-4 w-4 text-indigo-400" />
                Buat Artikel
              </li>
              <li className="flex items-center hover:text-white transition cursor-pointer">
                <Newspaper className="mr-2 h-4 w-4 text-green-400" />
                Blogs
              </li>
              <li className="flex items-center hover:text-white transition cursor-pointer">
                <Trophy className="mr-2 h-4 w-4 text-yellow-400" />
                NFT Marketplace
              </li>
              <li className="flex items-center hover:text-white transition cursor-pointer">
                <MessageCircle className="mr-2 h-4 w-4 text-blue-400" />
                Event Komunitas
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 flex items-center">
              <Mail className="mr-2 text-blue-400" /> Hubungi Kami
            </h4>
            <p className="text-gray-400 mb-4">support@deltacivitas.ac.id</p>
            <div className="flex space-x-4 mb-6">
              <a
                href="#"
                className="bg-gray-800 hover:bg-blue-600 rounded-full p-2 transition"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-green-600 rounded-full p-2 transition"
              >
                <Share2 size={20} />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-purple-600 rounded-full p-2 transition"
              >
                <GraduationCap size={20} />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-blue-500 rounded-full p-2 transition"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; {currentYear} Delta Civitas. All rights reserved.
            </p>
            <div className="flex space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition">
                Tentang Kami
              </a>
              <a href="#" className="hover:text-white transition">
                Kebijakan Privasi
              </a>
              <a href="#" className="hover:text-white transition">
                Syarat & Ketentuan
              </a>
              <a href="#" className="hover:text-white transition">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
