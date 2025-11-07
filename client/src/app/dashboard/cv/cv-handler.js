'use client';
import { v4 as uuidv4 } from 'uuid';
import { useState, useRef, memo } from 'react';

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
  Plus,
  Trash2,
  User,
  FileText,
  Languages,
  Image,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const CVHandler = ({
  setPersonalInfo,
  setCertifications,
  setEducation,
  setExperience,
  setLanguages,
  setProjects,
  setSkills,
  setSummary,
}) => {
  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPersonalInfo((prev) => ({
          ...prev,
          image: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler untuk summary
  const handleSummaryChange = (value) => {
    setSummary(value);
  };

  // Handler untuk skills
  const handleSkillChange = (type, index, value) => {
    setSkills((prev) => {
      const newSkills = [...prev[type]];
      newSkills[index] = value;
      return {
        ...prev,
        [type]: newSkills,
      };
    });
  };

  const addSkill = (type) => {
    setSkills((prev) => ({
      ...prev,
      [type]: [...prev[type], ''],
    }));
  };

  const removeSkill = (type, index) => {
    setSkills((prev) => {
      const newSkills = [...prev[type]];
      newSkills.splice(index, 1);
      return {
        ...prev,
        [type]: newSkills,
      };
    });
  };

  // Handler untuk experience
  const handleExperienceChange = (index, field, value) => {
    setExperience((prev) => {
      const newExperience = [...prev];
      newExperience[index] = {
        ...newExperience[index],
        [field]: value,
      };
      return newExperience;
    });
  };

  const addExperience = () => {
    setExperience((prev) => [
      ...prev,
      {
        id: uuidv4(),
        name: '',
        position: '',
        period: '',
        location: '',
        achievements: [''],
      },
    ]);
  };

  const removeExperience = (id) => {
    setExperience((prev) => prev.filter((exp) => exp.id !== id));
  };

  const handleAchievementChange = (expId, achIndex, value) => {
    setExperience((prev) => {
      return prev.map((exp) => {
        if (exp.id === expId) {
          const newAchievements = [...exp?.achievements];
          newAchievements[achIndex] = value;
          return { ...exp, achievements: newAchievements };
        }
        return exp;
      });
    });
  };

  const addAchievement = (expId) => {
    setExperience((prev) => {
      return prev.map((exp) => {
        if (exp.id === expId) {
          return { ...exp, achievements: [...exp?.achievements, ''] };
        }
        return exp;
      });
    });
  };

  const removeAchievement = (expId, achIndex) => {
    setExperience((prev) => {
      return prev.map((exp) => {
        if (exp.id === expId) {
          const newAchievements = exp?.achievements.filter(
            (_, i) => i !== achIndex
          );
          return { ...exp, achievements: newAchievements };
        }
        return exp;
      });
    });
  };

  // Handler untuk education
  const handleEducationChange = (index, field, value) => {
    setEducation((prev) => {
      const newEducation = [...prev];
      newEducation[index] = { ...newEducation[index], [field]: value };
      return newEducation;
    });
  };

  const addEducation = () => {
    setEducation((prev) => [
      ...prev,
      {
        id: uuidv4(),
        degree: '',
        institution: '',
        period: '',
        gpa: '',
        honors: '',
      },
    ]);
  };

  const removeEducation = (id) => {
    setEducation((prev) => prev.filter((edu) => edu.id !== id));
  };

  // Handler untuk projects
  const handleProjectChange = (index, field, value) => {
    setProjects((prev) => {
      const newProjects = [...prev];
      newProjects[index] = { ...newProjects[index], [field]: value };
      return newProjects;
    });
  };

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        id: uuidv4(),
        name: '',
        description: '',
        technologies: [''],
        link: '',
        github: '',
      },
    ]);
  };

  const removeProject = (id) => {
    setProjects((prev) => prev.filter((proj) => proj.id !== id));
  };

  const handleTechnologyChange = (projId, techIndex, value) => {
    setProjects((prev) => {
      return prev.map((proj) => {
        if (proj.id === projId) {
          const newTechnologies = [...proj.technologies];
          newTechnologies[techIndex] = value;
          return { ...proj, technologies: newTechnologies };
        }
        return proj;
      });
    });
  };

  const addTechnology = (projId) => {
    setProjects((prev) => {
      return prev.map((proj) => {
        if (proj.id === projId) {
          return { ...proj, technologies: [...proj.technologies, ''] };
        }
        return proj;
      });
    });
  };

  const removeTechnology = (projId, techIndex) => {
    setProjects((prev) => {
      return prev.map((proj) => {
        if (proj.id === projId) {
          const newTechnologies = proj.technologies.filter(
            (_, i) => i !== techIndex
          );
          return { ...proj, technologies: newTechnologies };
        }
        return proj;
      });
    });
  };

  // Handler untuk certifications
  const handleCertificationChange = (index, field, value) => {
    setCertifications((prev) => {
      const newCertifications = [...prev];
      newCertifications[index] = {
        ...newCertifications[index],
        [field]: value,
      };
      return newCertifications;
    });
  };

  const addCertification = () => {
    setCertifications((prev) => [
      ...prev,
      { id: uuidv4(), name: '', issuer: '', date: '' },
    ]);
  };

  const removeCertification = (id) => {
    setCertifications((prev) => prev.filter((cert) => cert.id !== id));
  };

  // Handler untuk languages
  const handleLanguageChange = (index, field, value) => {
    setLanguages((prev) => {
      const newLanguages = [...prev];
      newLanguages[index] = { ...newLanguages[index], [field]: value };
      return newLanguages;
    });
  };

  const addLanguage = () => {
    setLanguages((prev) => [...prev, { id: uuidv4(), name: '', level: '' }]);
  };

  const removeLanguage = (id) => {
    setLanguages((prev) => prev.filter((lang) => lang.id !== id));
  };

  return {
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
  };
};

