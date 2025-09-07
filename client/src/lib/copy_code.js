// /// Cv Code

// 'use client';
// import { useState, useRef } from 'react';
// import {
//   Download,
//   Mail,
//   Phone,
//   MapPin,
//   Globe,
//   Code,
//   Briefcase,
//   GraduationCap,
//   FolderOpen,
//   Award,
// } from 'lucide-react';

// const ProfessionalCV = () => {
//   const componentRef = useRef();

//   // Data CV yang lebih ringkas
//   const [cvData, setCvData] = useState({
//     personal: {
//       name: 'John Doe',
//       title: 'Senior Full Stack Web3 Developer',
//       email: 'john.doe@email.com',
//       phone: '+62 812-3456-7890',
//       location: 'Jakarta, Indonesia',
//       linkedin: 'linkedin.com/in/johndoe',
//       github: 'github.com/johndoe',
//       portfolio: 'johndoe.dev',
//     },
//     summary:
//       'Senior full-stack developer with 8+ years of experience building scalable web applications and Web3 solutions. Expert in React, Node.js, and cloud architecture with proven track record of leading projects from concept to deployment.',
//     skills: {
//       technical: [
//         'JavaScript',
//         'TypeScript',
//         'React',
//         'Next.js',
//         'Node.js',
//         'Python',
//         'Solidity',
//         'AWS',
//         'Docker',
//         'Kubernetes',
//         'MongoDB',
//         'PostgreSQL',
//         'GraphQL',
//         'Web3.js',
//         'Ethers.js',
//         'IPFS',
//         'Smart Contracts',
//       ],
//       soft: [
//         'Team Leadership',
//         'Problem Solving',
//         'Agile/Scrum',
//         'Project Management',
//         'Technical Communication',
//         'Cross-functional Collaboration',
//       ],
//     },
//     experience: [
//       {
//         id: 1,
//         company: 'TechCorp Solutions',
//         position: 'Senior Software Engineer',
//         period: '2020 – Present',
//         location: 'Jakarta, Indonesia',
//         achievements: [
//           'Led microservices architecture for 2M+ users, reducing response time by 45%',
//           'Implemented CI/CD pipeline reducing deployment time by 70%',
//           'Mentored 8 junior developers, improving team productivity by 40%',
//           'Reduced infrastructure costs by 35% through cloud optimization',
//         ],
//       },
//       {
//         id: 2,
//         company: 'StartupXYZ',
//         position: 'Full Stack Developer',
//         period: '2017 – 2020',
//         location: 'Jakarta, Indonesia',
//         achievements: [
//           'Built SaaS platform from ground up, acquiring 50K+ paying customers',
//           'Optimized database queries, improving application performance by 60%',
//           'Reduced server costs by 40% through cloud migration',
//           'Implemented real-time features using WebSockets, increasing engagement by 30%',
//         ],
//       },
//     ],
//     education: [
//       {
//         id: 1,
//         institution: 'University of Indonesia',
//         degree: 'Bachelor of Computer Science',
//         period: '2013 – 2017',
//         gpa: '3.9/4.0',
//         honors: 'Summa Cum Laude',
//       },
//     ],
//     projects: [
//       {
//         id: 1,
//         name: 'DeFi Staking Platform',
//         description: 'Decentralized finance platform with staking features',
//         technologies: ['React', 'Solidity', 'Node.js', 'IPFS', 'Web3.js'],
//         link: 'https://defi-example.com',
//         github: 'https://github.com/johndoe/defi-platform',
//       },
//       {
//         id: 2,
//         name: 'NFT Marketplace',
//         description: 'Scalable NFT marketplace with minting and bidding',
//         technologies: [
//           'Next.js',
//           'IPFS',
//           'Solidity',
//           'Ethers.js',
//           'PostgreSQL',
//         ],
//         link: 'https://nft-example.com',
//         github: 'https://github.com/johndoe/nft-marketplace',
//       },
//     ],
//     certifications: [
//       {
//         id: 1,
//         name: 'AWS Certified Solutions Architect',
//         issuer: 'Amazon Web Services',
//         date: '2022',
//       },
//       {
//         id: 2,
//         name: 'Google Cloud Professional Developer',
//         issuer: 'Google Cloud',
//         date: '2021',
//       },
//     ],
//     languages: [
//       { name: 'English', level: 'Fluent' },
//       { name: 'Indonesian', level: 'Native' },
//     ],
//   });

//   // Fungsi untuk print PDF
//   const printPDF = () => {
//     // Clone elemen untuk print
//     const printContent = componentRef.current.cloneNode(true);

//     // Hapus elemen yang tidak perlu untuk print
//     const downloadButton = printContent.querySelector('.download-button');
//     if (downloadButton) downloadButton.remove();

//     const contactLinks = printContent.querySelector('.contact-links');
//     if (contactLinks) contactLinks.remove();

//     // Buat iframe sementara
//     const iframe = document.createElement('iframe');
//     iframe.style.display = 'none';
//     document.body.appendChild(iframe);

//     // Isi iframe dengan konten yang akan di-print
//     iframe.contentDocument.body.innerHTML = `
//       <style>
//         @page {
//           size: A4;
//           margin: 1.5cm;
//         }

//         body {
//           font-family: 'Helvetica Neue', Arial, sans-serif;
//           font-size: 10pt;
//           line-height: 1.4;
//           color: #000;
//           margin: 0;
//           padding: 0;
//         }

//         .cv-container {
//           max-width: none;
//           width: 100%;
//           background: white;
//           box-shadow: none;
//           border-radius: 0;
//           padding: 0;
//         }

//         .header {
//           border-bottom: 1pt solid #000;
//           padding-bottom: 8pt;
//           margin-bottom: 12pt;
//         }

//         .name {
//           font-size: 24pt;
//           font-weight: bold;
//           margin-bottom: 4pt;
//           line-height: 1.2;
//         }

//         .title {
//           font-size: 14pt;
//           font-weight: 600;
//           margin-bottom: 8pt;
//           color: #333;
//         }

//         .contact-info {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 8pt;
//           margin-top: 8pt;
//         }

//         .contact-item {
//           display: flex;
//           align-items: center;
//           gap: 4pt;
//           font-size: 10pt;
//         }

//         .summary {
//           font-size: 10pt;
//           line-height: 1.3;
//           margin-bottom: 12pt;
//           padding: 6pt;
//           background: #f9f9f9;
//           border-left: 2pt solid #333;
//         }

//         .section {
//           margin-bottom: 12pt;
//           page-break-inside: avoid;
//         }

//         .section-title {
//           font-size: 13pt;
//           font-weight: bold;
//           margin-bottom: 8pt;
//           padding-bottom: 2pt;
//           border-bottom: 1pt solid #000;
//         }

//         .skills-container {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12pt;
//         }

//         .skills-group {
//           margin-bottom: 6pt;
//         }

//         .skills-title {
//           font-size: 11pt;
//           font-weight: 600;
//           margin-bottom: 6pt;
//         }

//         .skill-tag {
//           display: inline-block;
//           background: #f5f5f5;
//           color: #000;
//           padding: 2pt 6pt;
//           border-radius: 2pt;
//           font-size: 9pt;
//           margin-right: 4pt;
//           margin-bottom: 4pt;
//           border: 1pt solid #ddd;
//         }

//         .experience-item {
//           margin-bottom: 10pt;
//         }

//         .experience-title {
//           font-size: 12pt;
//           font-weight: bold;
//           margin-bottom: 1pt;
//         }

//         .experience-company {
//           font-size: 11pt;
//           font-weight: 600;
//           margin-bottom: 1pt;
//         }

//         .experience-location {
//           font-size: 10pt;
//           margin-bottom: 4pt;
//         }

//         .experience-period {
//           font-size: 10pt;
//           margin-bottom: 4pt;
//           font-weight: 500;
//         }

//         .experience-achievements {
//           list-style: none;
//           padding-left: 0;
//           margin: 0;
//         }

//         .experience-achievements li {
//           font-size: 10pt;
//           margin-bottom: 3pt;
//           position: relative;
//           padding-left: 10pt;
//         }

//         .experience-achievements li:before {
//           content: "•";
//           position: absolute;
//           left: 0;
//         }

//         .education-item {
//           margin-bottom: 8pt;
//         }

//         .education-title {
//           font-size: 12pt;
//           font-weight: bold;
//           margin-bottom: 1pt;
//         }

//         .education-institution {
//           font-size: 11pt;
//           font-weight: 600;
//           margin-bottom: 1pt;
//         }

//         .education-period {
//           font-size: 10pt;
//           margin-bottom: 3pt;
//           font-weight: 500;
//         }

//         .education-details {
//           font-size: 10pt;
//         }

//         .projects-container {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 10pt;
//         }

//         .project-item {
//           margin-bottom: 8pt;
//           padding-bottom: 6pt;
//           border-bottom: 1pt solid #eee;
//         }

//         .project-title {
//           font-size: 11pt;
//           font-weight: bold;
//           margin-bottom: 2pt;
//         }

//         .project-description {
//           font-size: 10pt;
//           margin-bottom: 3pt;
//         }

//         .project-links {
//           display: flex;
//           gap: 8pt;
//           margin-bottom: 3pt;
//           font-size: 9pt;
//         }

//         .project-link {
//           color: #0066cc;
//           text-decoration: none;
//         }

