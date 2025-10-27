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

import { printPDF } from '@/lib/cvTemplate';
import { CVHandler } from './cv-handler';
import { Badge } from '@/components/ui/badge';

// const [personalInfo, setPersonalInfo] = useState({
//   name: '',
//   title: '',
//   email: '',
//   phone: '',
//   location: '',
//   linkedin: '',
//   github: '',
//   portfolio: '',
//   image: '',
// });

// const [summary, setSummary] = useState('');

// const [skills, setSkills] = useState({
//   technical: [],
//   soft: [],
// });

// const [experience, setExperience] = useState([]);

// const [education, setEducation] = useState([]);

// const [projects, setProjects] = useState([]);

// const [certifications, setCertifications] = useState([]);

// const [languages, setLanguages] = useState([]);

const CVBuilder = () => {
  const [step, setStep] = useState(1);
  const componentRef = useRef();

  // Data dummy untuk pengujian
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Budi Santoso',
    title: 'Mitra Driver Logistik / Kurir', // Judul yang relevan
    email: 'budi.santoso88@gmail.com',
    phone: '+62 857 1234 5678',
    location: 'Mataram, NTB', // Lokasi yang spesifik
    linkedin: '', // Tidak relevan, dikosongkan
    github: '', // Tidak relevan, dikosongkan
    portfolio: '', // Tidak relevan, dikosongkan
    image: '',
  });

  const [summary, setSummary] = useState(
    'Driver mitra yang jujur dan berdedikasi dengan pengalaman 3+ tahun di bidang logistik dan pengantaran. Sangat menguasai rute dan wilayah Kota Mataram dan sekitarnya. Berkomitmen tinggi untuk mengantarkan paket dan pesanan secara tepat waktu, aman, dan menjaga kepuasan pelanggan.'
  );

  const [skills, setSkills] = useState({
    technical: [
      'Manajemen Rute Pengantaran',
      'Navigasi (Google Maps & Waze)',
      'Penggunaan Aplikasi Driver (Shopee, Gojek, Grab)',
      'Memiliki SIM C Aktif & SKCK',
    ],
    soft: [
      'Manajemen Waktu',
      'Jujur dan Amanah',
      'Disiplin & Tepat Waktu',
      'Komunikasi & Pelayanan Pelanggan',
    ],
  });

  const [experience, setExperience] = useState([
    {
      id: uuidv4(),
      name: 'Mitra ShopeeFood',
      position: 'Mitra Pengemudi',
      period: 'Feb 2021 – Sekarang',
      location: 'Mataram, NTB',
      achievements: [
        'Menyelesaikan rata-rata 25+ orderan per hari secara konsisten.',
        'Mempertahankan rating kepuasan pelanggan 4.9/5.0 selama 2 tahun berturut-turut.',
      ],
    },
    {
      id: uuidv4(),
      name: 'JNE Express (Agen Cakranegara)', // Pengalaman pendukung
      position: 'Kurir Lapangan',
      period: 'Jan 2019 – Feb 2021',
      location: 'Mataram, NTB',
      achievements: [
        'Bertanggung jawab atas pengantaran paket di wilayah Cakranegara dan Sandubaya.',
        'Berhasil mengantarkan 99% paket harian tanpa ada keluhan atau kesalahan alamat.',
        'Membantu proses penyortiran paket di gudang saat jam sibuk.',
      ],
    },
  ]);

  const [education, setEducation] = useState([
    {
      id: uuidv4(),
      degree: 'SMA (Jurusan IPS)', // Pendidikan yang wajar untuk peran ini
      institution: 'SMAN 1 Mataram',
      period: '2015 – 2018',
      gpa: '', // Tidak relevan, dikosongkan
      honors: '', // Tidak relevan, dikosongkan
    },
  ]);

  // Bagian ini tidak relevan untuk driver, jadi dikosongkan
  const [projects, setProjects] = useState([]);

  // Bagian ini juga umumnya tidak ada, jadi dikosongkan
  const [certifications, setCertifications] = useState([]);

  const [languages, setLanguages] = useState([
    {
      id: uuidv4(),
      name: 'Bahasa Indonesia',
      level: 'Lisan & Tulisan (Native)',
    },
    {
      id: uuidv4(),
      name: 'Bahasa Sasak',
      level: 'Lisan (Lokal, membantu navigasi)', // Nilai tambah
    },
  ]);

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

  const downloadPDF = () => {
    printPDF({
      componentRef,
      personalInfo,
      summary,
      skills,
      experience,
      education,
      projects,
      certifications,
      languages,
    });
  };

  const goToStep = (stepNumber) => {
    setStep(stepNumber);
  };

  // Render form steps dengan komponen yang di-memo
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
                Unduh PDF
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
        {/* CV Preview (Hidden until step 2) */}
        {step === 2 && (
          <div
            ref={componentRef}
            className="bg-white dark:bg-gray-800 shadow-lg mt-8 transition-colors duration-300"
            style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              lineHeight: 1.5,
            }}
          >
            {/* Header */}
            <div className="border-b dark:border-gray-700 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold dark:text-white">
                    {personalInfo.name || 'Nama Anda'}
                  </h1>
                  <p className="text-xl md:text-2xl font-semibold mt-2 text-gray-600 dark:text-gray-400">
                    {personalInfo.title || 'Jabatan Anda'}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {personalInfo.email || 'email@example.com'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {personalInfo.phone || '+62 812 3456 7890'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {personalInfo.location || 'Lokasi Anda'}
                      </span>
                    </div>
                    {personalInfo.portfolio && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {personalInfo.portfolio}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {personalInfo.image && (
                  <div className="w-32 h-32 rounded-[40%] overflow-hidden flex-shrink-0">
                    <img
                      src={personalInfo.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            {/* Contact Links */}
            <div className="flex justify-center gap-6 py-4 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600">
              {personalInfo.linkedin && (
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                >
                  <Linkedin className="w-5 h-5 mr-1" />
                  LinkedIn
                </a>
              )}
              {personalInfo.github && (
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 flex items-center"
                >
                  <Github className="w-5 h-5 mr-1" />
                  GitHub
                </a>
              )}
            </div>
            <div className="p-6 md:p-8 space-y-6">
              {/* Professional Summary */}
              {summary && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 border-l-4 border-blue-500 dark:border-blue-400">
                  <p className="text-gray-700 dark:text-gray-300">{summary}</p>
                </div>
              )}
              {/* Skills */}
              {(skills.technical.length > 0 || skills.soft.length > 0) && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 dark:text-white">
                    <Code className="w-6 h-6" />
                    Keahlian
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {skills.technical.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2 dark:text-gray-300">
                          Keahlian Teknis
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {skills.technical.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="dark:bg-gray-700 dark:text-gray-300"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {skills.soft.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2 dark:text-gray-300">
                          Keahlian Lunak
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {skills.soft.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="dark:bg-gray-700 dark:text-gray-300"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Work Experience */}
              {experience.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 dark:text-white">
                    <Briefcase className="w-6 h-6" />
                    Pengalaman Kerja
                  </h2>
                  {experience.map(
                    (exp, index) =>
                      exp.name &&
                      exp.position && (
                        <div key={index} className="mb-6 last:mb-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-xl font-bold dark:text-white">
                                {exp.position}
                              </h3>
                              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                {exp.name}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400">
                                {exp.location || ''}
                              </p>
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 font-medium">
                              {exp.period || ''}
                            </div>
                          </div>
                          {exp.achievements && exp.achievements.length > 0 && (
                            <ul className="space-y-2">
                              {exp.achievements.map(
                                (achievement, achIndex) =>
                                  achievement && (
                                    <li
                                      key={achIndex}
                                      className="flex items-start gap-2"
                                    >
                                      <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                      <span className="text-gray-700 dark:text-gray-300">
                                        {achievement}
                                      </span>
                                    </li>
                                  )
                              )}
                            </ul>
                          )}
                        </div>
                      )
                  )}
                </div>
              )}
              {/* Education */}
              {education.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 dark:text-white">
                    <GraduationCap className="w-6 h-6" />
                    Pendidikan
                  </h2>
                  {education.map(
                    (edu, index) =>
                      edu.degree &&
                      edu.institution && (
                        <div key={index} className="mb-4 last:mb-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-xl font-bold dark:text-white">
                                {edu.degree}
                              </h3>
                              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                {edu.institution}
                              </p>
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 font-medium">
                              {edu.period || ''}
                            </div>
                          </div>
                          {(edu.gpa || edu.honors) && (
                            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                              {edu.gpa && <span>IPK: {edu.gpa}</span>}
                              {edu.honors && (
                                <span className="font-semibold">
                                  {edu.honors}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )
                  )}
                </div>
              )}
              {/* Projects */}
              {projects.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 dark:text-white">
                    <FolderOpen className="w-6 h-6" />
                    Proyek
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map(
                      (project, index) =>
                        project.name &&
                        project.description && (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-lg font-bold dark:text-white">
                                  {project.name}
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                  {project.description}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                {project.link && (
                                  <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
                                  >
                                    Demo
                                  </a>
                                )}
                                {project.github && (
                                  <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
                                  >
                                    GitHub
                                  </a>
                                )}
                              </div>
                            </div>
                            {project.technologies &&
                              project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {project.technologies
                                    .slice(0, 3)
                                    .map((tech, techIndex) => (
                                      <Badge
                                        key={techIndex}
                                        variant="secondary"
                                        className="dark:bg-gray-600 dark:text-gray-300 text-xs"
                                      >
                                        {tech}
                                      </Badge>
                                    ))}
                                  {project.technologies.length > 3 && (
                                    <Badge
                                      variant="secondary"
                                      className="dark:bg-gray-600 dark:text-gray-300 text-xs"
                                    >
                                      +{project.technologies.length - 3} lebih
                                    </Badge>
                                  )}
                                </div>
                              )}
                          </div>
                        )
                    )}
                  </div>
                </div>
              )}
              {/* Certifications */}
              {certifications.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 dark:text-white">
                    <Award className="w-6 h-6" />
                    Sertifikat
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certifications.map(
                      (cert, index) =>
                        cert.name &&
                        cert.issuer && (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <h3 className="text-lg font-bold dark:text-white">
                              {cert.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                              {cert.issuer}
                            </p>
                            <div className="text-gray-500 dark:text-gray-400 mt-1 text-xs font-medium">
                              {cert.date || ''}
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </div>
              )}
              {/* Languages */}
              {languages.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 dark:text-white">
                    Bahasa
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {languages.map(
                      (lang, index) =>
                        lang.name && (
                          <div
                            key={index}
                            className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <span className="font-medium dark:text-white">
                              {lang.name}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400 ml-2 text-sm">
                              - {lang.level || ''}
                            </span>
                          </div>
                        )
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 text-center text-gray-500 dark:text-gray-400 text-sm border-t dark:border-gray-600">
              <p>
                © {new Date().getFullYear()} {personalInfo.name || 'Nama Anda'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVBuilder;
