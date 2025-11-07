import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const printPDF = async ({
  componentRef,
  personalInfo,
  summary,
  skills,
  experience,
  education,
  projects,
  certifications,
  languages,
}) => {
  try {
    if (!componentRef || !componentRef.current) {
      throw new Error('Element reference not found');
    }

    const element = componentRef.current;

    // Tambahkan kelas untuk PDF rendering
    element.classList.add('pdf-rendering');

    // Tunggu element sepenuhnya ter-render
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Deteksi apakah ini perangkat mobile
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    // Konfigurasi html2canvas dengan opsi yang dioptimalkan untuk mobile
    const canvas = await html2canvas(element, {
      scale: isMobile ? 1.5 : 2, // Scale lebih rendah untuk mobile
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: isMobile ? window.innerWidth : element.scrollWidth,
      windowHeight: isMobile ? window.innerHeight : element.scrollHeight,
      backgroundColor: '#ffffff',
      // Opsi khusus untuk mobile
      scale: window.devicePixelRatio || (isMobile ? 1.5 : 2),
      removeContainer: false,
      foreignObjectRendering: true,
      ignoreElements: (element) => {
        // Abaikan elemen yang tidak perlu di PDF
        return (
          element.classList.contains('download-button') ||
          element.classList.contains('contact-links')
        );
      },
    });

    // Hapus kelas PDF rendering
    element.classList.remove('pdf-rendering');

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // Lebar A4 dalam mm
    const pageHeight = 295; // Tinggi A4 dalam mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // Tambahkan halaman pertama
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Tambahkan halaman tambahan jika diperlukan
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Simpan PDF dengan nama file yang aman
    const safeName = (personalInfo.name || 'CV')
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    const fileName = `${safeName}_cv.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);

    // Fallback ke metode alternatif jika jsPDF gagal
    try {
      await fallbackPrintPDF({
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
    } catch (fallbackError) {
      console.error('Fallback PDF generation also failed:', fallbackError);

      // Method terakhir: gunakan browser print dialog
      await browserPrint({
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
    }
  }
};

// Fallback method jika jsPDF tidak tersedia atau gagal
const fallbackPrintPDF = async ({
  componentRef,
  personalInfo,
  summary,
  skills,
  experience,
  education,
  projects,
  certifications,
  languages,
}) => {
  if (!componentRef || !componentRef.current) {
    throw new Error('Element reference not found');
  }

  const element = componentRef.current;

  // Clone element untuk menghindari modifikasi asli
  const printContent = element.cloneNode(true);

  // Hapus elemen yang tidak diperlukan untuk print
  const downloadButton = printContent.querySelector('.download-button');
  if (downloadButton) downloadButton.remove();

  const contactLinks = printContent.querySelector('.contact-links');
  if (contactLinks) contactLinks.remove();

  // Buat konten HTML untuk print dengan styling yang dioptimalkan untuk mobile
  const printHTML = generatePrintHTML({
    personalInfo,
    summary,
    skills,
    experience,
    education,
    projects,
    certifications,
    languages,
  });

  // Buat blob dan URL
  const blob = new Blob([printHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  // Buka dalam tab baru untuk print
  const printWindow = window.open('', '_blank');

  if (printWindow) {
    printWindow.document.write(printHTML);
    printWindow.document.close();

    // Tunggu konten dimuat sebelum print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();

        // Tutup window setelah print
        setTimeout(() => {
          printWindow.close();
          URL.revokeObjectURL(url);
        }, 1000);
      }, 1000);
    };
  } else {
    // Jika popup diblokir, coba metode lain
    await browserPrint({
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
  }
};

// Method terakhir untuk print menggunakan browser
const browserPrint = async ({
  componentRef,
  personalInfo,
  summary,
  skills,
  experience,
  education,
  projects,
  certifications,
  languages,
}) => {
  if (!componentRef || !componentRef.current) {
    throw new Error('Element reference not found');
  }

  const element = componentRef.current;

  // Buat iframe tersembunyi
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  // Tunggu iframe dimuat
  await new Promise((resolve) => {
    iframe.onload = resolve;
    iframe.src = 'about:blank';
  });

  // Isi iframe dengan konten CV
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(
    generatePrintHTML({
      personalInfo,
      summary,
      skills,
      experience,
      education,
      projects,
      certifications,
      languages,
    })
  );
  iframeDoc.close();

  // Tunggu konten dimuat
  await new Promise((resolve) => {
    iframe.onload = resolve;
  });

  // Tampilkan iframe secara sementara
  iframe.style.display = 'block';

  // Beri jeda sebelum print
  setTimeout(() => {
    iframe.contentWindow.print();

    // Sembunyikan kembali setelah print
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 1000);
};

// Fungsi untuk menghasilkan HTML untuk print dengan mobile optimization
const generatePrintHTML = ({
  personalInfo,
  summary,
  skills,
  experience,
  education,
  projects,
  certifications,
  languages,
}) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CV - ${personalInfo.name || 'Nama Anda'}</title>
      <style>
        @page {
          size: A4;
          margin: 0.5cm;
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
        
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 10pt;
          line-height: 1.4;
          color: #000;
          margin: 0;
          padding: 0;
          background: white;
        }
        
        .cv-container {
          max-width: 210mm;
          width: 100%;
          background: white;
          box-shadow: none;
          border-radius: 0;
          padding: 0;
          margin: 0 auto;
          overflow-x: hidden;
        }
        
        .header {
          border-bottom: 1pt solid #000;
          padding-bottom: 8pt;
          margin-bottom: 12pt;
        }
        
        .profile-container {
          display: flex;
          align-items: center;
          gap: 16pt;
          flex-wrap: wrap;
        }
        
        .profile-image {
          width: 70pt;
          height: 70pt;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }
        
        .profile-info {
          flex: 1;
          min-width: 0;
        }
        
        .name {
          font-size: 22pt;
          font-weight: bold;
          margin-bottom: 4pt;
          line-height: 1.2;
          word-wrap: break-word;
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
          gap: 6pt;
          margin-top: 8pt;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 4pt;
          font-size: 10pt;
          word-wrap: break-word;
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
          word-wrap: break-word;
        }
        
        .experience-item {
          margin-bottom: 10pt;
          page-break-inside: avoid;
        }
        
        .experience-title {
          font-size: 12pt;
          font-weight: bold;
          margin-bottom: 1pt;
        }
        
        .experience-company {
          font-size: 10pt;
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
          display: inline-block;
          background: #f0f0f0;
          padding: 2pt 6pt;
          border-radius: 4pt;
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
          word-wrap: break-word;
        }
        
        .experience-achievements li:before {
          content: "•";
          position: absolute;
          left: 0;
        }
        
        .education-item {
          margin-bottom: 8pt;
          page-break-inside: avoid;
        }
        
        .education-title {
          font-size: 12pt;
          font-weight: bold;
          margin-bottom: 1pt;
        }
        
        .education-institution {
          font-size: 10pt;
          font-weight: 600;
          margin-bottom: 1pt;
        }
        
        .education-period {
          font-size: 10pt;
          margin-bottom: 3pt;
          font-weight: 500;
          display: inline-block;
          background: #f0f0f0;
          padding: 2pt 6pt;
          border-radius: 4pt;
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
          page-break-inside: avoid;
        }
        
        .project-title {
          font-size: 11pt;
          font-weight: bold;
          margin-bottom: 2pt;
          word-wrap: break-word;
        }
        
        .project-description {
          font-size: 10pt;
          margin-bottom: 3pt;
          word-wrap: break-word;
        }
        
        .project-links {
          display: flex;
          flex-direction: column;
          gap: 4pt;
          margin-bottom: 3pt;
          font-size: 9pt;
        }
        
        .project-link {
          color: #0066cc;
          text-decoration: none;
          word-wrap: break-word;
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
          word-wrap: break-word;
        }
        
        .certifications-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8pt;
        }
        
        .certification-item {
          padding-bottom: 6pt;
          border-bottom: 1pt solid #eee;
          page-break-inside: avoid;
        }
        
        .certification-title {
          font-size: 11pt;
          font-weight: bold;
          margin-bottom: 1pt;
          word-wrap: break-word;
        }
        
        .certification-issuer {
          font-size: 10pt;
          margin-bottom: 2pt;
          word-wrap: break-word;
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
          page-break-inside: avoid;
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
        
        /* Mobile-specific styles */
        @media (max-width: 768px) {
          .cv-container {
            max-width: 100%;
          }
          
          .contact-info {
            grid-template-columns: 1fr;
          }
          
          .skills-container,
          .projects-container,
          .certifications-grid,
          .languages-grid {
            grid-template-columns: 1fr;
          }
          
          .profile-container {
            flex-direction: column;
            text-align: center;
          }
          
          .profile-image {
            width: 80pt;
            height: 80pt;
          }
        }
      </style>
    </head>
    <body>
      <div class="cv-container">
        <div class="header">
          <div class="profile-container">
            <div class="profile-info">
              <div class="name">${personalInfo.name || 'Nama Anda'}</div>
              <div class="title">${personalInfo.title || 'Jabatan Anda'}</div>
              <div class="contact-info">
                <div class="contact-item">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>${personalInfo.email || 'email@example.com'}</span>
                </div>
                <div class="contact-item">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>${personalInfo.phone || '+62 812 3456 7890'}</span>
                </div>
                <div class="contact-item">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>${personalInfo.location || 'Lokasi Anda'}</span>
                </div>
                ${
                  personalInfo.portfolio
                    ? `
                <div class="contact-item">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  <span>${personalInfo.portfolio}</span>
                </div>
                `
                    : ''
                }
              </div>
            </div>
                 ${
                   personalInfo.image
                     ? `<img src="${personalInfo.image}" alt="Profile" class="profile-image">`
                     : ''
                 }
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
          <div class="section-title">Keahlian</div>
          <div class="skills-container">
            ${
              skills.technical.length > 0
                ? `
            <div class="skills-group">
              <div class="skills-title">Keahlian Teknis</div>
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
              <div class="skills-title">Keahlian Lunak</div>
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
          <div class="section-title">Pengalaman Kerja</div>
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
          <div class="section-title">Pendidikan</div>
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
                ${edu.gpa ? `<span>IPK: ${edu.gpa}</span>` : ''}
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
          projects.length > 0
            ? `
        <div class="section">
          <div class="section-title">Proyek</div>
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
                      ? `<a href="${project.link}" class="project-link">Demo: ${project.link}</a>`
                      : ''
                  }
                  ${
                    project.github
                      ? `<a href="${project.github}" class="project-link">GitHub: ${project.github}</a>`
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
                        } lebih</span>`
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
        </div>
        `
            : ''
        }
        
        ${
          certifications.length > 0
            ? `
        <div class="section">
          <div class="section-title">Sertifikat</div>
          <div class="certifications-grid">
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
          <div class="section-title">Bahasa</div>
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
    personalInfo.name || 'Nama Anda'
  }</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