//         .project-technologies {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 4pt;
//         }

//         .tech-tag {
//           display: inline-block;
//           background: #f5f5f5;
//           color: #000;
//           padding: 2pt 4pt;
//           border-radius: 2pt;
//           font-size: 9pt;
//           border: 1pt solid #ddd;
//         }

//         .certifications-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 8pt;
//         }

//         .certification-item {
//           padding-bottom: 6pt;
//           border-bottom: 1pt solid #eee;
//         }

//         .certification-title {
//           font-size: 11pt;
//           font-weight: bold;
//           margin-bottom: 1pt;
//         }

//         .certification-issuer {
//           font-size: 10pt;
//           margin-bottom: 2pt;
//         }

//         .certification-date {
//           font-size: 9pt;
//           font-weight: 500;
//         }

//         .languages-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 8pt;
//         }

//         .language-item {
//           font-size: 10pt;
//         }

//         .language-name {
//           font-weight: 600;
//         }

//         .footer {
//           text-align: center;
//           font-size: 9pt;
//           color: #666;
//           margin-top: 16pt;
//           padding-top: 8pt;
//           border-top: 1pt solid #eee;
//         }

//         @media print {
//           body {
//             margin: 0;
//             padding: 0;
//           }

//           .cv-container {
//             box-shadow: none;
//             border-radius: 0;
//           }

//           .download-button, .contact-links {
//             display: none !important;
//           }
//         }
//       </style>

//       <div class="cv-container">
//         <div class="header">
//           <div class="name">${cvData.personal.name}</div>
//           <div class="title">${cvData.personal.title}</div>
//           <div class="contact-info">
//             <div class="contact-item">
//               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                 <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
//                 <polyline points="22,6 12,13 2,6"></polyline>
//               </svg>
//               <span>${cvData.personal.email}</span>
//             </div>
//             <div class="contact-item">
//               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                 <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
//               </svg>
//               <span>${cvData.personal.phone}</span>
//             </div>
//             <div class="contact-item">
//               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                 <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
//                 <circle cx="12" cy="10" r="3"></circle>
//               </svg>
//               <span>${cvData.personal.location}</span>
//             </div>
//             <div class="contact-item">
//               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                 <circle cx="12" cy="12" r="10"></circle>
//                 <line x1="2" y1="12" x2="22" y2="12"></line>
//                 <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
//               </svg>
//               <span>${cvData.personal.portfolio}</span>
//             </div>
//           </div>
//         </div>

//         <div class="summary">
//           ${cvData.summary}
//         </div>

//         <div class="section">
//           <div class="section-title">Skills</div>
//           <div class="skills-container">
//             <div class="skills-group">
//               <div class="skills-title">Technical Skills</div>
//               ${cvData.skills.technical
//                 .map((skill) => `<span class="skill-tag">${skill}</span>`)
//                 .join('')}
//             </div>
//             <div class="skills-group">
//               <div class="skills-title">Soft Skills</div>
//               ${cvData.skills.soft
//                 .map((skill) => `<span class="skill-tag">${skill}</span>`)
//                 .join('')}
//             </div>
//           </div>
//         </div>

//         <div class="section">
//           <div class="section-title">Work Experience</div>
//           ${cvData.experience
//             .map(
//               (exp) => `
//             <div class="experience-item">
//               <div class="experience-title">${exp.position}</div>
//               <div class="experience-company">${exp.company}</div>
//               <div class="experience-location">${exp.location}</div>
//               <div class="experience-period">${exp.period}</div>
//               <ul class="experience-achievements">
//                 ${exp.achievements
//                   .map((achievement) => `<li>${achievement}</li>`)
//                   .join('')}
//               </ul>
//             </div>
//           `
//             )
//             .join('')}
//         </div>

//         <div class="section">
//           <div class="section-title">Education</div>
//           ${cvData.education
//             .map(
//               (edu) => `
//             <div class="education-item">
//               <div class="education-title">${edu.degree}</div>
//               <div class="education-institution">${edu.institution}</div>
//               <div class="education-period">${edu.period}</div>
//               <div class="education-details">
//                 <span>GPA: ${edu.gpa}</span>
//                 ${
//                   edu.honors
//                     ? `<span style="margin-left: 6pt; font-weight: 600;">${edu.honors}</span>`
//                     : ''
//                 }
//               </div>
//             </div>
//           `
//             )
//             .join('')}
//         </div>

//         <div class="section">
//           <div class="section-title">Projects & Certifications</div>
//           <div class="projects-container">
//             ${cvData.projects
//               .map(
//                 (project) => `
//               <div class="project-item">
//                 <div class="project-title">${project.name}</div>
//                 <div class="project-description">${project.description}</div>
//                 <div class="project-links">
//                   <a href="${project.link}" class="project-link">Demo</a>
//                   <a href="${project.github}" class="project-link">GitHub</a>
//                 </div>
//                 <div class="project-technologies">
//                   ${project.technologies
//                     .slice(0, 3)
//                     .map((tech) => `<span class="tech-tag">${tech}</span>`)
//                     .join('')}
//                   ${
//                     project.technologies.length > 3
//                       ? `<span class="tech-tag">+${
//                           project.technologies.length - 3
//                         } more</span>`
//                       : ''
//                   }
//                 </div>
//               </div>
//             `
//               )
//               .join('')}

//             ${cvData.certifications
//               .map(
//                 (cert) => `
//               <div class="certification-item">
//                 <div class="certification-title">${cert.name}</div>
//                 <div class="certification-issuer">${cert.issuer}</div>
//                 <div class="certification-date">${cert.date}</div>
//               </div>
//             `
//               )
//               .join('')}
//           </div>
//         </div>

//         <div class="section">
//           <div class="section-title">Languages</div>
//           <div class="languages-grid">
//             ${cvData.languages
//               .map(
//                 (lang) => `
//               <div class="language-item">
//                 <span class="language-name">${lang.name}</span>
//                 <span style="margin-left: 4pt;">- ${lang.level}</span>
//               </div>
//             `
//               )
//               .join('')}
//           </div>
//         </div>

//         <div class="footer">
//           <p>© ${new Date().getFullYear()} ${cvData.personal.name}</p>
//         </div>
//       </div>
//     `;

//     // Print iframe
//     iframe.contentWindow.print();

//     // Hapus iframe setelah print
//     setTimeout(() => {
//       document.body.removeChild(iframe);
//     }, 1000);
//   };

//   const downloadPDF = () => {
//     printPDF();
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-4xl mx-auto">
//         {/* CV Content */}
//         <div
//           ref={componentRef}
//           className="bg-white rounded-lg shadow-lg overflow-hidden"
//           style={{
//             fontFamily: "'Helvetica Neue', Arial, sans-serif",
//             lineHeight: 1.5,
//             color: '#333',
//           }}
//         >
//           {/* Header */}
//           <div className="header p-6 md:p-8">
//             <div className="text-center md:text-left">
//               <h1 className="text-3xl md:text-4xl font-bold">
//                 {cvData.personal.name}
//               </h1>
//               <p className="text-xl md:text-2xl font-semibold mt-2 text-gray-700">
//                 {cvData.personal.title}
//               </p>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
//                 <div className="flex items-center gap-2">
//                   <Mail className="w-5 h-5 text-gray-600" />
//                   <span className="text-gray-700">{cvData.personal.email}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Phone className="w-5 h-5 text-gray-600" />
//                   <span className="text-gray-700">{cvData.personal.phone}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <MapPin className="w-5 h-5 text-gray-600" />
//                   <span className="text-gray-700">
//                     {cvData.personal.location}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Globe className="w-5 h-5 text-gray-600" />
//                   <span className="text-gray-700">
//                     {cvData.personal.portfolio}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Contact Links */}
//           <div className="contact-links flex justify-center gap-6 py-4 bg-gray-50 border-t">
//             <a
//               href={cvData.personal.linkedin}
//               className="text-blue-600 hover:text-blue-800"
//             >
//               LinkedIn
//             </a>
//             <a
//               href={cvData.personal.github}
//               className="text-gray-700 hover:text-gray-900"
//             >
//               GitHub
//             </a>
//           </div>

//           <div className="p-6 md:p-8 space-y-6">
//             {/* Professional Summary */}
//             <div className="summary p-4 bg-gray-50 border-l-4 border-gray-800">
//               <p className="text-gray-700">{cvData.summary}</p>
//             </div>

//             {/* Skills */}
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//                 <Code className="w-6 h-6 text-gray-700" />
//                 Skills
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                     Technical Skills
//                   </h3>
//                   <div className="flex flex-wrap gap-2">
//                     {cvData.skills.technical.map((skill, index) => (
//                       <span
//                         key={index}
//                         className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                     Soft Skills
//                   </h3>
//                   <div className="flex flex-wrap gap-2">
//                     {cvData.skills.soft.map((skill, index) => (
//                       <span
//                         key={index}
//                         className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Work Experience */}
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//                 <Briefcase className="w-6 h-6 text-gray-700" />
//                 Work Experience
//               </h2>
//               {cvData.experience.map((exp) => (
//                 <div key={exp.id} className="mb-6 last:mb-0">
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-900">
//                         {exp.position}
//                       </h3>
//                       <p className="text-lg font-semibold text-gray-700">
//                         {exp.company}
//                       </p>
//                       <p className="text-gray-600">{exp.location}</p>
//                     </div>
//                     <div className="text-gray-600 font-medium">
//                       {exp.period}
//                     </div>
//                   </div>
//                   <ul className="space-y-2">
//                     {exp.achievements.map((achievement, index) => (
//                       <li key={index} className="flex items-start gap-2">
//                         <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
//                         <span className="text-gray-700">{achievement}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>

