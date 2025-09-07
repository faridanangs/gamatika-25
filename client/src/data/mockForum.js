// Mock data forum posts
export const mockPosts = [
  {
    id: 1,
    title: 'Bantuan soal Integral Tak Tentu',
    content:
      'Saya bingung menyelesaikan integral dari fungsi ∫(x^2 + 3x + 2)dx. Apakah ada yang bisa bantu?',
    category: 'Kalkulus',
    author: {
      id: 6,
      name: 'Fajar Pratama',
      avatar: 'https://i.pravatar.cc',
    },
    likes: 12,
    commentCount: 8,
    shares: 2,
    timestamp: '2 jam yang lalu',
    liked: false,
    images: ['/img/linear.jpeg', '/img/random.jpeg'],
    comments: [
      {
        id: 101,
        author: {
          id: 1,
          name: 'Ahmad Rizki',
          avatar: 'https://i.pravatar.cc',
        },
        content: 'Coba gunakan metode substitusi: misalkan u = x+1',
        timestamp: '1 jam yang lalu',
        images: [],
      },
      {
        id: 102,
        author: {
          id: 7,
          name: 'Rina Wijaya',
          avatar: 'https://i.pravatar.cc',
        },
        content: 'Saya punya solut lengkapnya, mau kirim?',
        timestamp: '30 menit yang lalu',
        images: ['/img/linear.jpeg'],
      },
    ],
  },
  {
    id: 2,
    title: 'Diskusi tentang Matriks',
    content:
      'Sedang belajar matriks 3x3. Ada yang bisa jelaskan konsep determinan dan invers matriks?',
    category: 'Aljabar Linear',
    author: {
      id: 1,
      name: 'Ahmad Rizki',
      avatar: 'https://i.pravatar.cc',
    },
    likes: 24,
    commentCount: 15,
    shares: 5,
    timestamp: '5 jam yang lalu',
    liked: true,
    images: ['/img/linear.jpeg', '/img/linear.jpeg', '/img/linear.jpeg'],
    comments: [],
  },
];

// Categories for filtering
export const categories = [
  'Semua',
  'Kalkulus',
  'Aljabar Linear',
  'Statistika',
  'Geometri',
  'Matematika Terapan',
];

export const mockContributors = [
  {
    id: 1,
    name: 'Ahmad Rizki',
    avatar: 'https://i.pravatar.cc',
    posts: 45,
    points: 1250,
    expertise: ['Kalkulus', 'Aljabar Linear'],
  },
  {
    id: 2,
    name: 'Siti Nurhaliza',
    avatar: 'https://i.pravatar.cc',
    posts: 38,
    points: 980,
    expertise: ['Statistika', 'Probabilitas'],
  },
  {
    id: 3,
    name: 'Budi Santoso',
    avatar: 'https://i.pravatar.cc',
    posts: 32,
    points: 850,
    expertise: ['Geometri', 'Trigonometri'],
  },
  {
    id: 4,
    name: 'Maya Putri',
    avatar: 'https://i.pravatar.cc',
    posts: 28,
    points: 720,
    expertise: ['Analisis Real', 'Persamaan Diferensial'],
  },
  {
    id: 5,
    name: 'Dewa Kusuma',
    avatar: 'https://i.pravatar.cc',
    posts: 25,
    points: 680,
    expertise: ['Matematika Finansial', 'Optimasi'],
  },
];
