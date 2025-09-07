// Data jadwal mock (dapat diganti dengan API nantinya)
export const mockJadwal = {
  'Semester Ganjil 2023/2024': [
    {
      hari: 'Senin',
      waktu: '08:00-09:40',
      mataKuliah: 'Kalkulus II',
      dosen: 'Dr. Ahmad Rizki, M.Si',
      ruang: 'Ruang A101',
      kelas: 'Matematika A',
    },
    {
      hari: 'Senin',
      waktu: '10:00-11:40',
      mataKuliah: 'Statistika',
      dosen: 'Dr. Siti Nurhaliza, M.Si',
      ruang: 'Ruang B201',
      kelas: 'Matematika A',
    },
    {
      hari: 'Selasa',
      waktu: '08:00-09:40',
      mataKuliah: 'Metode Statistika',
      dosen: 'Dr. Budi Santoso, M.Si',
      ruang: 'Lab Komputer 1',
      kelas: 'Matematika A',
    },
    {
      hari: 'Selasa',
      waktu: '13:00-14:40',
      mataKuliah: 'Analisis Real I',
      dosen: 'Dr. Maya Putri, M.Si',
      ruang: 'Ruang C301',
      kelas: 'Matematika A',
    },
    {
      hari: 'Rabu',
      waktu: '08:00-09:40',
      mataKuliah: 'Pemrograman Matematika',
      dosen: 'Dr. Dewa Kusuma, M.Si',
      ruang: 'Lab Komputer 2',
      kelas: 'Matematika A',
    },
    {
      hari: 'Kamis',
      waktu: '10:00-11:40',
      mataKuliah: 'Aljabar Linear',
      dosen: 'Dr. Ahmad Rizki, M.Si',
      ruang: 'Ruang A101',
      kelas: 'Matematika A',
    },
  ],
  'Semester Genap 2023/2024': [
    {
      hari: 'Senin',
      waktu: '08:00-09:40',
      mataKuliah: 'Analisis Kompleks',
      dosen: 'Dr. Siti Nurhaliza, M.Si',
      ruang: 'Ruang A101',
      kelas: 'Matematika A',
    },
    {
      hari: 'Selasa',
      waktu: '10:00-11:40',
      mataKuliah: 'Persamaan Diferensial',
      dosen: 'Dr. Budi Santoso, M.Si',
      ruang: 'Ruang B201',
      kelas: 'Matematika A',
    },
    {
      hari: 'Rabu',
      waktu: '13:00-14:40',
      mataKuliah: 'Matematika Finansial',
      dosen: 'Dr. Maya Putri, M.Si',
      ruang: 'Ruang C301',
      kelas: 'Matematika A',
    },
    {
      hari: 'Kamis',
      waktu: '08:00-09:40',
      mataKuliah: 'Optimasi',
      dosen: 'Dr. Dewa Kusuma, M.Si',
      ruang: 'Lab Komputer 1',
      kelas: 'Matematika A',
    },
  ],
};

export const jadwalData = {
  Senin: [
    {
      id: 1,
      mataKuliah: 'Kalkulus I',
      dosen: 'Dr. Ahmad',
      kelas: 'Matematika A',
      jamMulai: '07:00',
      jamSelesai: '09:00',
    },
    {
      id: 2,
      mataKuliah: 'Aljabar Linear',
      dosen: 'Prof. Siti',
      kelas: 'Matematika B',
      jamMulai: '08:00',
      jamSelesai: '10:00',
    },
    {
      id: 3,
      mataKuliah: 'Statistika',
      dosen: 'Dr. Budi',
      kelas: 'Matematika A',
      jamMulai: '10:00',
      jamSelesai: '12:00',
    },
  ],
  Selasa: [
    {
      id: 4,
      mataKuliah: 'Kalkulus II',
      dosen: 'Dr. Cici',
      kelas: 'Matematika B',
      jamMulai: '07:00',
      jamSelesai: '09:00',
    },
    {
      id: 5,
      mataKuliah: 'Pemrograman',
      dosen: 'Prof. Dedi',
      kelas: 'Matematika A',
      jamMulai: '13:00',
      jamSelesai: '15:00',
    },
  ],
  Rabu: [
    {
      id: 6,
      mataKuliah: 'Metode Statistik',
      dosen: 'Dr. Eka',
      kelas: 'Matematika B',
      jamMulai: '07:00',
      jamSelesai: '10:00',
    },
  ],
  Kamis: [
    {
      id: 7,
      mataKuliah: 'Matematika Diskrit',
      dosen: 'Prof. Fajar',
      kelas: 'Matematika A',
      jamMulai: '08:00',
      jamSelesai: '10:00',
    },
    {
      id: 8,
      mataKuliah: 'Fisika Matematika',
      dosen: 'Dr. Galih',
      kelas: 'Matematika B',
      jamMulai: '10:00',
      jamSelesai: '12:00',
    },
  ],
  Jumat: [
    {
      id: 9,
      mataKuliah: 'Analisis Real',
      dosen: 'Dr. Hani',
      kelas: 'Matematika A',
      jamMulai: '07:00',
      jamSelesai: '09:00',
    },
  ],
};

// Time slots for the day
export const timeSlots = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
];

export const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

// Kalender akademik
export const kalenderAkademik = [
  {
    tanggal: '1 September 2023',
    event: 'Awal Semester Ganjil 2023/2024',
    type: 'semester',
  },
  {
    tanggal: '15-20 Oktober 2023',
    event: 'UTS Semester Ganjil',
    type: 'ujian',
  },
  {
    tanggal: '20 November 2023',
    event: 'UAS Semester Ganjil',
    type: 'ujian',
  },
  {
    tanggal: '1 Februari 2024',
    event: 'Awal Semester Genap 2023/2024',
    type: 'semester',
  },
  {
    tanggal: '15-20 April 2024',
    event: 'UTS Semester Genap',
    type: 'ujian',
  },
  {
    tanggal: '20 Mei 2024',
    event: 'UAS Semester Genap',
    type: 'ujian',
  },
];