//             {/* Education */}
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//                 <GraduationCap className="w-6 h-6 text-gray-700" />
//                 Education
//               </h2>
//               {cvData.education.map((edu) => (
//                 <div key={edu.id} className="mb-4 last:mb-0">
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-900">
//                         {edu.degree}
//                       </h3>
//                       <p className="text-lg font-semibold text-gray-700">
//                         {edu.institution}
//                       </p>
//                     </div>
//                     <div className="text-gray-600 font-medium">
//                       {edu.period}
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4 text-gray-600">
//                     <span>GPA: {edu.gpa}</span>
//                     {edu.honors && (
//                       <span className="font-semibold">{edu.honors}</span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Projects & Certifications */}
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//                 <FolderOpen className="w-6 h-6 text-gray-700" />
//                 Projects & Certifications
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {cvData.projects.map((project) => (
//                   <div key={project.id} className="p-4 bg-gray-50 rounded-lg">
//                     <div className="flex justify-between items-start mb-2">
//                       <div>
//                         <h3 className="text-lg font-bold text-gray-900">
//                           {project.name}
//                         </h3>
//                         <p className="text-gray-700 text-sm">
//                           {project.description}
//                         </p>
//                       </div>
//                       <div className="flex gap-2">
//                         <a
//                           href={project.link}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 hover:text-blue-800 text-xs"
//                         >
//                           Demo
//                         </a>
//                         <a
//                           href={project.github}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 hover:text-blue-800 text-xs"
//                         >
//                           GitHub
//                         </a>
//                       </div>
//                     </div>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {project.technologies.slice(0, 3).map((tech, index) => (
//                         <span
//                           key={index}
//                           className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs"
//                         >
//                           {tech}
//                         </span>
//                       ))}
//                       {project.technologies.length > 3 && (
//                         <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
//                           +{project.technologies.length - 3} more
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 ))}