export const PersonalInfoForm = ({ personalInfo, onChange, onImageChange }) => (
  <Card className="dark:bg-gray-800 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 dark:text-white">
        <User className="w-5 h-5" />
        Informasi Pribadi
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 dark:bg-gray-800 dark:text-gray-100">
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {personalInfo.image ? (
              <img
                src={personalInfo.image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-gray-400" />
            )}
          </div>
          <Label
            htmlFor="image-upload"
            className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer"
          >
            <Image className="w-4 h-4 text-white" />
          </Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="dark:text-gray-300">
            Nama Lengkap *
          </Label>
          <Input
            id="name"
            value={personalInfo.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="John Doe"
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title" className="dark:text-gray-300">
            Jabatan Profesional *
          </Label>
          <Input
            id="title"
            value={personalInfo.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Senior Full Stack Developer"
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="dark:text-gray-300">
            Email *
          </Label>
          <Input
            id="email"
            value={personalInfo.email}
            onChange={(e) => onChange('email', e.target.value)}
            type="email"
            placeholder="john.doe@example.com"
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="dark:text-gray-300">
            Telepon
          </Label>
          <Input
            id="phone"
            value={personalInfo.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="+62 812 3456 7890"
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location" className="dark:text-gray-300">
            Lokasi
          </Label>
          <Input
            id="location"
            value={personalInfo.location}
            onChange={(e) => onChange('location', e.target.value)}
            placeholder="Jakarta, Indonesia"
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="portfolio" className="dark:text-gray-300">
            Website Portfolio
          </Label>
          <Input
            id="portfolio"
            value={personalInfo.portfolio}
            onChange={(e) => onChange('portfolio', e.target.value)}
            placeholder="johndoe.dev"
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin" className="dark:text-gray-300">
            Profil LinkedIn
          </Label>
          <Input
            id="linkedin"
            value={personalInfo.linkedin}
            onChange={(e) => onChange('linkedin', e.target.value)}
            placeholder="linkedin.com/in/johndoe"
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="github" className="dark:text-gray-300">
            Profil GitHub
          </Label>
          <Input
            id="github"
            value={personalInfo.github}
            onChange={(e) => onChange('github', e.target.value)}
            placeholder="github.com/johndoe"
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const SummaryForm = ({ summary, onChange }) => (
  <Card className="dark:bg-gray-800 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 dark:text-white">
        <FileText className="w-5 h-5" />
        Ringkasan Profesional
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 dark:bg-gray-800 dark:text-gray-100">
      <Label htmlFor="summary" className="dark:text-gray-300">
        Ringkasan
      </Label>
      <Textarea
        id="summary"
        value={summary}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Deskripsi singkat pengalaman profesional dan keahlian Anda..."
        rows={4}
        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
    </CardContent>
  </Card>
);

export const SkillsForm = ({
  skills,
  onSkillChange,
  onAddSkill,
  onRemoveSkill,
}) => (
  <Card className="dark:bg-gray-800 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 dark:text-white">
        <Code className="w-5 h-5" />
        Keahlian
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6 dark:bg-gray-800 dark:text-gray-100">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="dark:text-gray-300">Keahlian Teknis</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddSkill('technical')}
            className="flex items-center gap-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          >
            <Plus className="w-4 h-4" />
            Keahlian
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.technical.map((skill, index) => (
            <div
              key={index}
              className="flex items-center bg-secondary dark:bg-gray-700 rounded-md px-3 py-1"
            >
              <Input
                value={skill}
                onChange={(e) =>
                  onSkillChange('technical', index, e.target.value)
                }
                className="bg-transparent border-none focus:outline-none w-full dark:text-white"
                placeholder="Masukkan keahlian"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveSkill('technical', index)}
                className="h-auto p-1 ml-1"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="dark:text-gray-300">Keahlian Lunak</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddSkill('soft')}
            className="flex items-center gap-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          >
            <Plus className="w-4 h-4" />
            Keahlian
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.soft.map((skill, index) => (
            <div
              key={index}
              className="flex items-center bg-secondary dark:bg-gray-700 rounded-md px-3 py-1"
            >
              <Input
                value={skill}
                onChange={(e) => onSkillChange('soft', index, e.target.value)}
                className="bg-transparent border-none focus:outline-none w-full dark:text-white"
                placeholder="Masukkan keahlian"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveSkill('soft', index)}
                className="h-auto p-1 ml-1"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const ExperienceForm = ({
  experience,
  onChange,
  onAdd,
  onRemove,
  onAchievementChange,
  onAddAchievement,
  onRemoveAchievement,
}) => (
  <Card className="dark:bg-gray-800 dark:border-gray-700">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <Briefcase className="w-5 h-5" />
          Pengalaman Kerja
        </CardTitle>
        <Button onClick={onAdd} className="flex items-center gap-1">
          <Plus className="w-4 h-4" />
          <p className="hidden md:inline">Pengalaman</p>
        </Button>
      </div>
    </CardHeader>
    <CardContent className="space-y-6 dark:bg-gray-800 dark:text-gray-100">
      {experience.map((exp, index) => (
        <Card
          key={exp.id}
          className="border-dashed dark:border-gray-700 dark:bg-gray-800"
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg dark:text-white">
                Pengalaman {index + 1}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(exp.id)}
                className="h-auto p-1"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 dark:bg-gray-800 dark:text-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Nama Perusahaan</Label>
                <Input
                  value={exp.name}
                  onChange={(e) => onChange(index, 'name', e.target.value)}
                  placeholder="Nama Perusahaan"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Posisi</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => onChange(index, 'position', e.target.value)}
                  placeholder="Jabatan"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Lokasi</Label>
                <Input
                  value={exp.location}
                  onChange={(e) => onChange(index, 'location', e.target.value)}
                  placeholder="Kota, Negara"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Periode</Label>
                <Input
                  value={exp.period}
                  onChange={(e) => onChange(index, 'period', e.target.value)}
                  placeholder="Jan 2020 – Sekarang"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="dark:text-gray-300">Pencapaian</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddAchievement(exp.id)}
                  className="flex items-center gap-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {exp?.achievements?.map((achievement, achIndex) => (
                  <div key={achIndex} className="flex items-center gap-2">
                    <Input
                      value={achievement}
                      onChange={(e) =>
                        onAchievementChange(exp.id, achIndex, e.target.value)
                      }
                      placeholder="Jelaskan pencapaian Anda..."
                      className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveAchievement(exp.id, achIndex)}
                      className="h-auto p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </CardContent>
  </Card>
);

export const EducationForm = ({ education, onChange, onAdd, onRemove }) => (
  <Card className="dark:bg-gray-800 dark:border-gray-700">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <GraduationCap className="w-5 h-5" />
          Pendidikan
        </CardTitle>
        <Button onClick={onAdd} className="flex items-center gap-1">
          <Plus className="w-4 h-4" />
          <p className="hidden md:inline">Pendidikan</p>
        </Button>
      </div>
    </CardHeader>
    <CardContent className="space-y-6 dark:bg-gray-800 dark:text-gray-100">
      {education.map((edu, index) => (
        <Card
          key={edu.id}
          className="border-dashed dark:border-gray-700 dark:bg-gray-800"
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg dark:text-white">
                Pendidikan {index + 1}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(edu.id)}
                className="h-auto p-1"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 dark:bg-gray-800 dark:text-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Gelar</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => onChange(index, 'degree', e.target.value)}
                  placeholder="Sarjana Komputer"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Institusi</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) =>
                    onChange(index, 'institution', e.target.value)
                  }
                  placeholder="Nama Universitas"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Periode</Label>
                <Input
                  value={edu.period}
                  onChange={(e) => onChange(index, 'period', e.target.value)}
                  placeholder="2013 – 2017"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">IPK (jika ada)</Label>
                <Input
                  value={edu.gpa}
                  onChange={(e) => onChange(index, 'gpa', e.target.value)}
                  placeholder="3.9/4.0"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="dark:text-gray-300">Penghargaan</Label>
                <Input
                  value={edu.honors}
                  onChange={(e) => onChange(index, 'honors', e.target.value)}
                  placeholder="Cum Laude"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </CardContent>
  </Card>
);

export const ProjectsForm = ({
  projects,
  onChange,
  onAdd,
  onRemove,
  onTechnologyChange,
  onAddTechnology,
  onRemoveTechnology,
}) => (
  <Card className="dark:bg-gray-800 dark:border-gray-700">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <FolderOpen className="w-5 h-5" />
          Proyek
        </CardTitle>
        <Button onClick={onAdd} className="flex items-center gap-1">
          <Plus className="w-4 h-4" />
          <p className="hidden md:inline">Proyek</p>
        </Button>
      </div>
    </CardHeader>
    <CardContent className="space-y-6 dark:bg-gray-800 dark:text-gray-100">
      {projects.map((project, index) => (
        <Card
          key={project.id}
          className="border-dashed dark:border-gray-700 dark:bg-gray-800"
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg dark:text-white">
                Proyek {index + 1}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(project.id)}
                className="h-auto p-1"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 dark:bg-gray-800 dark:text-gray-100">
            <div className="space-y-2">
              <Label className="dark:text-gray-300">Nama Proyek</Label>
              <Input
                value={project.name}
                onChange={(e) => onChange(index, 'name', e.target.value)}
                placeholder="Nama Proyek"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="dark:text-gray-300">Deskripsi</Label>
              <Textarea
                value={project.description}
                onChange={(e) => onChange(index, 'description', e.target.value)}
                placeholder="Deskripsi singkat proyek"
                rows={2}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Link Demo</Label>
                <Input
                  value={project.link}
                  onChange={(e) => onChange(index, 'link', e.target.value)}
                  placeholder="https://contoh.com"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Link GitHub</Label>
                <Input
                  value={project.github}
                  onChange={(e) => onChange(index, 'github', e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="dark:text-gray-300">
                  Teknologi yang Digunakan
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddTechnology(project.id)}
                  className="flex items-center gap-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, techIndex) => (
                  <div
                    key={techIndex}
                    className="flex items-center bg-secondary dark:bg-gray-700 rounded-md px-3 py-1"
                  >
                    <Input
                      value={tech}
                      onChange={(e) =>
                        onTechnologyChange(
                          project.id,
                          techIndex,
                          e.target.value
                        )
                      }
                      className="bg-transparent border-none focus:outline-none w-full dark:text-white"
                      placeholder="Teknologi"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveTechnology(project.id, techIndex)}
                      className="h-auto p-1 ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </CardContent>
  </Card>
);

export const CertificationsForm = ({
  certifications,
  onChange,
  onAdd,
  onRemove,
}) => (
  <Card className="dark:bg-gray-800 dark:border-gray-700">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <Award className="w-5 h-5" />
          Sertifikat
        </CardTitle>
        <Button onClick={onAdd} className="flex items-center gap-1">
          <Plus className="w-4 h-4" />
          <p className="hidden md:inline">Sertifikat</p>
        </Button>
      </div>
    </CardHeader>
    <CardContent className="space-y-6 dark:bg-gray-800 dark:text-gray-100">
      {certifications.map((cert, index) => (
        <Card
          key={cert.id}
          className="border-dashed dark:border-gray-700 dark:bg-gray-800"
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg dark:text-white">
                Sertifikat {index + 1}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(cert.id)}
                className="h-auto p-1"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Nama Sertifikat</Label>
                <Input
                  value={cert.name}
                  onChange={(e) => onChange(index, 'name', e.target.value)}
                  placeholder="AWS Certified Solutions Architect"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Penerbit</Label>
                <Input
                  value={cert.issuer}
                  onChange={(e) => onChange(index, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Tanggal Diperoleh</Label>
                <Input
                  value={cert.date}
                  onChange={(e) => onChange(index, 'date', e.target.value)}
                  placeholder="2022"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </CardContent>
  </Card>
);

export const LanguagesForm = ({ languages, onChange, onAdd, onRemove }) => (
  <Card className="dark:bg-gray-800 dark:border-gray-700">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <Languages className="w-5 h-5" />
          Bahasa
        </CardTitle>
        <Button onClick={onAdd} className="flex items-center gap-1">
          <Plus className="w-4 h-4" />
          <p className="hidden md:inline">Bahasa</p>
        </Button>
      </div>
    </CardHeader>
    <CardContent className="space-y-6 dark:bg-gray-800 dark:text-gray-100">
      {languages.map((lang, index) => (
        <Card
          key={lang.id}
          className="border-dashed dark:border-gray-700 dark:bg-gray-800"
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg dark:text-white">
                Bahasa {index + 1}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(lang.id)}
                className="h-auto p-1"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Bahasa</Label>
                <Input
                  value={lang.name}
                  onChange={(e) => onChange(index, 'name', e.target.value)}
                  placeholder="Bahasa Inggris"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Tingkat Kefasihan</Label>
                <Select
                  value={lang.level}
                  onValueChange={(value) => onChange(index, 'level', value)}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue placeholder="Pilih tingkat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Native">Bahasa Ibu</SelectItem>
                    <SelectItem value="Fluent">Fasih</SelectItem>
                    <SelectItem value="Conversational">Percakapan</SelectItem>
                    <SelectItem value="Basic">Dasar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </CardContent>
  </Card>
);
