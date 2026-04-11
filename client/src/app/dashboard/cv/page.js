"use client";
import { useState, useRef, memo, useEffect } from "react";
import {
  PersonalInfoForm,
  LanguagesForm,
  CertificationsForm,
  EducationForm,
  ExperienceForm,
  ProjectsForm,
  SkillsForm,
  SummaryForm,
} from "./cv-handler";
import { Download, ChevronRight, DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { printPDF } from "@/lib/cvTemplate";
import { CVHandler } from "./cv-handler";
import toast from "react-hot-toast";
import Link from "next/link";

const dummyPersonalInfo = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  portfolio: "",
  image: "",
};

export const CVBuilder = () => {
  // // State isMounted untuk mencegah Hydration Error di Next.js
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false)

  const [personalInfo, setPersonalInfo] = useState(dummyPersonalInfo);
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState({
    technical: [],
    soft: [],
  });
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [languages, setLanguages] = useState([]);

  // 1. Load data dari localStorage saat halaman pertama kali dirender
  useEffect(() => {
    setIsMounted(true);
    const savedData = localStorage.getItem("cvDataDraft");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.personalInfo) setPersonalInfo(parsed.personalInfo);
        if (parsed.summary) setSummary(parsed.summary);
        if (parsed.skills) setSkills(parsed.skills);
        if (parsed.experience) setExperience(parsed.experience);
        if (parsed.education) setEducation(parsed.education);
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.certifications) setCertifications(parsed.certifications);
        if (parsed.languages) setLanguages(parsed.languages);
      } catch (error) {
        console.error("Gagal mem-parsing data CV dari localStorage", error);
      }
    }
  }, []);

  // 2. Simpan data ke localStorage setiap kali ada perubahan pada form
  useEffect(() => {
    if (isMounted) {
      const cvData = {
        personalInfo,
        summary,
        skills,
        experience,
        education,
        projects,
        certifications,
        languages,
      };
      
      try {
        localStorage.setItem("cvDataDraft", JSON.stringify(cvData));
      } catch (error) {
        console.warn("Gagal menyimpan ke localStorage. File gambar mungkin terlalu besar.", error);
      }
    }
  }, [
    personalInfo,
    summary,
    skills,
    experience,
    education,
    projects,
    certifications,
    languages,
    isMounted
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

const downloadPDF = async () => {
    setIsDownloading(true); // Mulai loading
    const toastId = toast.loading("Sedang menyiapkan CV Anda...");
    
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
      toast.success("CV berhasil diunduh!", { id: toastId });
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsDownloading(false); // Selesai loading
    }
  };

  const goToStep = (stepNumber) => {
    setStep(stepNumber);
  };

  const renderFormStep = () => {
    // Jika belum di-mount di sisi client, render null (mencegah error UI berkedip)
    if (!isMounted) return null;

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
              <div className="flex space-x-4">
                <Button
                  onClick={() => goToStep(step + 1)}
                  className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
                >
                  Next <ChevronRight className="w-4 h-4" />
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
    <div className="min-h-screen dark:bg-transparent text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 space-y-2">
          <span className="flex lg:justify-between lg:items-center flex-col lg:flex-row">
            <h1 className="text-3xl font-bold">Pembuat CV Profesional</h1>{" "}
            <Link
              href="/cv-template.pdf"
              className={`text-black border-2 dark:text-white my-1 font-sans flex gap-2 px-2 bg-linear-to-r w-[8em] items-center justify-center text-center from-green-600/10 to-emerald-600/10 rounded-md cursor-pointer`}
            >
              template <DownloadIcon className="size-4 inline-block"/>
            </Link>
          </span>
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
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {stepNumber}
                </div>
                <span
                  className={`ml-2 ${
                    step === stepNumber
                      ? "font-semibold"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {stepNumber === 1
                    ? "Masukkan Informasi"
                    : "Pratinjau & Unduh"}
                </span>
                {stepNumber < 2 && (
                  <div
                    className={`w-16 h-1 mx-4 ${
                      step === stepNumber
                        ? "bg-blue-500"
                        : "bg-gray-200 dark:bg-gray-700"
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