//                 {cvData.certifications.map((cert) => (
//                   <div key={cert.id} className="p-4 bg-gray-50 rounded-lg">
//                     <h3 className="text-lg font-bold text-gray-900">
//                       {cert.name}
//                     </h3>
//                     <p className="text-gray-600 text-sm">{cert.issuer}</p>
//                     <div className="text-gray-500 mt-1 text-xs font-medium">
//                       {cert.date}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Languages */}
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">
//                 Languages
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {cvData.languages.map((lang, index) => (
//                   <div key={index} className="p-3 bg-gray-50 rounded-lg">
//                     <span className="font-medium text-gray-900">
//                       {lang.name}
//                     </span>
//                     <span className="text-gray-600 ml-2 text-sm">
//                       - {lang.level}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="bg-gray-50 p-4 text-center text-gray-500 text-sm border-t">
//             <p>
//               © {new Date().getFullYear()} {cvData.personal.name}
//             </p>
//           </div>
//         </div>

//         {/* Download Button */}
//         <div className="text-center mt-6">
//           <button
//             onClick={downloadPDF}
//             className="download-button flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-700 transition-colors"
//           >
//             <Download className="w-5 h-5" />
//             <span className="font-semibold">Download PDF</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfessionalCV;

// // pages/cv-builder.js
// 'use client';

// import { useState, useRef } from 'react';
// import {
//   Download,
//   Mail,
//   Phone,
//   MapPin,
//   Globe,
//   Code,
//   Briefcase,
//   GraduationCap,
//   FolderOpen,
//   Award,
//   Linkedin,
//   Github,
//   ChevronLeft,
//   ChevronRight,
//   Plus,
//   Trash2,
//   User,
//   FileText,
//   Languages,
// } from 'lucide-react';
// import { v4 as uuidv4 } from 'uuid';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';
// import { Badge } from '@/components/ui/badge';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

// const CVBuilder = () => {
//   const [step, setStep] = useState(1);
//   const componentRef = useRef();

//   // State manual untuk form data
//   const [formData, setFormData] = useState({
//     personal: {
//       name: '',
//       title: '',
//       email: '',
//       phone: '',
//       location: '',
//       linkedin: '',
//       github: '',
//       portfolio: '',
//     },
//     summary: '',
//     skills: {
//       technical: [],
//       soft: [],
//     },
//     experience: [],
//     education: [],
//     projects: [],
//     certifications: [],
//     languages: [],
//   });

//   // Handler untuk perubahan personal info
//   const handlePersonalChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       personal: {
//         ...prev.personal,
//         [field]: value,
//       },
//     }));
//   };

//   // Handler untuk perubahan summary
//   const handleSummaryChange = (value) => {
//     setFormData((prev) => ({
//       ...prev,
//       summary: value,
//     }));
//   };

//   // Handler untuk skills
//   const handleSkillChange = (type, index, value) => {
//     setFormData((prev) => {
//       const newSkills = [...prev.skills[type]];
//       newSkills[index] = value;
//       return {
//         ...prev,
//         skills: {
//           ...prev.skills,
//           [type]: newSkills,
//         },
//       };
//     });
//   };

//   const addSkill = (type) => {
//     setFormData((prev) => ({
//       ...prev,
//       skills: {
//         ...prev.skills,
//         [type]: [...prev.skills[type], ''],
//       },
//     }));
//   };

//   const removeSkill = (type, index) => {
//     setFormData((prev) => {
//       const newSkills = [...prev.skills[type]];
//       newSkills.splice(index, 1);
//       return {
//         ...prev,
//         skills: {
//           ...prev.skills,
//           [type]: newSkills,
//         },
//       };
//     });
//   };

//   // Handler untuk experience
//   const handleExperienceChange = (index, field, value) => {
//     setFormData((prev) => {
//       const newExperience = [...prev.experience];
//       newExperience[index] = {
//         ...newExperience[index],
//         [field]: value,
//       };
//       return {
//         ...prev,
//         experience: newExperience,
//       };
//     });
//   };

//   const addExperience = () => {
//     setFormData((prev) => ({
//       ...prev,
//       experience: [
//         ...prev.experience,
//         {
//           id: uuidv4(),
//           name: '',
//           position: '',
//           period: '',
//           location: '',
//           achievements: [''],
//         },
//       ],
//     }));
//   };

//   const removeExperience = (id) => {
//     setFormData((prev) => ({
//       ...prev,
//       experience: prev.experience.filter((exp) => exp.id !== id),
//     }));
//   };

//   const handleAchievementChange = (expId, achIndex, value) => {
//     setFormData((prev) => {
//       const newExperience = prev.experience.map((exp) => {
//         if (exp.id === expId) {
//           const newAchievements = [...exp.achievements];
//           newAchievements[achIndex] = value;
//           return {
//             ...exp,
//             achievements: newAchievements,
//           };
//         }
//         return exp;
//       });
//       return {
//         ...prev,
//         experience: newExperience,
//       };
//     });
//   };

//   const addAchievement = (expId) => {
//     setFormData((prev) => {
//       const newExperience = prev.experience.map((exp) => {
//         if (exp.id === expId) {
//           return {
//             ...exp,
//             achievements: [...exp.achievements, ''],
//           };
//         }
//         return exp;
//       });
//       return {
//         ...prev,
//         experience: newExperience,
//       };
//     });
//   };

//   const removeAchievement = (expId, achIndex) => {
//     setFormData((prev) => {
//       const newExperience = prev.experience.map((exp) => {
//         if (exp.id === expId) {
//           const newAchievements = exp.achievements.filter(
//             (_, i) => i !== achIndex
//           );
//           return {
//             ...exp,
//             achievements: newAchievements,
//           };
//         }
//         return exp;
//       });
//       return {
//         ...prev,
//         experience: newExperience,
//       };
//     });
//   };

//   // Handler untuk education
//   const handleEducationChange = (index, field, value) => {
//     setFormData((prev) => {
//       const newEducation = [...prev.education];
//       newEducation[index] = {
//         ...newEducation[index],
//         [field]: value,
//       };
//       return {
//         ...prev,
//         education: newEducation,
//       };
//     });
//   };

//   const addEducation = () => {
//     setFormData((prev) => ({
//       ...prev,
//       education: [
//         ...prev.education,
//         {
//           id: uuidv4(),
//           degree: '',
//           institution: '',
//           period: '',
//           gpa: '',
//           honors: '',
//         },
//       ],
//     }));
//   };

//   const removeEducation = (id) => {
//     setFormData((prev) => ({
//       ...prev,
//       education: prev.education.filter((edu) => edu.id !== id),
//     }));
//   };

//   // Handler untuk projects
//   const handleProjectChange = (index, field, value) => {
//     setFormData((prev) => {
//       const newProjects = [...prev.projects];
//       newProjects[index] = {
//         ...newProjects[index],
//         [field]: value,
//       };
//       return {
//         ...prev,
//         projects: newProjects,
//       };
//     });
//   };

//   const addProject = () => {
//     setFormData((prev) => ({
//       ...prev,
//       projects: [
//         ...prev.projects,
//         {
//           id: uuidv4(),
//           name: '',
//           description: '',
//           technologies: [''],
//           link: '',
//           github: '',
//         },
//       ],
//     }));
//   };

//   const removeProject = (id) => {
//     setFormData((prev) => ({
//       ...prev,
//       projects: prev.projects.filter((proj) => proj.id !== id),
//     }));
//   };

//   const handleTechnologyChange = (projId, techIndex, value) => {
//     setFormData((prev) => {
//       const newProjects = prev.projects.map((proj) => {
//         if (proj.id === projId) {
//           const newTechnologies = [...proj.technologies];
//           newTechnologies[techIndex] = value;
//           return {
//             ...proj,
//             technologies: newTechnologies,
//           };
//         }
//         return proj;
//       });
//       return {
//         ...prev,
//         projects: newProjects,
//       };
//     });
//   };

//   const addTechnology = (projId) => {
//     setFormData((prev) => {
//       const newProjects = prev.projects.map((proj) => {
//         if (proj.id === projId) {
//           return {
//             ...proj,
//             technologies: [...proj.technologies, ''],
//           };
//         }
//         return proj;
//       });
//       return {
//         ...prev,
//         projects: newProjects,
//       };
//     });
//   };

//   const removeTechnology = (projId, techIndex) => {
//     setFormData((prev) => {
//       const newProjects = prev.projects.map((proj) => {
//         if (proj.id === projId) {
//           const newTechnologies = proj.technologies.filter(
//             (_, i) => i !== techIndex
//           );
//           return {
//             ...proj,
//             technologies: newTechnologies,
//           };
//         }
//         return proj;
//       });
//       return {
//         ...prev,
//         projects: newProjects,
//       };
//     });
//   };

//   // Handler untuk certifications
//   const handleCertificationChange = (index, field, value) => {
//     setFormData((prev) => {
//       const newCertifications = [...prev.certifications];
//       newCertifications[index] = {
//         ...newCertifications[index],
//         [field]: value,
//       };
//       return {
//         ...prev,
//         certifications: newCertifications,
//       };
//     });
//   };

//   const addCertification = () => {
//     setFormData((prev) => ({
//       ...prev,
//       certifications: [
//         ...prev.certifications,
//         {
//           id: uuidv4(),
//           name: '',
//           issuer: '',
//           date: '',
//         },
//       ],
//     }));
//   };

//   const removeCertification = (id) => {
//     setFormData((prev) => ({
//       ...prev,
//       certifications: prev.certifications.filter((cert) => cert.id !== id),
//     }));
//   };

//   // Handler untuk languages
//   const handleLanguageChange = (index, field, value) => {
//     setFormData((prev) => {
//       const newLanguages = [...prev.languages];
//       newLanguages[index] = {
//         ...newLanguages[index],
//         [field]: value,
//       };
//       return {
//         ...prev,
//         languages: newLanguages,
//       };
//     });
//   };

//   const addLanguage = () => {
//     setFormData((prev) => ({
//       ...prev,
//       languages: [
//         ...prev.languages,
//         {
//           id: uuidv4(),
//           name: '',
//           level: '',
//         },
//       ],
//     }));
//   };

//   const removeLanguage = (id) => {
//     setFormData((prev) => ({
//       ...prev,
//       languages: prev.languages.filter((lang) => lang.id !== id),
//     }));
//   };

//   // Fungsi untuk print PDF
//   const printPDF = () => {
//     const printContent = componentRef.current.cloneNode(true);
//     const downloadButton = printContent.querySelector('.download-button');
//     if (downloadButton) downloadButton.remove();
//     const contactLinks = printContent.querySelector('.contact-links');
//     if (contactLinks) contactLinks.remove();

//     const iframe = document.createElement('iframe');
//     iframe.style.display = 'none';
//     document.body.appendChild(iframe);

//     iframe.contentDocument.body.innerHTML = `
//       <style>
//         @page {
//           size: A4;
//           margin: 1.5cm;
//         }

//         body {
//           font-family: 'Helvetica Neue', Arial, sans-serif;
//           font-size: 10pt;
//           line-height: 1.4;
//           color: #000;
//           margin: 0;
//           padding: 0;
//         }

//         .cv-container {
//           max-width: none;
//           width: 100%;
//           background: white;
//           box-shadow: none;
//           border-radius: 0;
//           padding: 0;
//         }

//         .header {
//           border-bottom: 1pt solid #000;
//           padding-bottom: 8pt;
//           margin-bottom: 12pt;
//         }

//         .name {
//           font-size: 24pt;
//           font-weight: bold;
//           margin-bottom: 4pt;
//           line-height: 1.2;
//         }

//         .title {
//           font-size: 14pt;
//           font-weight: 600;
//           margin-bottom: 8pt;
//           color: #333;
//         }

//         .contact-info {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 8pt;
//           margin-top: 8pt;
//         }

//         .contact-item {
//           display: flex;
//           align-items: center;
//           gap: 4pt;
//           font-size: 10pt;
//         }

//         .summary {
//           font-size: 10pt;
//           line-height: 1.3;
//           margin-bottom: 12pt;
//           padding: 6pt;
//           background: #f9f9f9;
//           border-left: 2pt solid #333;
//         }

//         .section {
//           margin-bottom: 12pt;
//           page-break-inside: avoid;
//         }

//         .section-title {
//           font-size: 13pt;
//           font-weight: bold;
//           margin-bottom: 8pt;
//           padding-bottom: 2pt;
//           border-bottom: 1pt solid #000;
//         }

//         .skills-container {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12pt;
//         }

//         .skills-group {
//           margin-bottom: 6pt;
//         }

//         .skills-title {
//           font-size: 11pt;
//           font-weight: 600;
//           margin-bottom: 6pt;
//         }

//         .skill-tag {
//           display: inline-block;
//           background: #f5f5f5;
//           color: #000;
//           padding: 2pt 6pt;
//           border-radius: 2pt;
//           font-size: 9pt;
//           margin-right: 4pt;
//           margin-bottom: 4pt;
//           border: 1pt solid #ddd;
//         }

//         .experience-item {
//           margin-bottom: 10pt;
//         }

//         .experience-title {
//           font-size: 12pt;
//           font-weight: bold;
//           margin-bottom: 1pt;
//         }

//         .experience-company {
//           font-size: 11pt;
//           font-weight: 600;
//           margin-bottom: 1pt;
//         }

//         .experience-location {
//           font-size: 10pt;
//           margin-bottom: 4pt;
//         }

//         .experience-period {
//           font-size: 10pt;
//           margin-bottom: 4pt;
//           font-weight: 500;
//         }

//         .experience-achievements {
//           list-style: none;
//           padding-left: 0;
//           margin: 0;
//         }

//         .experience-achievements li {
//           font-size: 10pt;
//           margin-bottom: 3pt;
//           position: relative;
//           padding-left: 10pt;
//         }

//         .experience-achievements li:before {
//           content: "•";
//           position: absolute;
//           left: 0;
//         }

//         .education-item {
//           margin-bottom: 8pt;
//         }

//         .education-title {
//           font-size: 12pt;
//           font-weight: bold;
//           margin-bottom: 1pt;
//         }

//         .education-institution {
//           font-size: 11pt;
//           font-weight: 600;
//           margin-bottom: 1pt;
//         }

//         .education-period {
//           font-size: 10pt;
//           margin-bottom: 3pt;
//           font-weight: 500;
//         }

//         .education-details {
//           font-size: 10pt;
//         }

//         .projects-container {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 10pt;
//         }

//         .project-item {
//           margin-bottom: 8pt;
//           padding-bottom: 6pt;
//           border-bottom: 1pt solid #eee;
//         }

//         .project-title {
//           font-size: 11pt;
//           font-weight: bold;
//           margin-bottom: 2pt;
//         }

//         .project-description {
//           font-size: 10pt;
//           margin-bottom: 3pt;
//         }

//         .project-links {
//           display: flex;
//           gap: 8pt;
//           margin-bottom: 3pt;
//           font-size: 9pt;
//         }

//         .project-link {
//           color: #0066cc;
//           text-decoration: none;
//         }

//         .project-technologies {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 4pt;
//         }

//         .tech-tag {
//           display: inline-block;
//           background: #f5f5f5;
//           color: #000;
//           padding: 2pt 4pt;
//           border-radius: 2pt;
//           font-size: 9pt;
//           border: 1pt solid #ddd;
//         }

//         .certifications-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 8pt;
//         }

//         .certification-item {
//           padding-bottom: 6pt;
//           border-bottom: 1pt solid #eee;
//         }

//         .certification-title {
//           font-size: 11pt;
//           font-weight: bold;
//           margin-bottom: 1pt;
//         }

//         .certification-issuer {
//           font-size: 10pt;
//           margin-bottom: 2pt;
//         }

//         .certification-date {
//           font-size: 9pt;
//           font-weight: 500;
//         }

//         .languages-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 8pt;
//         }

//         .language-item {
//           font-size: 10pt;
//         }

//         .language-name {
//           font-weight: 600;
//         }

//         .footer {
//           text-align: center;
//           font-size: 9pt;
//           color: #666;
//           margin-top: 16pt;
//           padding-top: 8pt;
//           border-top: 1pt solid #eee;
//         }

//         @media print {
//           body {
//             margin: 0;
//             padding: 0;
//           }

//           .cv-container {
//             box-shadow: none;
//             border-radius: 0;
//           }

//           .download-button, .contact-links, .back-button, .form-container {
//             display: none !important;
//           }
//         }
//       </style>

//       <div class="cv-container">
//         <div class="header">
//           <div class="name">${formData.personal.name || 'Your Name'}</div>
//           <div class="title">${formData.personal.title || 'Your Title'}</div>
//           <div class="contact-info">
//             <div class="contact-item">
//               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                 <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
//                 <polyline points="22,6 12,13 2,6"></polyline>
//               </svg>
//               <span>${
//                 formData.personal.email || 'your.email@example.com'
//               }</span>
//             </div>
//             <div class="contact-item">
//               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                 <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
//               </svg>
//               <span>${formData.personal.phone || '+1 (555) 123-4567'}</span>
//             </div>
//             <div class="contact-item">
//               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                 <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
//                 <circle cx="12" cy="10" r="3"></circle>
//               </svg>
//               <span>${formData.personal.location || 'Your Location'}</span>
//             </div>
//             <div class="contact-item">
//               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                 <circle cx="12" cy="12" r="10"></circle>
//                 <line x1="2" y1="12" x2="22" y2="12"></line>
//                 <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
//               </svg>
//               <span>${formData.personal.portfolio || 'yourportfolio.com'}</span>
//             </div>
//           </div>
//         </div>

//         ${
//           formData.summary
//             ? `
//         <div class="summary">
//           ${formData.summary}
//         </div>
//         `
//             : ''
//         }

//         ${
//           formData.skills.technical.length > 0 ||
//           formData.skills.soft.length > 0
//             ? `
//         <div class="section">
//           <div class="section-title">Skills</div>
//           <div class="skills-container">
//             ${
//               formData.skills.technical.length > 0
//                 ? `
//             <div class="skills-group">
//               <div class="skills-title">Technical Skills</div>
//               ${formData.skills.technical
//                 .map((skill) => `<span class="skill-tag">${skill}</span>`)
//                 .join('')}
//             </div>
//             `
//                 : ''
//             }

//             ${
//               formData.skills.soft.length > 0
//                 ? `
//             <div class="skills-group">
//               <div class="skills-title">Soft Skills</div>
//               ${formData.skills.soft
//                 .map((skill) => `<span class="skill-tag">${skill}</span>`)
//                 .join('')}
//             </div>
//             `
//                 : ''
//             }
//           </div>
//         </div>
//         `
//             : ''
//         }

//         ${
//           formData.experience.length > 0
//             ? `
//         <div class="section">
//           <div class="section-title">Work Experience</div>
//           ${formData.experience
//             .map(
//               (exp) => `
//             ${
//               exp.name && exp.position
//                 ? `
//             <div class="experience-item">
//               <div class="experience-title">${exp.position}</div>
//               <div class="experience-company">${exp.name}</div>
//               <div class="experience-location">${exp.location || ''}</div>
//               <div class="experience-period">${exp.period || ''}</div>
//               ${
//                 exp.achievements && exp.achievements.length > 0
//                   ? `
//               <ul class="experience-achievements">
//                 ${exp.achievements
//                   .map((achievement) =>
//                     achievement ? `<li>${achievement}</li>` : ''
//                   )
//                   .join('')}
//               </ul>
//               `
//                   : ''
//               }
//             </div>
//             `
//                 : ''
//             }
//           `
//             )
//             .join('')}
//         </div>
//         `
//             : ''
//         }

//         ${
//           formData.education.length > 0
//             ? `
//         <div class="section">
//           <div class="section-title">Education</div>
//           ${formData.education
//             .map(
//               (edu) => `
//             ${
//               edu.degree && edu.institution
//                 ? `
//             <div class="education-item">
//               <div class="education-title">${edu.degree}</div>
//               <div class="education-institution">${edu.institution}</div>
//               <div class="education-period">${edu.period || ''}</div>
//               ${
//                 edu.gpa || edu.honors
//                   ? `
//               <div class="education-details">
//                 ${edu.gpa ? `<span>GPA: ${edu.gpa}</span>` : ''}
//                 ${
//                   edu.honors
//                     ? `<span style="margin-left: 6pt; font-weight: 600;">${edu.honors}</span>`
//                     : ''
//                 }
//               </div>
//               `
//                   : ''
//               }
//             </div>
//             `
//                 : ''
//             }
//           `
//             )
//             .join('')}
//         </div>
//         `
//             : ''
//         }

//         ${
//           formData.projects.length > 0 || formData.certifications.length > 0
//             ? `
//         <div class="section">
//           <div class="section-title">Projects & Certifications</div>
//           <div class="projects-container">
//             ${formData.projects
//               .map(
//                 (project) => `
//               ${
//                 project.name && project.description
//                   ? `
//               <div class="project-item">
//                 <div class="project-title">${project.name}</div>
//                 <div class="project-description">${project.description}</div>
//                 ${
//                   project.link || project.github
//                     ? `
//                 <div class="project-links">
//                   ${
//                     project.link
//                       ? `<a href="${project.link}" class="project-link">Demo</a>`
//                       : ''
//                   }
//                   ${
//                     project.github
//                       ? `<a href="${project.github}" class="project-link">GitHub</a>`
//                       : ''
//                   }
//                 </div>
//                 `
//                     : ''
//                 }
//                 ${
//                   project.technologies && project.technologies.length > 0
//                     ? `
//                 <div class="project-technologies">
//                   ${project.technologies
//                     .slice(0, 3)
//                     .map((tech) => `<span class="tech-tag">${tech}</span>`)
//                     .join('')}
//                   ${
//                     project.technologies.length > 3
//                       ? `<span class="tech-tag">+${
//                           project.technologies.length - 3
//                         } more</span>`
//                       : ''
//                   }
//                 </div>
//                 `
//                     : ''
//                 }
//               </div>
//               `
//                   : ''
//               }
//             `
//               )
//               .join('')}

//             ${formData.certifications
//               .map(
//                 (cert) => `
//               ${
//                 cert.name && cert.issuer
//                   ? `
//               <div class="certification-item">
//                 <div class="certification-title">${cert.name}</div>
//                 <div class="certification-issuer">${cert.issuer}</div>
//                 <div class="certification-date">${cert.date || ''}</div>
//               </div>
//               `
//                   : ''
//               }
//             `
//               )
//               .join('')}
//           </div>
//         </div>
//         `
//             : ''
//         }

//         ${
//           formData.languages.length > 0
//             ? `
//         <div class="section">
//           <div class="section-title">Languages</div>
//           <div class="languages-grid">
//             ${formData.languages
//               .map(
//                 (lang) => `
//               ${
//                 lang.name
//                   ? `
//               <div class="language-item">
//                 <span class="language-name">${lang.name}</span>
//                 <span style="margin-left: 4pt;">- ${lang.level || ''}</span>
//               </div>
//               `
//                   : ''
//               }
//             `
//               )
//               .join('')}
//           </div>
//         </div>
//         `
//             : ''
//         }

//         <div class="footer">
//           <p>© ${new Date().getFullYear()} ${
//       formData.personal.name || 'Your Name'
//     }</p>
//         </div>
//       </div>
//     `;

//     iframe.contentWindow.print();
//     setTimeout(() => {
//       document.body.removeChild(iframe);
//     }, 1000);
//   };

//   const downloadPDF = () => {
//     printPDF();
//   };

//   const goToStep = (stepNumber) => {
//     setStep(stepNumber);
//   };

//   // Komponen form dengan state manual
//   const PersonalInfoForm = () => (
//     <Card className="dark:bg-gray-800 dark:border-gray-700">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2 dark:text-white">
//           <User className="w-5 h-5" />
//           Personal Information
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4 dark:bg-gray-800 dark:text-gray-100">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="name" className="dark:text-gray-300">
//               Full Name *
//             </Label>
//             <Input
//               id="name"
//               value={formData.personal.name}
//               onChange={(e) => handlePersonalChange('name', e.target.value)}
//               placeholder="John Doe"
//               className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="title" className="dark:text-gray-300">
//               Professional Title *
//             </Label>
//             <Input
//               id="title"
//               value={formData.personal.title}
//               onChange={(e) => handlePersonalChange('title', e.target.value)}
//               placeholder="Senior Full Stack Developer"
//               className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="email" className="dark:text-gray-300">
//               Email *
//             </Label>
//             <Input
//               id="email"
//               value={formData.personal.email}
//               onChange={(e) => handlePersonalChange('email', e.target.value)}
//               type="email"
//               placeholder="john.doe@example.com"
//               className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="phone" className="dark:text-gray-300">
//               Phone
//             </Label>
//             <Input
//               id="phone"
//               value={formData.personal.phone}
//               onChange={(e) => handlePersonalChange('phone', e.target.value)}
//               placeholder="+1 (555) 123-4567"
//               className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="location" className="dark:text-gray-300">
//               Location
//             </Label>
//             <Input
//               id="location"
//               value={formData.personal.location}
//               onChange={(e) => handlePersonalChange('location', e.target.value)}
//               placeholder="Jakarta, Indonesia"
//               className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="portfolio" className="dark:text-gray-300">
//               Portfolio Website
//             </Label>
//             <Input
//               id="portfolio"
//               value={formData.personal.portfolio}
//               onChange={(e) =>
//                 handlePersonalChange('portfolio', e.target.value)
//               }
//               placeholder="johndoe.dev"
//               className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="linkedin" className="dark:text-gray-300">
//               LinkedIn Profile
//             </Label>
//             <Input
//               id="linkedin"
//               value={formData.personal.linkedin}
//               onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
//               placeholder="linkedin.com/in/johndoe"
//               className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="github" className="dark:text-gray-300">
//               GitHub Profile
//             </Label>
//             <Input
//               id="github"
//               value={formData.personal.github}
//               onChange={(e) => handlePersonalChange('github', e.target.value)}
//               placeholder="github.com/johndoe"
//               className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );

//   const SummaryForm = () => (
//     <Card className="dark:bg-gray-800 dark:border-gray-700">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2 dark:text-white">
//           <FileText className="w-5 h-5" />
//           Professional Summary
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-2 dark:bg-gray-800 dark:text-gray-100">
//         <Label htmlFor="summary" className="dark:text-gray-300">
//           Summary
//         </Label>
//         <Textarea
//           id="summary"
//           value={formData.summary}
//           onChange={(e) => handleSummaryChange(e.target.value)}
//           placeholder="Brief description of your professional experience and skills..."
//           rows={4}
//           className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//         />
//       </CardContent>
//     </Card>
//   );

//   const SkillsForm = () => (
//     <Card className="dark:bg-gray-800 dark:border-gray-700">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2 dark:text-white">
//           <Code className="w-5 h-5" />
//           Skills
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6 dark:bg-gray-800 dark:text-gray-100">
//         <div className="space-y-4">
//           <div className="flex justify-between items-center">
//             <Label className="dark:text-gray-300">Technical Skills</Label>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => addSkill('technical')}
//               className="flex items-center gap-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//             >
//               <Plus className="w-4 h-4" />
//               Add Skill
//             </Button>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {formData.skills.technical.map((skill, index) => (
//               <div
//                 key={index}
//                 className="flex items-center bg-secondary dark:bg-gray-700 rounded-md px-3 py-1"
//               >
//                 <Input
//                   value={skill}
//                   onChange={(e) =>
//                     handleSkillChange('technical', index, e.target.value)
//                   }
//                   className="bg-transparent border-none focus:outline-none w-full dark:text-white"
//                   placeholder="Enter skill"
//                 />
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => removeSkill('technical', index)}
//                   className="h-auto p-1 ml-1"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="space-y-4">
//           <div className="flex justify-between items-center">
//             <Label className="dark:text-gray-300">Soft Skills</Label>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => addSkill('soft')}
//               className="flex items-center gap-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//             >
//               <Plus className="w-4 h-4" />
//               Add Skill
//             </Button>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {formData.skills.soft.map((skill, index) => (
//               <div
//                 key={index}
//                 className="flex items-center bg-secondary dark:bg-gray-700 rounded-md px-3 py-1"
//               >
//                 <Input
//                   value={skill}
//                   onChange={(e) =>
//                     handleSkillChange('soft', index, e.target.value)
//                   }
//                   className="bg-transparent border-none focus:outline-none w-full dark:text-white"
//                   placeholder="Enter skill"
//                 />
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => removeSkill('soft', index)}
//                   className="h-auto p-1 ml-1"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );

//   const ExperienceForm = () => {
//     return (
//       <Card className="dark:bg-gray-800 dark:border-gray-700">
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle className="flex items-center gap-2 dark:text-white">
//               <Briefcase className="w-5 h-5" />
//               Work Experience
//             </CardTitle>
//             <Button onClick={addExperience} className="flex items-center gap-1">
//               <Plus className="w-4 h-4" />
//               Add Experience
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-6 dark:bg-gray-800 dark:text-gray-100">
//           {formData.experience.map((exp, index) => (
//             <Card
//               key={exp.id}
//               className="border-dashed dark:border-gray-700 dark:bg-gray-800"
//             >
//               <CardHeader className="pb-3">
//                 <div className="flex justify-between items-center">
//                   <CardTitle className="text-lg dark:text-white">
//                     Experience {index + 1}
//                   </CardTitle>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => removeExperience(exp.id)}
//                     className="h-auto p-1"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-4 dark:bg-gray-800 dark:text-gray-100">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label className="dark:text-gray-300">Company Name</Label>
//                     <Input
//                       value={exp.name}
//                       onChange={(e) =>
//                         handleExperienceChange(index, 'name', e.target.value)
//                       }
//                       placeholder="Company Name"
//                       className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="dark:text-gray-300">Position</Label>
//                     <Input
//                       value={exp.position}
//                       onChange={(e) =>
//                         handleExperienceChange(
//                           index,
//                           'position',
//                           e.target.value
//                         )
//                       }
//                       placeholder="Position Title"
//                       className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="dark:text-gray-300">Location</Label>
//                     <Input
//                       value={exp.location}
//                       onChange={(e) =>
//                         handleExperienceChange(
//                           index,
//                           'location',
//                           e.target.value
//                         )
//                       }
//                       placeholder="City, Country"
//                       className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="dark:text-gray-300">Period</Label>
//                     <Input
//                       value={exp.period}
//                       onChange={(e) =>
//                         handleExperienceChange(index, 'period', e.target.value)
//                       }
//                       placeholder="Jan 2020 – Present"
//                       className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <Label className="dark:text-gray-300">Achievements</Label>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => addAchievement(exp.id)}
//                       className="flex items-center gap-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Add Achievement
//                     </Button>
//                   </div>
//                   <div className="space-y-2">
//                     {exp.achievements.map((achievement, achIndex) => (
//                       <div key={achIndex} className="flex items-center gap-2">
//                         <Input
//                           value={achievement}
//                           onChange={(e) =>
//                             handleAchievementChange(
//                               exp.id,
//                               achIndex,
//                               e.target.value
//                             )
//                           }
//                           placeholder="Describe your achievement..."
//                           className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                         />
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => removeAchievement(exp.id, achIndex)}
//                           className="h-auto p-1"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </CardContent>
//       </Card>
//     );
//   };

