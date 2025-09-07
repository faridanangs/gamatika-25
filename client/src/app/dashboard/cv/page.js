'use client';
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
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Komponen form yang di-memo untuk optimasi rendering
const PersonalInfoForm = ({ personalInfo, onChange }) => (
  <Card className="dark:bg-gray-800 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 dark:text-white">
        <User className="w-5 h-5" />
        Personal Information
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 dark:bg-gray-800 dark:text-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="dark:text-gray-300">
            Full Name *
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
            Professional Title *
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
            Phone
          </Label>
          <Input
            id="phone"
            value={personalInfo.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location" className="dark:text-gray-300">
            Location
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
            Portfolio Website
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
            LinkedIn Profile
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
            GitHub Profile
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

const SummaryForm = ({ summary, onChange }) => (
  <Card className="dark:bg-gray-800 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 dark:text-white">
        <FileText className="w-5 h-5" />
        Professional Summary
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 dark:bg-gray-800 dark:text-gray-100">
      <Label htmlFor="summary" className="dark:text-gray-300">
        Summary
      </Label>
      <Textarea
        id="summary"
        value={summary}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Brief description of your professional experience and skills..."
        rows={4}
        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
    </CardContent>
  </Card>
);

const SkillsForm = ({ skills, onSkillChange, onAddSkill, onRemoveSkill }) => (
  <Card className="dark:bg-gray-800 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 dark:text-white">
        <Code className="w-5 h-5" />
        Skills
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6 dark:bg-gray-800 dark:text-gray-100">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="dark:text-gray-300">Technical Skills</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddSkill('technical')}
            className="flex items-center gap-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          >
            <Plus className="w-4 h-4" />
            Add Skill
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
                placeholder="Enter skill"
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
          <Label className="dark:text-gray-300">Soft Skills</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddSkill('soft')}
            className="flex items-center gap-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          >
            <Plus className="w-4 h-4" />
            Add Skill
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
                placeholder="Enter skill"
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

const ExperienceForm = ({
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
          Work Experience
        </CardTitle>
        <Button onClick={onAdd} className="flex items-center gap-1">
          <Plus className="w-4 h-4" />
          Add Experience
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
                Experience {index + 1}
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
                <Label className="dark:text-gray-300">Company Name</Label>
                <Input
                  value={exp.name}
                  onChange={(e) => onChange(index, 'name', e.target.value)}
                  placeholder="Company Name"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Position</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => onChange(index, 'position', e.target.value)}
                  placeholder="Position Title"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Location</Label>
                <Input
                  value={exp.location}
                  onChange={(e) => onChange(index, 'location', e.target.value)}
                  placeholder="City, Country"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Period</Label>
                <Input
                  value={exp.period}
                  onChange={(e) => onChange(index, 'period', e.target.value)}
                  placeholder="Jan 2020 – Present"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="dark:text-gray-300">Achievements</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddAchievement(exp.id)}
                  className="flex items-center gap-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                >
                  <Plus className="w-4 h-4" />
                  Add Achievement
                </Button>
              </div>
              <div className="space-y-2">
                {exp.achievements.map((achievement, achIndex) => (
                  <div key={achIndex} className="flex items-center gap-2">
                    <Input
                      value={achievement}
                      onChange={(e) =>
                        onAchievementChange(exp.id, achIndex, e.target.value)
                      }
                      placeholder="Describe your achievement..."
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

const EducationForm = ({ education, onChange, onAdd, onRemove }) => (
  <Card className="dark:bg-gray-800 dark:border-gray-700">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <GraduationCap className="w-5 h-5" />
          Education
        </CardTitle>
        <Button onClick={onAdd} className="flex items-center gap-1">
          <Plus className="w-4 h-4" />
          Add Education
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
                Education {index + 1}
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
                <Label className="dark:text-gray-300">Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => onChange(index, 'degree', e.target.value)}
                  placeholder="Bachelor of Science"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Institution</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) =>
                    onChange(index, 'institution', e.target.value)
                  }
                  placeholder="University Name"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Period</Label>
                <Input
                  value={edu.period}
                  onChange={(e) => onChange(index, 'period', e.target.value)}
                  placeholder="2013 – 2017"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">
                  GPA (if applicable)
                </Label>
                <Input
                  value={edu.gpa}
                  onChange={(e) => onChange(index, 'gpa', e.target.value)}
                  placeholder="3.9/4.0"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="dark:text-gray-300">Honors/Awards</Label>
                <Input
                  value={edu.honors}
                  onChange={(e) => onChange(index, 'honors', e.target.value)}
                  placeholder="Summa Cum Laude"
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

const ProjectsForm = ({
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
          Projects
        </CardTitle>
        <Button onClick={onAdd} className="flex items-center gap-1">
          <Plus className="w-4 h-4" />
          Add Project
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
                Project {index + 1}
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
              <Label className="dark:text-gray-300">Project Name</Label>
              <Input
                value={project.name}
                onChange={(e) => onChange(index, 'name', e.target.value)}
                placeholder="Project Name"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="dark:text-gray-300">Description</Label>
              <Textarea
                value={project.description}
                onChange={(e) => onChange(index, 'description', e.target.value)}
                placeholder="Brief description of the project"
                rows={2}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Live Demo Link</Label>
                <Input
                  value={project.link}
                  onChange={(e) => onChange(index, 'link', e.target.value)}
                  placeholder="https://example.com"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">GitHub Link</Label>
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
                <Label className="dark:text-gray-300">Technologies Used</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddTechnology(project.id)}
                  className="flex items-center gap-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                >
                  <Plus className="w-4 h-4" />
                  Add Technology
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
                      placeholder="Technology"
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

const CertificationsForm = ({ certifications, onChange, onAdd, onRemove }) => (
  <Card className="dark:bg-gray-800 dark:border-gray-700">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <Award className="w-5 h-5" />
          Certifications
        </CardTitle>
        <Button onClick={onAdd} className="flex items-center gap-1">
          <Plus className="w-4 h-4" />
          Add Certification
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
                Certification {index + 1}
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
                <Label className="dark:text-gray-300">Certification Name</Label>
                <Input
                  value={cert.name}
                  onChange={(e) => onChange(index, 'name', e.target.value)}
                  placeholder="AWS Certified Solutions Architect"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">
                  Issuing Organization
                </Label>
                <Input
                  value={cert.issuer}
                  onChange={(e) => onChange(index, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Date Obtained</Label>
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

const LanguagesForm = ({ languages, onChange, onAdd, onRemove }) => (
  <Card className="dark:bg-gray-800 dark:border-gray-700">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <Languages className="w-5 h-5" />
          Languages
        </CardTitle>
        <Button onClick={onAdd} className="flex items-center gap-1">
          <Plus className="w-4 h-4" />
          Add Language
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
                Language {index + 1}
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
                <Label className="dark:text-gray-300">Language</Label>
                <Input
                  value={lang.name}
                  onChange={(e) => onChange(index, 'name', e.target.value)}
                  placeholder="English"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Proficiency Level</Label>
                <Select
                  value={lang.level}
                  onValueChange={(value) => onChange(index, 'level', value)}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Native">Native</SelectItem>
                    <SelectItem value="Fluent">Fluent</SelectItem>
                    <SelectItem value="Conversational">
                      Conversational
                    </SelectItem>
                    <SelectItem value="Basic">Basic</SelectItem>
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

const CVBuilder = () => {
  const [step, setStep] = useState(1);
  const componentRef = useRef();

  // Pisahkan state menjadi state kecil
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
  });

  const [summary, setSummary] = useState('');

  const [skills, setSkills] = useState({
    technical: [],
    soft: [],
  });

  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [languages, setLanguages] = useState([]);

  // Handler untuk personal info
  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
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
          const newAchievements = [...exp.achievements];
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
          return { ...exp, achievements: [...exp.achievements, ''] };
        }
        return exp;
      });
    });
  };

  const removeAchievement = (expId, achIndex) => {
    setExperience((prev) => {
      return prev.map((exp) => {
        if (exp.id === expId) {
          const newAchievements = exp.achievements.filter(
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

  // Fungsi untuk print PDF
  const printPDF = () => {
    const printContent = componentRef.current.cloneNode(true);
    const downloadButton = printContent.querySelector('.download-button');
    if (downloadButton) downloadButton.remove();
    const contactLinks = printContent.querySelector('.contact-links');
    if (contactLinks) contactLinks.remove();
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframe.contentDocument.body.innerHTML = `
      <style>
        @page {
          size: A4;
          margin: 1.5cm;
        }
        
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10pt;
          line-height: 1.4;
          color: #000;
          margin: 0;
          padding: 0;
        }
        
        .cv-container {
          max-width: none;
          width: 100%;
          background: white;
          box-shadow: none;
          border-radius: 0;
          padding: 0;
        }
        
        .header {
          border-bottom: 1pt solid #000;
          padding-bottom: 8pt;
          margin-bottom: 12pt;
        }
        
        .name {
          font-size: 24pt;
          font-weight: bold;
          margin-bottom: 4pt;
          line-height: 1.2;
        }
        
        .title {
          font-size: 14pt;
          font-weight: 600;
          margin-bottom: 8pt;
          color: #333;
        }
        
        .contact-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8pt;
          margin-top: 8pt;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 4pt;
          font-size: 10pt;
        }
        
        .summary {
          font-size: 10pt;
          line-height: 1.3;
          margin-bottom: 12pt;
          padding: 6pt;
          background: #f9f9f9;
          border-left: 2pt solid #333;
        }
        
        .section {
          margin-bottom: 12pt;
          page-break-inside: avoid;
        }
        
        .section-title {
          font-size: 13pt;
          font-weight: bold;
          margin-bottom: 8pt;
          padding-bottom: 2pt;
          border-bottom: 1pt solid #000;
        }
        
        .skills-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12pt;
        }
        
        .skills-group {
          margin-bottom: 6pt;
        }
        
        .skills-title {
          font-size: 11pt;
          font-weight: 600;
          margin-bottom: 6pt;
        }
        
        .skill-tag {
          display: inline-block;
          background: #f5f5f5;
          color: #000;
          padding: 2pt 6pt;
          border-radius: 2pt;
          font-size: 9pt;
          margin-right: 4pt;
          margin-bottom: 4pt;
          border: 1pt solid #ddd;
        }
        
        .experience-item {
          margin-bottom: 10pt;
        }
        
        .experience-title {
          font-size: 12pt;
          font-weight: bold;
          margin-bottom: 1pt;
        }
        
        .experience-company {
          font-size: 11pt;
          font-weight: 600;
          margin-bottom: 1pt;
        }
        
        .experience-location {
          font-size: 10pt;
          margin-bottom: 4pt;
        }
        
        .experience-period {
          font-size: 10pt;
          margin-bottom: 4pt;
          font-weight: 500;
        }
        
        .experience-achievements {
          list-style: none;
          padding-left: 0;
          margin: 0;
        }
        
        .experience-achievements li {
          font-size: 10pt;
          margin-bottom: 3pt;
          position: relative;
          padding-left: 10pt;
        }
        
        .experience-achievements li:before {
          content: "•";
          position: absolute;
          left: 0;
        }
        
        .education-item {
          margin-bottom: 8pt;
        }
        
        .education-title {
          font-size: 12pt;
          font-weight: bold;
          margin-bottom: 1pt;
        }
        
        .education-institution {
          font-size: 11pt;
          font-weight: 600;
          margin-bottom: 1pt;
        }
        
        .education-period {
          font-size: 10pt;
          margin-bottom: 3pt;
          font-weight: 500;
        }
        
        .education-details {
          font-size: 10pt;
        }
        
        .projects-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10pt;
        }
        
        .project-item {
          margin-bottom: 8pt;
          padding-bottom: 6pt;
          border-bottom: 1pt solid #eee;
        }
        
        .project-title {
          font-size: 11pt;
          font-weight: bold;
          margin-bottom: 2pt;
        }
        
        .project-description {
          font-size: 10pt;
          margin-bottom: 3pt;
        }
        
        .project-links {
          display: flex;
          gap: 8pt;
          margin-bottom: 3pt;
          font-size: 9pt;
        }
        
        .project-link {
          color: #0066cc;
          text-decoration: none;
        }
        
        .project-technologies {
          display: flex;
          flex-wrap: wrap;
          gap: 4pt;
        }
        
        .tech-tag {
          display: inline-block;
          background: #f5f5f5;
          color: #000;
          padding: 2pt 4pt;
          border-radius: 2pt;
          font-size: 9pt;
          border: 1pt solid #ddd;
        }
        
        .certifications-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8pt;
        }
        
        .certification-item {
          padding-bottom: 6pt;
          border-bottom: 1pt solid #eee;
        }
        
        .certification-title {
          font-size: 11pt;
          font-weight: bold;
          margin-bottom: 1pt;
        }
        
        .certification-issuer {
          font-size: 10pt;
          margin-bottom: 2pt;
        }
        
        .certification-date {
          font-size: 9pt;
          font-weight: 500;
        }
        
        .languages-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8pt;
        }
        
        .language-item {
          font-size: 10pt;
        }
        
        .language-name {
          font-weight: 600;
        }
        
        .footer {
          text-align: center;
          font-size: 9pt;
          color: #666;
          margin-top: 16pt;
          padding-top: 8pt;
          border-top: 1pt solid #eee;
        }
        
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          
          .cv-container {
            box-shadow: none;
            border-radius: 0;
          }
          
          .download-button, .contact-links, .back-button, .form-container {
            display: none !important;
          }
        }
      </style>
      
      <div class="cv-container">
        <div class="header">
          <div class="name">${personalInfo.name || 'Your Name'}</div>
          <div class="title">${personalInfo.title || 'Your Title'}</div>
          <div class="contact-info">
            <div class="contact-item">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>${personalInfo.email || 'your.email@example.com'}</span>
            </div>
            <div class="contact-item">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>${personalInfo.phone || '+1 (555) 123-4567'}</span>
            </div>
            <div class="contact-item">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>${personalInfo.location || 'Your Location'}</span>
            </div>
            <div class="contact-item">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>${personalInfo.portfolio || 'yourportfolio.com'}</span>
            </div>
          </div>
        </div>
        
        ${
          summary
            ? `
        <div class="summary">
          ${summary}
        </div>
        `
            : ''
        }
        
        ${
          skills.technical.length > 0 || skills.soft.length > 0
            ? `
        <div class="section">
          <div class="section-title">Skills</div>
          <div class="skills-container">
            ${
              skills.technical.length > 0
                ? `
            <div class="skills-group">
              <div class="skills-title">Technical Skills</div>
              ${skills.technical
                .map((skill) => `<span class="skill-tag">${skill}</span>`)
                .join('')}
            </div>
            `
                : ''
            }
            
            ${
              skills.soft.length > 0
                ? `
            <div class="skills-group">
              <div class="skills-title">Soft Skills</div>
              ${skills.soft
                .map((skill) => `<span class="skill-tag">${skill}</span>`)
                .join('')}
            </div>
            `
                : ''
            }
          </div>
        </div>
        `
            : ''
        }
        
        ${
          experience.length > 0
            ? `
        <div class="section">
          <div class="section-title">Work Experience</div>
          ${experience
            .map(
              (exp) => `
            ${
              exp.name && exp.position
                ? `
            <div class="experience-item">
              <div class="experience-title">${exp.position}</div>
              <div class="experience-company">${exp.name}</div>
              <div class="experience-location">${exp.location || ''}</div>
              <div class="experience-period">${exp.period || ''}</div>
              ${
                exp.achievements && exp.achievements.length > 0
                  ? `
              <ul class="experience-achievements">
                ${exp.achievements
                  .map((achievement) =>
                    achievement ? `<li>${achievement}</li>` : ''
                  )
                  .join('')}
              </ul>
              `
                  : ''
              }
            </div>
            `
                : ''
            }
          `
            )
            .join('')}
        </div>
        `
            : ''
        }
        
        ${
          education.length > 0
            ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${education
            .map(
              (edu) => `
            ${
              edu.degree && edu.institution
                ? `
            <div class="education-item">
              <div class="education-title">${edu.degree}</div>
              <div class="education-institution">${edu.institution}</div>
              <div class="education-period">${edu.period || ''}</div>
              ${
                edu.gpa || edu.honors
                  ? `
              <div class="education-details">
                ${edu.gpa ? `<span>GPA: ${edu.gpa}</span>` : ''}
                ${
                  edu.honors
                    ? `<span style="margin-left: 6pt; font-weight: 600;">${edu.honors}</span>`
                    : ''
                }
              </div>
              `
                  : ''
              }
            </div>
            `
                : ''
            }
          `
            )
            .join('')}
        </div>
        `
            : ''
        }
        
        ${
          projects.length > 0 || certifications.length > 0
            ? `
        <div class="section">
          <div class="section-title">Projects & Certifications</div>
          <div class="projects-container">
            ${projects
              .map(
                (project) => `
              ${
                project.name && project.description
                  ? `
              <div class="project-item">
                <div class="project-title">${project.name}</div>
                <div class="project-description">${project.description}</div>
                ${
                  project.link || project.github
                    ? `
                <div class="project-links">
                  ${
                    project.link
                      ? `<a href="${project.link}" class="project-link">Demo</a>`
                      : ''
                  }
                  ${
                    project.github
                      ? `<a href="${project.github}" class="project-link">GitHub</a>`
                      : ''
                  }
                </div>
                `
                    : ''
                }
                ${
                  project.technologies && project.technologies.length > 0
                    ? `
                <div class="project-technologies">
                  ${project.technologies
                    .slice(0, 3)
                    .map((tech) => `<span class="tech-tag">${tech}</span>`)
                    .join('')}
                  ${
                    project.technologies.length > 3
                      ? `<span class="tech-tag">+${
                          project.technologies.length - 3
                        } more</span>`
                      : ''
                  }
                </div>
                `
                    : ''
                }
              </div>
              `
                  : ''
              }
            `
              )
              .join('')}
            
            ${certifications
              .map(
                (cert) => `
              ${
                cert.name && cert.issuer
                  ? `
              <div class="certification-item">
                <div class="certification-title">${cert.name}</div>
                <div class="certification-issuer">${cert.issuer}</div>
                <div class="certification-date">${cert.date || ''}</div>
              </div>
              `
                  : ''
              }
            `
              )
              .join('')}
          </div>
        </div>
        `
            : ''
        }
        
        ${
          languages.length > 0
            ? `
        <div class="section">
          <div class="section-title">Languages</div>
          <div class="languages-grid">
            ${languages
              .map(
                (lang) => `
              ${
                lang.name
                  ? `
              <div class="language-item">
                <span class="language-name">${lang.name}</span>
                <span style="margin-left: 4pt;">- ${lang.level || ''}</span>
              </div>
              `
                  : ''
              }
            `
              )
              .join('')}
          </div>
        </div>
        `
            : ''
        }
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} ${
      personalInfo.name || 'Your Name'
    }</p>
        </div>
      </div>
    `;
    iframe.contentWindow.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };

  const downloadPDF = () => {
    printPDF();
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
                Skip to Preview
              </Button>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => goToStep(step - 1)}
                  disabled={step === 1}
                  className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={() => goToStep(step + 1)}
                  className="dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="text-center space-y-6 dark:text-white">
            <h2 className="text-2xl font-bold">Preview Your CV</h2>
            <p className="text-muted-foreground dark:text-gray-400">
              Review your CV and download it when you&apos;re satisfied.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => goToStep(1)}
                className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              >
                Edit Information
              </Button>
              <Button onClick={downloadPDF} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold">Professional CV Generator</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create your professional CV in minutes
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
                    ? 'Enter Information'
                    : 'Preview & Download'}
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
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold dark:text-white">
                  {personalInfo.name || 'Your Name'}
                </h1>
                <p className="text-xl md:text-2xl font-semibold mt-2 text-gray-600 dark:text-gray-400">
                  {personalInfo.title || 'Your Title'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {personalInfo.email || 'your.email@example.com'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {personalInfo.phone || '+1 (555) 123-4567'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {personalInfo.location || 'Your Location'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {personalInfo.portfolio || 'yourportfolio.com'}
                    </span>
                  </div>
                </div>
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
                    Skills
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {skills.technical.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2 dark:text-gray-300">
                          Technical Skills
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
                          Soft Skills
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
                    Work Experience
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
                    Education
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
                              {edu.gpa && <span>GPA: {edu.gpa}</span>}
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
              {/* Projects & Certifications */}
              {(projects.length > 0 || certifications.length > 0) && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 dark:text-white">
                    <FolderOpen className="w-6 h-6" />
                    Projects & Certifications
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
                                      +{project.technologies.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              )}
                          </div>
                        )
                    )}
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
                    Languages
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
                © {new Date().getFullYear()} {personalInfo.name || 'Your Name'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVBuilder;
