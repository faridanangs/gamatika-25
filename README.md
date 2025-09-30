# 🎓 Delta Civitas - Ekosistem Digital Mahasiswa MIPA

> Ekosistem digital terintegrasi yang dirancang untuk mendukung kolaborasi, inovasi, dan akselerasi karir mahasiswa Matematika dan Ilmu Pengetahuan Alam (MIPA).

![Delta Civitas Banner](https://github.com/faridanangs/gamatika-25/blob/main/client/public/img/herro-delta-civitas.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black.svg?logo=next.js)](https://nextjs.org/)
[![Go](https://img.shields.io/badge/Go-1.23-00ADD8.svg?logo=go)](https://golang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue.svg?logo=postgresql)](https://www.postgresql.org/)
[![Solidity](https://img.shields.io/badge/Solidity-gray?logo=solidity)](https://soliditylang.org/)

## 📋 Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Visi & Misi](#visi--misi)
- [Fitur Utama](#fitur-utama)
- [Tumpukan Teknologi](#tumpukan-teknologi)
- [Instalasi](#instalasi)
- [Lisensi](#lisensi)

## 📖 Tentang Proyek

**Delta Civitas** adalah sebuah ekosistem digital yang dirancang khusus untuk menjawab kebutuhan mahasiswa MIPA. Kami memahami tantangan dalam mengakses sumber daya akademik, membangun jaringan, dan mempersiapkan karir. Oleh karena itu, Delta Civitas hadir sebagai platform terpusat yang menggabungkan forum diskusi, perpustakaan digital, alat pengembangan karir, hingga inovasi Web3 untuk mendukung perjalanan akademik dan profesional mahasiswa.

Proyek ini dimulai dengan ruang lingkup untuk **Universitas Mataram**, dengan visi besar untuk dapat digunakan oleh seluruh mahasiswa MIPA di Indonesia.

---

### 🎯 Visi & Misi

#### **Visi**
Menjadi ekosistem digital pilihan utama yang memberdayakan kolaborasi, inovasi, dan akselerasi karir bagi seluruh mahasiswa MIPA di Indonesia.

#### **Misi**
1.  **Sentralisasi Sumber Daya:** Menyediakan akses terpusat ke e-book, jurnal, dan materi akademik yang relevan.
2.  **Membangun Komunitas:** Menciptakan ruang diskusi yang aktif dan kolaboratif untuk berbagi pengetahuan dan ide.
3.  **Menjembatani Karir:** Membekali mahasiswa dengan alat bantu seperti pembuat CV ATS-friendly dan informasi lowongan kerja.
4.  **Mendorong Inovasi:** Mengintegrasikan teknologi modern seperti AI dan Web3 (NFTs) untuk memberikan penghargaan dan pengalaman belajar yang unik.

---

## ✨ Fitur Utama

-   **💬 Forum Diskusi:** Berinteraksi, bertanya, dan berbagi pengetahuan dengan sesama mahasiswa MIPA melalui postingan, komentar, dan fitur berbagi.
-   **📚 Perpustakaan Digital:** Akses e-book dan jurnal yang dikategorikan berdasarkan mata kuliah untuk mempermudah pencarian.
-   **📄 Pembuat CV ATS-Friendly:** Buat CV profesional dengan template siap pakai yang ramah sistem pelacakan pelamar (ATS) hanya dengan mengisi data diri.
-   **🤖 Asisten AI:** Dapatkan bantuan dan konsultasi cepat mengenai berbagai topik akademik melalui chat AI yang terintegrasi.
-   **🏆 Reward NFT:** Jadilah kontributor teratas di forum dan dapatkan penghargaan eksklusif berupa NFT yang di-minting setiap 7 hari.
-   **💼 Info Loker:** Jelajahi informasi lowongan kerja terbaru yang relevan dengan bidang MIPA (dapat diakses tanpa login).
-   **📢 Papan Pengumuman:** Tetap update dengan pengumuman penting dari komunitas Delta Civitas (dapat diakses tanpa login).

---

## 🛠️ Tumpukan Teknologi

Proyek ini dibangun menggunakan arsitektur modern dengan pemisahan antara frontend, backend, dan smart contract.

### **Frontend**
-   **Framework**: [Next.js](https://nextjs.org/) (`15.5.2`)
-   **Language**: JavaScript
-   **UI Library**: [shadcn/ui](https://ui.shadcn.com/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/) (`v4.24.11`)

### **Backend**
-   **Language**: [Go](https://golang.org/) (`1.23.6`)
-   **Framework**: [GoFiber](https://gofiber.io/) (`v2.52.9`)
-   **ORM**: [GORM](https://gorm.io/)
-   **Validation**: [Validator](https://github.com/go-playground/validator)

### **Database**
-   [PostgreSQL](https://www.postgresql.org/)

### **Web3 & Smart Contract**
-   **Language**: [Solidity](https://soliditylang.org/)
-   **Development Environment**: [Hardhat](https://hardhat.org/)
-   **Library**: [Ethers.js](https://ethers.org/)

---

## 📦 Instalasi

### **Prasyarat**
-   Node.js `v22.x` atau lebih baru
-   Go `v1.23.x` atau lebih baru
-   PostgreSQL Server
-   Git

### **Langkah-langkah**

1.  **Clone repository ini:**
    ```bash
    git clone https://github.com/faridanangs/gamatika-25.git
    cd gamatika-25
    ```

2.  **Setup Frontend:**
    ```bash
    cd client
    npm install
    # Buat file .env.local dan konfigurasikan variabel yang dibutuhkan
    npm run dev
    ```

3.  **Setup Backend:**
    ```bash
    cd server
    # Buat file .env dan konfigurasikan koneksi database
    go mod tidy
    go run main.go
    ```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](https://opensource.org/licenses/MIT).