//   const EducationForm = () => {
//     return (
//       <Card className="dark:bg-gray-800 dark:border-gray-700">
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle className="flex items-center gap-2 dark:text-white">
//               <GraduationCap className="w-5 h-5" />
//               Education
//             </CardTitle>
//             <Button onClick={addEducation} className="flex items-center gap-1">
//               <Plus className="w-4 h-4" />
//               Add Education
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-6 dark:bg-gray-800 dark:text-gray-100">
//           {formData.education.map((edu, index) => (
//             <Card
//               key={edu.id}
//               className="border-dashed dark:border-gray-700 dark:bg-gray-800"
//             >
//               <CardHeader className="pb-3">
//                 <div className="flex justify-between items-center">
//                   <CardTitle className="text-lg dark:text-white">
//                     Education {index + 1}
//                   </CardTitle>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => removeEducation(edu.id)}
//                     className="h-auto p-1"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-4 dark:bg-gray-800 dark:text-gray-100">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label className="dark:text-gray-300">Degree</Label>
//                     <Input
//                       value={edu.degree}
//                       onChange={(e) =>
//                         handleEducationChange(index, 'degree', e.target.value)
//                       }
//                       placeholder="Bachelor of Science"
//                       className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="dark:text-gray-300">Institution</Label>
//                     <Input
//                       value={edu.institution}
//                       onChange={(e) =>
//                         handleEducationChange(
//                           index,
//                           'institution',
//                           e.target.value
//                         )
//                       }
//                       placeholder="University Name"
//                       className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="dark:text-gray-300">Period</Label>
//                     <Input
//                       value={edu.period}
//                       onChange={(e) =>
//                         handleEducationChange(index, 'period', e.target.value)
//                       }
//                       placeholder="2013 – 2017"
//                       className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="dark:text-gray-300">
//                       GPA (if applicable)
//                     </Label>
//                     <Input
//                       value={edu.gpa}
//                       onChange={(e) =>
//                         handleEducationChange(index, 'gpa', e.target.value)
//                       }
//                       placeholder="3.9/4.0"
//                       className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                     />
//                   </div>
//                   <div className="md:col-span-2 space-y-2">
//                     <Label className="dark:text-gray-300">Honors/Awards</Label>
//                     <Input
//                       value={edu.honors}
//                       onChange={(e) =>
//                         handleEducationChange(index, 'honors', e.target.value)
//                       }
//                       placeholder="Summa Cum Laude"
//                       className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </CardContent>
//       </Card>
//     );
//   };

