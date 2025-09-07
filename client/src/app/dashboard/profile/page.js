'use client';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [userStats, setUserStats] = useState({
    posts: 0,
    comments: 0,
    likes: 0,
    solutions: 0,
    badges: 0,
  });

  // Mock data - ganti dengan data real dari API
  useEffect(() => {
    // Simulasi fetch data
    setUserStats({
      posts: 24,
      comments: 156,
      likes: 892,
      solutions: 18,
      badges: 5,
    });
  }, []);

  return (
    <div className="max-w-5xl md:mx-auto pt-1 pb-2 space-y-8 px-1 ">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-xl border border-primary/20">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-4xl text-primary-foreground">
            ∑
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold">Ahmad Rizki</h2>
            <p className="text-muted-foreground">Mahasiswa Matematika</p>
            <p className="text-sm mt-2">GAMATIKA 25 | Semester 4</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card shadow-xl border-b-[2px]  p-4 rounded-xl border border-border text-center">
          <div className="text-3xl font-bold text-primary">
            {userStats.posts}
          </div>
          <div className="text-sm text-muted-foreground">Postingan</div>
        </div>
        <div className="bg-card shadow-xl border-b-[2px]  p-4 rounded-xl border border-border text-center">
          <div className="text-3xl font-bold text-primary">
            {userStats.solutions}
          </div>
          <div className="text-sm text-muted-foreground">Solusi</div>
        </div>
        <div className="bg-card shadow-xl border-b-[2px]  p-4 rounded-xl border border-border text-center">
          <div className="text-3xl font-bold text-primary">
            {userStats.badges}
          </div>
          <div className="text-sm text-muted-foreground">Penghargaan</div>
        </div>
      </div>

      {/* Academic Info */}
      <div className="bg-card shadow-xl border-b-[2px]  p-6 rounded-xl border border-border">
        <h3 className="text-xl font-semibold mb-4">Informasi Akademik</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">NIM</p>
            <p className="font-medium">2101234567</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Program Studi</p>
            <p className="font-medium">Matematika</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Angkatan</p>
            <p className="font-medium">2021</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">IPK Terakhir</p>
            <p className="font-medium">3.85</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-card shadow-xl border-b-[2px]  p-6 rounded-xl border border-border">
        <h3 className="text-xl font-semibold mb-4">Pencapaian</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
            <div className="text-2xl">🏆</div>
            <div>
              <p className="font-medium">Top Contributor</p>
              <p className="text-sm text-muted-foreground">Forum Matematika</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
            <div className="text-2xl">🎯</div>
            <div>
              <p className="font-medium">Problem Solver</p>
              <p className="text-sm text-muted-foreground">
                50+ Soal Terselesaikan
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
            <div className="text-2xl">⭐</div>
            <div>
              <p className="font-medium">Excellent Rating</p>
              <p className="text-sm text-muted-foreground">4.9/5.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card shadow-xl border-b-[2px]  p-6 rounded-xl border border-border">
        <h3 className="text-xl font-semibold mb-4">Aktivitas Terbaru</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              ✅
            </div>
            <div>
              <p className="font-medium">
                Menyelesaikan Soal: Integral Tak Tentu
              </p>
              <p className="text-sm text-muted-foreground">2 jam yang lalu</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              💬
            </div>
            <div>
              <p className="font-medium">
                Membalas Pertanyaan: Turunan Parsial
              </p>
              <p className="text-sm text-muted-foreground">5 jam yang lalu</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              📝
            </div>
            <div>
              <p className="font-medium">Membuat Postingan: Teori Bilangan</p>
              <p className="text-sm text-muted-foreground">1 hari yang lalu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
