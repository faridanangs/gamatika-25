import {
  Briefcase,
  FileText,
  MessageSquare,
  Trophy,
  MessageCircle,
  GraduationCap,
  Award,
  Zap,
  BookOpen,
  Newspaper,
  FilePlus,
} from 'lucide-react';

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
    title: 'Ingfo Loker',
    description: 'Temukan pekerjaan part-time, remote, dan lokasi dekat kampus',
    icon: Briefcase,
    color: 'from-green-500 to-emerald-500',
    gradient: 'from-green-600/10 to-emerald-600/10',
    feature: 'Comming Soon',
  },
  {
    id: 3,
    title: 'Pembuatan CV Otomatis',
    description:
      'Buat CV profesional dalam hitungan menit dengan template yang disediakan',
    icon: FileText,
    color: 'from-purple-500 to-pink-500',
    gradient:
      'from-purple-600/10 to-pink-600/10 dark:from-purple-600/70 dark:to-pink-600/70',
  },
  {
    id: 8,
    title: 'E-Book & Jurnal',
    description:
      'Akses e-book dan jurnal berdasarkan mata kuliah untuk mendukung pembelajaran dan penelitian.',
    icon: BookOpen,
    color: 'from-pink-500 to-red-500',
    gradient: 'from-pink-600/10 to-red-600/10',
  },
  {
    id: 9,
    title: 'Buat Artikel',
    description:
      'Tulis dan publikasikan artikel baru. Mendukung rumus matematika (LaTeX) dan format kode pemrograman.',
    icon: FilePlus,
    color: 'from-indigo-500 to-blue-500',
    gradient: 'from-indigo-600/10 to-blue-600/10',
  },
  {
    id: 10,
    title: 'Blogs',
    description:
      'Jelajahi kumpulan artikel, catatan, dan tutorial terbaru dari civitas akademika.',
    icon: Newspaper,
    color: 'from-green-500 to-teal-500',
    gradient: 'from-green-600/10 to-teal-600/10',
  },
  
  {
    id: 5,
    title: 'Reward NFT',
    description: 'Dapatkan NFT sebagai hadiah untuk top contributor',
    icon: Trophy,
    color: 'from-yellow-500 to-amber-500',
    gradient: 'from-yellow-600/10 to-amber-600/10',
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
    name: 'Maya S.',
    role: 'Mahasiswa Kimia',
    comment:
      'Saya sudah mendapatkan NFT karena menjadi top contributor di forum diskusi. Sangat membantu!',
  },
];

const stats = [
  { label: 'Mahasiswa Aktif', value: '500+' },
  { label: 'Postingan Forum', value: '1000+' },
  { label: 'Lowongan Kerja', value: '500+' },
  { label: 'CV Dibuat', value: '200+' },
];

export { stats, testimonials, features, whyChoose };