//   const ProjectsForm = () => {
//     return (
//       <Card className="dark:bg-gray-800 dark:border-gray-700">
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle className="flex items-center gap-2 dark:text-white">
//               <FolderOpen className="w-5 h-5" />
//               Projects
//             </CardTitle>
//             <Button onClick={addProject} className="flex items-center gap-1">
//               <Plus className="w-4 h-4" />
//               Add Project
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-6 dark:bg-gray-800 dark:text-gray-100">
//           {formData.projects.map((project, index) => (
//             <Card
//               key={project.id}
//               className="border-dashed dark:border-gray-700 dark:bg-gray-800"
//             >
//               <CardHeader className="pb-3">
//                 <div className="flex justify-between items-center">
//                   <CardTitle className="text-lg dark:text-white">
//                     Project {index + 1}
//                   </CardTitle>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => removeProject(project.id)}
//                     className="h-auto p-1"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-4 dark:bg-gray-800 dark:text-gray-100">
//                 <div className="space-y-2">
//                   <Label className="dark:text-gray-300">Project Name</Label>
//                   <Input
//                     value={project.name}
//                     onChange={(e) =>
//                       handleProjectChange(index, 'name', e.target.value)
//                     }
//                     placeholder="Project Name"
//                     className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="dark:text-gray-300">Description</Label>
//                   <Textarea
//                     value={project.description}
//                     onChange={(e) =>
//                       handleProjectChange(index, 'description', e.target.value)
//                     }
//                     placeholder="Brief description of the project"
//                     rows={2}
//                     className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label className="dark:text-gray-300">Live Demo Link</Label>
//                     <Input
//                       value={project.link}
//                       onChange={(e) =>
//                         handleProjectChange(index, 'link', e.target.value)
//                       }
//                       placeholder="https://example.com"
//                       className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="dark:text-gray-300">GitHub Link</Label>
//                     <Input
//                       value={project.github}
//                       onChange={(e) =>
//                         handleProjectChange(index, 'github', e.target.value)
//                       }
//                       placeholder="https://github.com/username/repo"
//                       className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <Label className="dark:text-gray-300">
//                       Technologies Used
//                     </Label>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => addTechnology(project.id)}
//                       className="flex items-center gap-1 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Add Technology
//                     </Button>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {project.technologies.map((tech, techIndex) => (
//                       <div
//                         key={techIndex}
//                         className="flex items-center bg-secondary dark:bg-gray-700 rounded-md px-3 py-1"
//                       >
//                         <Input
//                           value={tech}
//                           onChange={(e) =>
//                             handleTechnologyChange(
//                               project.id,
//                               techIndex,
//                               e.target.value
//                             )
//                           }
//                           className="bg-transparent border-none focus:outline-none w-full dark:text-white"
//                           placeholder="Technology"
//                         />
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() =>
//                             removeTechnology(project.id, techIndex)
//                           }
//                           className="h-auto p-1 ml-1"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </CardContent>
//       </Card>
//     );
//   };

