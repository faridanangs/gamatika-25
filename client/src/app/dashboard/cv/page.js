'use client';
import { v4 as uuidv4 } from 'uuid';
import { useState, useRef, memo } from 'react';
import {
  PersonalInfoForm,
  LanguagesForm,
  CertificationsForm,
  EducationForm,
  ExperienceForm,
  ProjectsForm,
  SkillsForm,
  SummaryForm,
} from './cv-handler';
import {
  Download,
  Mail,
  Phone,
  MapPin,
  Globe,
  Code,
  Briefcase,
  GraduationCap,
  FolderOpen,
  Award,
  Linkedin,
  Github,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { printPDF } from '@/lib/cvTemplate';
import { CVHandler } from './cv-handler';
import toast from 'react-hot-toast';

// =SIAPKAN uuidv4 JIKA ANDA MENGGUNAKANNYA DI FILE LAIN
// import { v4 as uuidv4 } from 'uuid';

// ===========================================
//       DATA DUMMY UNTUK LAMARAN KURIR
// ===========================================

const dummyPersonalInfo = {
  name: 'Agus Setiawan',
  title: 'Kurir Profesional & Berpengalaman',
  email: 'agus.setiawan.kerja@gmail.com',
  phone: '+62 857 1234 5678',
  location: 'Jakarta Selatan, Indonesia',
  linkedin: '', // Kurir tidak perlu LinkedIn
  github: '', // Kurir tidak perlu GitHub
  portfolio: '', // Kurir tidak perlu portofolio
  image: 'https://i.pravatar.cc/150?img=12', // Menggunakan placeholder avatar
};

const dummySummary =
  'Kurir yang berdedikasi dan dapat diandalkan dengan pengalaman lebih dari 3 tahun di industri logistik dan pengiriman. Menguasai wilayah Jakarta (Selatan, Pusat, Timur) dengan sangat baik. Memiliki rekam jejak terbukti dalam pengiriman paket secara tepat waktu, aman, dan efisien. Berkomitmen tinggi terhadap kepuasan pelanggan dan memiliki catatan berkendara yang bersih.';

const dummySkills = {
  // 'Technical' di sini diartikan sebagai keahlian keras/praktis
  technical: [
    'Mengemudi Sepeda Motor (SIM C Aktif)',
    'Navigasi GPS (Google Maps & Waze)',
    'Manajemen Pengiriman COD (Cash on Delivery)',
    'Perawatan Kendaraan Ringan',
  ],
  soft: [
    'Manajemen Waktu & Tepat Waktu',
    'Pelayanan Pelanggan (Ramah & Sopan)',
    'Mampu Bekerja di Bawah Tekanan',
    'Cekatan dan Cepat Tanggap',
  ],
};

const dummyExperience = [
  {
    id: uuidv4(),
    name: 'PT. Logistik Cepat Indonesia',
    position: 'Kurir Pengiriman (Rider)',
    period: 'Mar 2021 – Sekarang',
    location: 'Jakarta, Indonesia',
    achievements: [
      'Menyelesaikan rata-rata 50+ pengiriman paket per hari dengan tingkat keberhasilan pengiriman 99%.',
      'Secara konsisten menerima rating kepuasan pelanggan di atas 4.8 dari 5.0.',
      'Dipercaya menangani pengiriman barang bernilai tinggi dan COD hingga puluhan juta rupiah per hari.',
      'Menerima penghargaan "Kurir Terbaik" Q3 2023 untuk ketepatan waktu dan minimnya keluhan.',
    ],
  },
  {
    id: uuidv4(),
    name: 'Restoran Sederhana Bintaro',
    position: 'Kurir Pengantar Makanan',
    period: 'Agu 2019 – Feb 2021',
    location: 'Tangerang Selatan',
    achievements: [
      'Memastikan semua pesanan makanan diantar ke pelanggan dalam kondisi baik dan sesuai estimasi waktu.',
      'Membantu proses pengemasan (packing) pesanan saat jam sibuk untuk mempercepat pengiriman.',
      'Mempertahankan catatan berkendara yang bersih 100% tanpa pelanggaran lalu lintas atau kecelakaan.',
    ],
  },
];

const dummyEducation = [
  {
    id: uuidv4(),
    degree: 'Sekolah Menengah Kejuruan (SMK)',
    institution: 'SMK Negeri 2 Jakarta',
    period: '2016 – 2019',
    gpa: '', // GPA tidak relevan untuk SMK
    honors: 'Jurusan: Teknik Otomotif Sepeda Motor',
  },
];

// Bagian Proyek & Sertifikasi dikosongkan karena tidak relevan
const dummyProjects = [];

const dummyCertifications = [];

const dummyLanguages = [
  { id: uuidv4(), name: 'Bahasa Indonesia', level: 'Native' },
  { id: uuidv4(), name: 'Bahasa Inggris', level: 'Dasar' },
];

// ===========================================
//            AKHIR DATA DUMMY
// ===========================================

// ===========================================
//              AKHIR DATA DUMMY
// ===========================================

const CVBuilder = () => {
  const [step, setStep] = useState(1);

  // const [personalInfo, setPersonalInfo] = useState(dummyPersonalInfo);
  // const [summary, setSummary] = useState(''); // String, bukan array
  // const [skills, setSkills] = useState({
  //   // Objek dengan properti technical dan soft
  //   technical: [],
  //   soft: [],
  // });
  // const [experience, setExperience] = useState([]);
  // const [education, setEducation] = useState([]);
  // const [projects, setProjects] = useState([]);
  // const [certifications, setCertifications] = useState([]);
  // const [languages, setLanguages] = useState([]);

  const [personalInfo, setPersonalInfo] = useState(dummyPersonalInfo);
  const [summary, setSummary] = useState(dummySummary);
  const [skills, setSkills] = useState(dummySkills);
  const [experience, setExperience] = useState(dummyExperience);
  const [education, setEducation] = useState(dummyEducation);
  const [projects, setProjects] = useState(dummyProjects);
  const [certifications, setCertifications] = useState(dummyCertifications);
  const [languages, setLanguages] = useState(dummyLanguages);

  const {
    handleAchievementChange,
    handleCertificationChange,
    handleEducationChange,
    handleExperienceChange,
    handleImageChange,
    handleLanguageChange,
    handlePersonalInfoChange,
    handleProjectChange,
    handleSkillChange,
    handleSummaryChange,
    handleTechnologyChange,
    addAchievement,
    addCertification,
    addEducation,
    addExperience,
    addLanguage,
    addProject,
    addSkill,
    addTechnology,
    removeAchievement,
    removeCertification,
    removeEducation,
    removeExperience,
    removeLanguage,
    removeProject,
    removeSkill,
    removeTechnology,
  } = CVHandler({
    setPersonalInfo,
    setCertifications,
    setEducation,
    setExperience,
    setLanguages,
    setProjects,
    setSkills,
    setSummary,
  });

  const downloadPDF = async () => {
    try {
      await printPDF({
        personalInfo,
        summary,
        skills,
        experience,
        education,
        projects,
        certifications,
        languages,
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const goToStep = (stepNumber) => {
    setStep(stepNumber);
  };

  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8">
            <PersonalInfoForm
              personalInfo={personalInfo}
              onChange={handlePersonalInfoChange}
              onImageChange={handleImageChange}
            />
            <SummaryForm summary={summary} onChange={handleSummaryChange} />
            <SkillsForm
              skills={skills}
              onSkillChange={handleSkillChange}
              onAddSkill={addSkill}
              onRemoveSkill={removeSkill}
            />
            <ExperienceForm
              experience={experience}
              onChange={handleExperienceChange}
              onAdd={addExperience}
              onRemove={removeExperience}
              onAchievementChange={handleAchievementChange}
              onAddAchievement={addAchievement}
              onRemoveAchievement={removeAchievement}
            />
            <EducationForm
              education={education}
              onChange={handleEducationChange}
              onAdd={addEducation}
              onRemove={removeEducation}
            />
            <ProjectsForm
              projects={projects}
              onChange={handleProjectChange}
              onAdd={addProject}
              onRemove={removeProject}
              onTechnologyChange={handleTechnologyChange}
              onAddTechnology={addTechnology}
              onRemoveTechnology={removeTechnology}
            />
            <CertificationsForm
              certifications={certifications}
              onChange={handleCertificationChange}
              onAdd={addCertification}
              onRemove={removeCertification}
            />
            <LanguagesForm
              languages={languages}
              onChange={handleLanguageChange}
              onAdd={addLanguage}
              onRemove={removeLanguage}
            />
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => goToStep(2)}
                className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              >
                Lanjut ke Pratinjau
              </Button>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => goToStep(step - 1)}
                  disabled={step === 1}
                  className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => goToStep(step + 1)}
                  className="dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="text-center space-y-6 dark:text-white">
            <h2 className="text-2xl font-bold">Pratinjau CV Anda</h2>
            <p className="text-muted-foreground dark:text-gray-400">
              Periksa CV Anda dan unduh ketika sudah puas.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => goToStep(1)}
                className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              >
                Edit Informasi
              </Button>
              <Button onClick={downloadPDF} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Unduh CV
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen dark:bg-card text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">Pembuat CV Profesional</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Buat CV profesional Anda dalam hitungan menit
          </p>
          {/* Progress Steps */}
          <div className="flex items-center mt-6">
            {[1, 2].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === stepNumber
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {stepNumber}
                </div>
                <span
                  className={`ml-2 ${
                    step === stepNumber
                      ? 'font-semibold'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {stepNumber === 1
                    ? 'Masukkan Informasi'
                    : 'Pratinjau & Unduh'}
                </span>
                {stepNumber < 2 && (
                  <div
                    className={`w-16 h-1 mx-4 ${
                      step === stepNumber
                        ? 'bg-blue-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Form Container */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardContent className="p-6 md:p-8">{renderFormStep()}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CVBuilder;
