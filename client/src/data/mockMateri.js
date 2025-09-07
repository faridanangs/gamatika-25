// Data materi mock (dapat diganti dengan API nantinya)
export const mockMateri = {
  'Kalkulus II': {
    semester: 'Ganjil 2023/2024',
    kategori: 'Wajib',
    materi: [
      {
        id: 1,
        judul: 'Minggu 1: Limit dan Kontinuitas',
        tipe: 'Slide',
        file: '/materi/kalkulus2/week1.pdf',
        ukuran: '2.5 MB',
        tanggal: '5 September 2023',
        deskripsi:
          'Pengenalan konsep limit, sifat-sifat limit, dan kontinuitas fungsi',
        downloads: 124,
      },
      {
        id: 2,
        judul: 'Minggu 1: Contoh Soal',
        tipe: 'PDF',
        file: '/materi/kalkulus2/week1-examples.pdf',
        ukuran: '1.8 MB',
        tanggal: '5 September 2023',
        deskripsi: 'Kumpulan contoh soal dan pembahasan limit',
        downloads: 98,
      },
      {
        id: 3,
        judul: 'Minggu 2: Turunan',
        tipe: 'Video',
        file: '/materi/kalkulus2/week2.mp4',
        ukuran: '156 MB',
        tanggal: '12 September 2023',
        deskripsi: 'Video pembelajaran konsep turunan dan aturan turunan',
        downloads: 87,
      },
    ],
    tugas: [
      {
        id: 101,
        judul: 'Tugas 1: Limit',
        deadline: '15 September 2023',
        status: 'Sudah Dikumpulkan',
        nilai: 85,
      },
      {
        id: 102,
        judul: 'Tugas 2: Turunan',
        deadline: '22 September 2023',
        status: 'Belum Dikumpulkan',
        nilai: null,
      },
    ],
  },
  Statistika: {
    semester: 'Ganjil 2023/2024',
    kategori: 'Wajib',
    materi: [
      {
        id: 4,
        judul: 'Minggu 1: Pengantar Statistika',
        tipe: 'Slide',
        file: '/materi/statistika/week1.pdf',
        ukuran: '3.2 MB',
        tanggal: '6 September 2023',
        deskripsi: 'Definisi statistika, jenis-jenis statistika, dan data',
        downloads: 156,
      },
      {
        id: 5,
        judul: 'Minggu 1: Dataset Contoh',
        tipe: 'Excel',
        file: '/materi/statistika/week1-data.xlsx',
        ukuran: '450 KB',
        tanggal: '6 September 2023',
        deskripsi: 'Dataset untuk praktik statistika deskriptif',
        downloads: 78,
      },
    ],
    tugas: [
      {
        id: 103,
        judul: 'Tugas 1: Deskripsi Data',
        deadline: '18 September 2023',
        status: 'Belum Dikumpulkan',
        nilai: null,
      },
    ],
  },
  'Metode Statistika': {
    semester: 'Ganjil 2023/2024',
    kategori: 'Pilihan',
    materi: [
      {
        id: 6,
        judul: 'Minggu 1: Distribusi Normal',
        tipe: 'Slide',
        file: '/materi/metodestat/week1.pdf',
        ukuran: '4.1 MB',
        tanggal: '7 September 2023',
        deskripsi: 'Teori distribusi normal dan tabel distribusi',
        downloads: 92,
      },
    ],
    tugas: [],
  },
};

// E-Book dan Referensi
export const ebookReferensi = [
  {
    id: 201,
    judul: 'Buku Wajib: Kalkulus Edisi 7',
    penulis: 'James Stewart',
    penerbit: 'Salemba Empat',
    tahun: '2016',
    kategori: 'Buku Wajib',
    file: '/ebook/kalkulus-stewart.pdf',
    ukuran: '25.6 MB',
  },
  {
    id: 202,
    judul: 'Buku Tambahan: Introduction to Probability',
    penulis: 'Grinstead & Snell',
    penerbit: 'American Mathematical Society',
    tahun: '2012',
    kategori: 'Buku Tambahan',
    file: '/ebook/probability-grinstead.pdf',
    ukuran: '18.2 MB',
  },
  {
    id: 203,
    judul: 'Jurnal: Journal of Statistical Education',
    penulis: 'Various',
    penerbit: 'American Statistical Association',
    tahun: '2023',
    kategori: 'Jurnal',
    file: '/journal/stat-ed-2023.pdf',
    ukuran: '8.7 MB',
  },
];

// Video Tutorial
export const videoTutorials = [
  {
    id: 301,
    judul: 'Tutorial MATLAB untuk Kalkulus',
    durasi: '15:42',
    channel: 'Gamatika Channel',
    views: '1.2K',
    file: '/video/matlab-kalkulus.mp4',
  },
  {
    id: 302,
    judul: 'Statistika dengan R Studio',
    durasi: '22:15',
    channel: 'Math Lab',
    views: '856',
    file: '/video/statistik-r.mp4',
  },
];