//   const CertificationsForm = () => {
//     return (
//       <Card className="dark:bg-gray-800 dark:border-gray-700">
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle className="flex items-center gap-2 dark:text-white">
//               <Award className="w-5 h-5" />
//               Certifications
//             </CardTitle>
//             <Button
//               onClick={addCertification}
//               className="flex items-center gap-1"
//             >
//               <Plus className="w-4 h-4" />
//               Add Certification
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-6 dark:bg-gray-800 dark:text-gray-100">
//           {formData.certifications.map((cert, index) => (
//             <Card
//               key={cert.id}
//               className="border-dashed dark:border-gray-700 dark:bg-gray-800"
//             >
//               <CardHeader className="pb-3">
//                 <div className="flex justify-between items-center">
//                   <CardTitle className="text-lg dark:text-white">
//                     Certification {index + 1}
//                   </CardTitle>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => removeCertification(cert.id)}
//                     className="h-auto p-1"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className="space-y-2">
//                     <Label className="dark:text-gray-300">
//                       Certification Name
//                     </Label>
//                     <Input
//                       value={cert.name}
//                       onChange={(e) =>
//                         handleCertificationChange(index, 'name', e.target.value)
//                       }
//                       placeholder="AWS Certified Solutions Architect"
//                       className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="dark:text-gray-300">
//                       Issuing Organization
//                     </Label>
//                     <Input
//                       value={cert.issuer}
//                       onChange={(e) =>
//                         handleCertificationChange(
//                           index,
//                           'issuer',
//                           e.target.value
//                         )
//                       }
//                       placeholder="Amazon Web Services"
//                       className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="dark:text-gray-300">Date Obtained</Label>
//                     <Input
//                       value={cert.date}
//                       onChange={(e) =>
//                         handleCertificationChange(index, 'date', e.target.value)
//                       }
//                       placeholder="2022"
//                       className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </CardContent>
//       </Card>
//     );
//   };

//   const LanguagesForm = () => {
//     return (
//       <Card className="dark:bg-gray-800 dark:border-gray-700">
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle className="flex items-center gap-2 dark:text-white">
//               <Languages className="w-5 h-5" />
//               Languages
//             </CardTitle>
//             <Button onClick={addLanguage} className="flex items-center gap-1">
//               <Plus className="w-4 h-4" />
//               Add Language
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-6 dark:bg-gray-800 dark:text-gray-100">
//           {formData.languages.map((lang, index) => (
//             <Card
//               key={lang.id}
//               className="border-dashed dark:border-gray-700 dark:bg-gray-800"
//             >
//               <CardHeader className="pb-3">
//                 <div className="flex justify-between items-center">
//                   <CardTitle className="text-lg dark:text-white">
//                     Language {index + 1}
//                   </CardTitle>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => removeLanguage(lang.id)}
//                     className="h-auto p-1"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label className="dark:text-gray-300">Language</Label>
//                     <Input
//                       value={lang.name}
//                       onChange={(e) =>
//                         handleLanguageChange(index, 'name', e.target.value)
//                       }
//                       placeholder="English"
//                       className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="dark:text-gray-300">
//                       Proficiency Level
//                     </Label>
//                     <Select
//                       value={lang.level}
//                       onValueChange={(value) =>
//                         handleLanguageChange(index, 'level', value)
//                       }
//                     >
//                       <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
//                         <SelectValue placeholder="Select level" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="Native">Native</SelectItem>
//                         <SelectItem value="Fluent">Fluent</SelectItem>
//                         <SelectItem value="Conversational">
//                           Conversational
//                         </SelectItem>
//                         <SelectItem value="Basic">Basic</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </CardContent>
//       </Card>
//     );
//   };

//   // Render form steps
//   const renderFormStep = () => {
//     switch (step) {
//       case 1:
//         return (
//           <div className="space-y-8">
//             <PersonalInfoForm />
//             <SummaryForm />
//             <SkillsForm />
//             <ExperienceForm />
//             <EducationForm />
//             <ProjectsForm />
//             <CertificationsForm />
//             <LanguagesForm />
//             <div className="flex justify-between">
//               <Button
//                 variant="outline"
//                 onClick={() => goToStep(2)}
//                 className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//               >
//                 Skip to Preview
//               </Button>
//               <div className="flex space-x-4">
//                 <Button
//                   variant="outline"
//                   onClick={() => goToStep(step - 1)}
//                   disabled={step === 1}
//                   className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//                 >
//                   <ChevronLeft className="w-4 h-4 mr-2" />
//                   Previous
//                 </Button>
//                 <Button
//                   onClick={() => goToStep(step + 1)}
//                   className="dark:bg-blue-600 dark:hover:bg-blue-700"
//                 >
//                   Next
//                   <ChevronRight className="w-4 h-4 ml-2" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         );
//       case 2:
//         return (
//           <div className="text-center space-y-6 dark:text-white">
//             <h2 className="text-2xl font-bold">Preview Your CV</h2>
//             <p className="text-muted-foreground dark:text-gray-400">
//               Review your CV and download it when you&apos;re satisfied.
//             </p>
//             <div className="flex justify-center space-x-4">
//               <Button
//                 variant="outline"
//                 onClick={() => goToStep(1)}
//                 className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
//               >
//                 Edit Information
//               </Button>
//               <Button onClick={downloadPDF} className="flex items-center gap-2">
//                 <Download className="w-4 h-4" />
//                 Download PDF
//               </Button>
//             </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 p-4 md:p-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="mb-8 space-y-2">
//           <h1 className="text-3xl font-bold">Professional CV Generator</h1>
//           <p className="text-gray-600 dark:text-gray-400">
//             Create your professional CV in minutes
//           </p>
//           {/* Progress Steps */}
//           <div className="flex items-center mt-6">
//             {[1, 2].map((stepNumber) => (
//               <div key={stepNumber} className="flex items-center">
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                     step === stepNumber
//                       ? 'bg-blue-500 text-white'
//                       : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
//                   }`}
//                 >
//                   {stepNumber}
//                 </div>
//                 <span
//                   className={`ml-2 ${
//                     step === stepNumber
//                       ? 'font-semibold'
//                       : 'text-gray-600 dark:text-gray-400'
//                   }`}
//                 >
//                   {stepNumber === 1
//                     ? 'Enter Information'
//                     : 'Preview & Download'}
//                 </span>
//                 {stepNumber < 2 && (
//                   <div
//                     className={`w-16 h-1 mx-4 ${
//                       step === stepNumber
//                         ? 'bg-blue-500'
//                         : 'bg-gray-200 dark:bg-gray-700'
//                     }`}
//                   ></div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//         {/* Form Container */}
//         <Card className="bg-white dark:bg-gray-800 shadow-lg">
//           <CardContent className="p-6 md:p-8">{renderFormStep()}</CardContent>
//         </Card>
//         {/* CV Preview (Hidden until step 2) */}
//         {step === 2 && (
//           <div
//             ref={componentRef}
//             className="bg-white dark:bg-gray-800 shadow-lg mt-8 transition-colors duration-300"
//             style={{
//               fontFamily: "'Helvetica Neue', Arial, sans-serif",
//               lineHeight: 1.5,
//             }}
//           >
//             {/* Header */}
//             <div className="border-b dark:border-gray-700 p-6 md:p-8">
//               <div className="text-center md:text-left">
//                 <h1 className="text-3xl md:text-4xl font-bold dark:text-white">
//                   {formData.personal.name || 'Your Name'}
//                 </h1>
//                 <p className="text-xl md:text-2xl font-semibold mt-2 text-gray-600 dark:text-gray-400">
//                   {formData.personal.title || 'Your Title'}
//                 </p>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
//                   <div className="flex items-center gap-2">
//                     <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
//                     <span className="text-gray-600 dark:text-gray-400">
//                       {formData.personal.email || 'your.email@example.com'}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
//                     <span className="text-gray-600 dark:text-gray-400">
//                       {formData.personal.phone || '+1 (555) 123-4567'}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
//                     <span className="text-gray-600 dark:text-gray-400">
//                       {formData.personal.location || 'Your Location'}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
//                     <span className="text-gray-600 dark:text-gray-400">
//                       {formData.personal.portfolio || 'yourportfolio.com'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* Contact Links */}
//             <div className="flex justify-center gap-6 py-4 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600">
//               {formData.personal.linkedin && (
//                 <a
//                   href={formData.personal.linkedin}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
//                 >
//                   <Linkedin className="w-5 h-5 mr-1" />
//                   LinkedIn
//                 </a>
//               )}
//               {formData.personal.github && (
//                 <a
//                   href={formData.personal.github}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 flex items-center"
//                 >
//                   <Github className="w-5 h-5 mr-1" />
//                   GitHub
//                 </a>
//               )}
//             </div>
//             <div className="p-6 md:p-8 space-y-6">
//               {/* Professional Summary */}
//               {formData.summary && (
//                 <div className="p-4 bg-gray-50 dark:bg-gray-700 border-l-4 border-blue-500 dark:border-blue-400">
//                   <p className="text-gray-700 dark:text-gray-300">
//                     {formData.summary}
//                   </p>
//                 </div>
//               )}
//               {/* Skills */}
//               {(formData.skills.technical.length > 0 ||
//                 formData.skills.soft.length > 0) && (
//                 <div>
//                   <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 dark:text-white">
//                     <Code className="w-6 h-6" />
//                     Skills
//                   </h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {formData.skills.technical.length > 0 && (
//                       <div>
//                         <h3 className="text-lg font-semibold mb-2 dark:text-gray-300">
//                           Technical Skills
//                         </h3>
//                         <div className="flex flex-wrap gap-2">
//                           {formData.skills.technical.map((skill, index) => (
//                             <Badge
//                               key={index}
//                               variant="secondary"
//                               className="dark:bg-gray-700 dark:text-gray-300"
//                             >
//                               {skill}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                     {formData.skills.soft.length > 0 && (
//                       <div>
//                         <h3 className="text-lg font-semibold mb-2 dark:text-gray-300">
//                           Soft Skills
//                         </h3>
//                         <div className="flex flex-wrap gap-2">
//                           {formData.skills.soft.map((skill, index) => (
//                             <Badge
//                               key={index}
//                               variant="secondary"
//                               className="dark:bg-gray-700 dark:text-gray-300"
//                             >
//                               {skill}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//               {/* Work Experience */}
//               {formData.experience.length > 0 && (
//                 <div>
//                   <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 dark:text-white">
//                     <Briefcase className="w-6 h-6" />
//                     Work Experience
//                   </h2>
//                   {formData.experience.map(
//                     (exp, index) =>
//                       exp.name &&
//                       exp.position && (
//                         <div key={index} className="mb-6 last:mb-0">
//                           <div className="flex justify-between items-start mb-2">
//                             <div>
//                               <h3 className="text-xl font-bold dark:text-white">
//                                 {exp.position}
//                               </h3>
//                               <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
//                                 {exp.name}
//                               </p>
//                               <p className="text-gray-600 dark:text-gray-400">
//                                 {exp.location || ''}
//                               </p>
//                             </div>
//                             <div className="text-gray-600 dark:text-gray-400 font-medium">
//                               {exp.period || ''}
//                             </div>
//                           </div>
//                           {exp.achievements && exp.achievements.length > 0 && (
//                             <ul className="space-y-2">
//                               {exp.achievements.map(
//                                 (achievement, achIndex) =>
//                                   achievement && (
//                                     <li
//                                       key={achIndex}
//                                       className="flex items-start gap-2"
//                                     >
//                                       <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
//                                       <span className="text-gray-700 dark:text-gray-300">
//                                         {achievement}
//                                       </span>
//                                     </li>
//                                   )
//                               )}
//                             </ul>
//                           )}
//                         </div>
//                       )
//                   )}
//                 </div>
//               )}
//               {/* Education */}
//               {formData.education.length > 0 && (
//                 <div>
//                   <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 dark:text-white">
//                     <GraduationCap className="w-6 h-6" />
//                     Education
//                   </h2>
//                   {formData.education.map(
//                     (edu, index) =>
//                       edu.degree &&
//                       edu.institution && (
//                         <div key={index} className="mb-4 last:mb-0">
//                           <div className="flex justify-between items-start mb-2">
//                             <div>
//                               <h3 className="text-xl font-bold dark:text-white">
//                                 {edu.degree}
//                               </h3>
//                               <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
//                                 {edu.institution}
//                               </p>
//                             </div>
//                             <div className="text-gray-600 dark:text-gray-400 font-medium">
//                               {edu.period || ''}
//                             </div>
//                           </div>
//                           {(edu.gpa || edu.honors) && (
//                             <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
//                               {edu.gpa && <span>GPA: {edu.gpa}</span>}
//                               {edu.honors && (
//                                 <span className="font-semibold">
//                                   {edu.honors}
//                                 </span>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       )
//                   )}
//                 </div>
//               )}
//               {/* Projects & Certifications */}
//               {(formData.projects.length > 0 ||
//                 formData.certifications.length > 0) && (
//                 <div>
//                   <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 dark:text-white">
//                     <FolderOpen className="w-6 h-6" />
//                     Projects & Certifications
//                   </h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {formData.projects.map(
//                       (project, index) =>
//                         project.name &&
//                         project.description && (
//                           <div
//                             key={index}
//                             className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
//                           >
//                             <div className="flex justify-between items-start mb-2">
//                               <div>
//                                 <h3 className="text-lg font-bold dark:text-white">
//                                   {project.name}
//                                 </h3>
//                                 <p className="text-gray-700 dark:text-gray-300 text-sm">
//                                   {project.description}
//                                 </p>
//                               </div>
//                               <div className="flex gap-2">
//                                 {project.link && (
//                                   <a
//                                     href={project.link}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
//                                   >
//                                     Demo
//                                   </a>
//                                 )}
//                                 {project.github && (
//                                   <a
//                                     href={project.github}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
//                                   >
//                                     GitHub
//                                   </a>
//                                 )}
//                               </div>
//                             </div>
//                             {project.technologies &&
//                               project.technologies.length > 0 && (
//                                 <div className="flex flex-wrap gap-2 mt-2">
//                                   {project.technologies
//                                     .slice(0, 3)
//                                     .map((tech, techIndex) => (
//                                       <Badge
//                                         key={techIndex}
//                                         variant="secondary"
//                                         className="dark:bg-gray-600 dark:text-gray-300 text-xs"
//                                       >
//                                         {tech}
//                                       </Badge>
//                                     ))}
//                                   {project.technologies.length > 3 && (
//                                     <Badge
//                                       variant="secondary"
//                                       className="dark:bg-gray-600 dark:text-gray-300 text-xs"
//                                     >
//                                       +{project.technologies.length - 3} more
//                                     </Badge>
//                                   )}
//                                 </div>
//                               )}
//                           </div>
//                         )
//                     )}
//                     {formData.certifications.map(
//                       (cert, index) =>
//                         cert.name &&
//                         cert.issuer && (
//                           <div
//                             key={index}
//                             className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
//                           >
//                             <h3 className="text-lg font-bold dark:text-white">
//                               {cert.name}
//                             </h3>
//                             <p className="text-gray-600 dark:text-gray-300 text-sm">
//                               {cert.issuer}
//                             </p>
//                             <div className="text-gray-500 dark:text-gray-400 mt-1 text-xs font-medium">
//                               {cert.date || ''}
//                             </div>
//                           </div>
//                         )
//                     )}
//                   </div>
//                 </div>
//               )}
//               {/* Languages */}
//               {formData.languages.length > 0 && (
//                 <div>
//                   <h2 className="text-2xl font-bold mb-4 dark:text-white">
//                     Languages
//                   </h2>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {formData.languages.map(
//                       (lang, index) =>
//                         lang.name && (
//                           <div
//                             key={index}
//                             className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
//                           >
//                             <span className="font-medium dark:text-white">
//                               {lang.name}
//                             </span>
//                             <span className="text-gray-600 dark:text-gray-400 ml-2 text-sm">
//                               - {lang.level || ''}
//                             </span>
//                           </div>
//                         )
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//             {/* Footer */}
//             <div className="bg-gray-50 dark:bg-gray-700 p-4 text-center text-gray-500 dark:text-gray-400 text-sm border-t dark:border-gray-600">
//               <p>
//                 © {new Date().getFullYear()}{' '}
//                 {formData.personal.name || 'Your Name'}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CVBuilder;
