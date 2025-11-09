export const printPDF = async ({
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
    const html2canvas = (await import('html2canvas-pro')).default;
    const jsPDF = (await import('jspdf')).default;

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

    const element = document.createElement('div');
    element.innerHTML = printHTML;
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.width = '210mm';
    document.body.appendChild(element);

    const sections = Array.from(element.querySelectorAll('.section')).filter(
      (section) => {
        const content = section.textContent.trim();
        const hasItems =
          section.querySelectorAll(
            '.experience-item, .project-item, .education-item, .certification-item, .language-item, .skill-tag'
          ).length > 0;
        const hasNonEmptyContent =
          content.length > 0 && !content.match(/^\s*$/);

        return hasNonEmptyContent && hasItems;
      }
    );

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210; // mm
    const pageHeight = 295; // mm
    const margin = 10; // mm
    const contentWidth = pageWidth - 2 * margin;
    const contentHeight = pageHeight - 2 * margin;

    let currentPosition = margin;
    let currentPage = 0;

    const addNewPage = () => {
      if (currentPage > 0) {
        pdf.addPage();
      }
      currentPage++;
      currentPosition = margin;
    };

    const fitsOnCurrentPage = (elementHeight) => {
      return currentPosition + elementHeight <= pageHeight - margin;
    };

    const addImageToPDF = async (element, sectionTitle) => {
      try {
        const clonedElement = element.cloneNode(true);
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.width = contentWidth + 'mm';
        tempContainer.appendChild(clonedElement);
        document.body.appendChild(tempContainer);

        const canvas = await html2canvas(tempContainer, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: tempContainer.scrollWidth,
          height: tempContainer.scrollHeight,
        });

        document.body.removeChild(tempContainer);

        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (!fitsOnCurrentPage(imgHeight)) {
          addNewPage();
        }

        pdf.addImage(
          imgData,
          'JPEG',
          margin,
          currentPosition,
          imgWidth,
          imgHeight
        );
        currentPosition += imgHeight + 2; // Kurangi jarak antar section dari 5mm menjadi 2mm

        return true;
      } catch (error) {
        console.error(`Error rendering ${sectionTitle}:`, error);
        return false;
      }
    };

    addNewPage();

    const header = element.querySelector('.header');
    if (header) {
      await addImageToPDF(header, 'Header');
    }

    const mainContent = element.querySelector('.main-content');
    if (mainContent && sections.length > 0) {
      for (const section of sections) {
        await addImageToPDF(
          section,
          section.querySelector('.section-title')?.textContent || 'Section'
        );
      }
    }

    document.body.removeChild(element);

    const filename = `CV-${personalInfo.name || 'CV'}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Gagal membuat PDF. Silakan coba lagi.');
  }
};

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
  const escapeHtml = (unsafe) => {
    const safeString = String(unsafe || '');
    return safeString
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const sectionsHTML = [];

  // 1. Cek Summary
  if (summary && summary.trim() !== '') {
    sectionsHTML.push(`
      <div class="section">
        <div class="section-title">Ringkasan Profesional</div>
        <div class="summary">
          <p>${escapeHtml(summary)}</p>
        </div>
      </div>
    `);
  }

  // 2. Cek Experience
  const validExperience =
    experience?.filter((exp) => exp.name && exp.position) || [];
  if (validExperience.length > 0) {
    sectionsHTML.push(`
      <div class="section">
        <div class="section-title">Pengalaman Kerja</div>
        ${validExperience
          .map(
            (exp) => `
          <div class="experience-item">
            <div class="experience-header">
              <div>
                <div class="experience-title">${escapeHtml(exp.position)}</div>
                <div class="experience-company">${escapeHtml(exp.name)}</div>
              </div>
            </div>
            <div class="experience-meta">
              ${
                exp.location
                  ? `<div class="experience-meta-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                      <span>${escapeHtml(exp.location)}</span>
                    </div>`
                  : ''
              }
              ${
                exp.period
                  ? `<div class="experience-meta-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
                      <span>${escapeHtml(exp.period)}</span>
                    </div>`
                  : ''
              }
            </div>
            ${
              exp.achievements && exp.achievements.length > 0
                ? `
            <ul class="experience-achievements">
              ${exp.achievements
                .map((achievement) =>
                  achievement ? `<li>${escapeHtml(achievement)}</li>` : ''
                )
                .join('')}
            </ul>`
                : ''
            }
          </div>
        `
          )
          .join('')}
      </div>
    `);
  }

  // 3. Cek Skills
  const hasTechnicalSkills = skills?.technical?.length > 0;
  const hasSoftSkills = skills?.soft?.length > 0;

  if (hasTechnicalSkills || hasSoftSkills) {
    sectionsHTML.push(`
      <div class="section">
        <div class="section-title">Keahlian</div>
        <div class="skills-container">
          ${
            hasTechnicalSkills
              ? `
          <div class="skills-group">
            <div class="skills-title">Keahlian Teknis</div>
            <div class="skill-tags">
              ${skills?.technical
                .map(
                  (skill) =>
                    `<span class="skill-tag">${escapeHtml(skill)}</span>`
                )
                .join('')}
            </div>
          </div>`
              : ''
          }
          ${
            hasSoftSkills
              ? `
          <div class="skills-group">
            <div class="skills-title">Keahlian Lunak</div>
            <div class="skill-tags">
              ${skills?.soft
                .map(
                  (skill) =>
                    `<span class="skill-tag">${escapeHtml(skill)}</span>`
                )
                .join('')}
            </div>
          </div>`
              : ''
          }
        </div>
      </div>
    `);
  }

  // 4. Cek Projects
  const validProjects =
    projects?.filter((project) => project.name && project.description) || [];
  if (validProjects.length > 0) {
    sectionsHTML.push(`
      <div class="section">
        <div class="section-title">Proyek</div>
        <div class="projects-container">
          ${validProjects
            .map(
              (project) => `
            <div class="project-item">
              <div class="project-title">${escapeHtml(project.name)}</div>
              <div class="project-description">${escapeHtml(
                project.description
              )}</div>
              ${
                project.link || project.github
                  ? `
              <div class="project-links">
                ${
                  project.link
                    ? `<a href="${escapeHtml(
                        project.link
                      )}" class="project-link" target="_blank">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                        Demo: ${escapeHtml(project.link)}
                      </a>`
                    : ''
                }
                ${
                  project.github
                    ? `<a href="${escapeHtml(
                        project.github
                      )}" class="project-link" target="_blank">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                        GitHub: ${escapeHtml(project.github)}
                      </a>`
                    : ''
                }
              </div>`
                  : ''
              }
              ${
                project.technologies && project.technologies?.length > 0
                  ? `
              <div class="project-technologies">
                ${project.technologies
                  .slice(0, 5)
                  .map(
                    (tech) =>
                      `<span class="tech-tag">${escapeHtml(tech)}</span>`
                  )
                  .join('')}
                ${
                  project.technologies?.length > 5
                    ? `<span class="tech-tag">+${
                        project.technologies?.length - 5
                      } teknologi</span>`
                    : ''
                }
              </div>`
                  : ''
              }
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `);
  }

  // 5. Cek Education
  const validEducation =
    education?.filter((edu) => edu.degree && edu.institution) || [];
  if (validEducation.length > 0) {
    sectionsHTML.push(`
      <div class="section">
        <div class="section-title">Pendidikan</div>
        ${validEducation
          .map(
            (edu) => `
            <div class="education-item">
              <div class="education-title">${escapeHtml(edu.degree)}</div>
              <div class="education-institution">${escapeHtml(
                edu.institution
              )}</div>
              <div class="education-meta">
                ${
                  edu.period
                    ? `<div class="experience-meta-item">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
                        <span>${edu.period}</span>
                      </div>`
                    : ''
                }
                ${
                  edu.gpa
                    ? `<div class="experience-meta-item">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
                        <span>IPK: ${escapeHtml(edu.gpa)}</span>
                      </div>`
                    : ''
                }
                ${
                  edu.honors
                    ? `<div class="experience-meta-item">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 5l5.5-2L12 4.5 15.5 3 21 5l-2 11H5zm7-13L7 5l1.5 10h9L19 5l-7 2z"/></svg>
                        <span>${escapeHtml(edu.honors)}</span>
                      </div>`
                    : ''
                }
              </div>
            </div>
          `
          )
          .join('')}
      </div>
    `);
  }

  // 6. Cek Certifications
  const validCertifications =
    certifications?.filter((cert) => cert.name && cert.issuer) || [];
  if (validCertifications.length > 0) {
    sectionsHTML.push(`
      <div class="section">
        <div class="section-title">Sertifikat</div>
        <div class="certifications-grid">
          ${validCertifications
            .map(
              (cert) => `
            <div class="certification-item">
              <div class="certification-title">${escapeHtml(cert.name)}</div>
              <div class="certification-issuer">${escapeHtml(cert.issuer)}</div>
              <div class="certification-date">${cert.date}</div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `);
  }

  // 7. Cek Languages
  const validLanguages = languages?.filter((lang) => lang.name) || [];
  if (validLanguages.length > 0) {
    sectionsHTML.push(`
      <div class="section">
        <div class="section-title">Bahasa</div>
        <div class="languages-grid">
          ${validLanguages
            .map(
              (lang) => `
            <div class="language-item">
              <span class="language-name">${escapeHtml(lang.name)}</span>
              <span class="language-level">${escapeHtml(
                lang.level || '-'
              )}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `);
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>CV - ${escapeHtml(personalInfo.name || 'Nama Anda')}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A4;
          margin: 1cm;
          @bottom-right {
            content: counter(page);
            font-size: 9pt;
            font-family: 'Inter', sans-serif;
          }
        }
        * { box-sizing: border-box; }
        body {
          font-family: 'Inter', sans-serif;
          font-size: 10pt;
          line-height: 1.5;
          color: #1e293b;
          margin: 0;
          padding: 0;
          background: #fff;
          counter-reset: page;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .cv-container {
          max-width: 210mm;
          margin: 0 auto;
          background: white;
          padding: 0;
        }
        .header {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 30pt 25pt;
          border-radius: 0 0 8pt 8pt;
          margin-bottom: 25pt;
          position: relative;
          overflow: hidden;
          page-break-inside: avoid;
        }
        .header::before {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 150pt;
          height: 150pt;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          transform: translate(30%, -30%);
        }
        .header::after {
          content: "";
          position: absolute;
          bottom: -50pt;
          left: -50pt;
          width: 100pt;
          height: 100pt;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
        }
        .profile-container {
          display: flex;
          align-items: center;
          gap: 20pt;
          position: relative;
          z-index: 1;
        }
        .profile-image {
          width: 100pt;
          height: 100pt;
          border-radius: 10%;
          object-fit: cover;
          border: 3pt solid rgba(255, 255, 255, 0.3);
          flex-shrink: 0;
          box-shadow: 0 4pt 12pt rgba(0, 0, 0, 0.15);
        }
        .profile-info { flex: 1; }
        .name {
          font-size: 28pt;
          font-weight: 700;
          margin-bottom: 4pt;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }
        .title {
          font-size: 14pt;
          font-weight: 500;
          margin-bottom: 12pt;
          opacity: 0.9;
        }
        .contact-info {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8pt;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 6pt;
          font-size: 9pt;
          opacity: 0.9;
        }
        .contact-item svg {
          width: 12pt;
          height: 12pt;
          fill: white;
        }
        
        /* PERUBAHAN: Kurangi margin-bottom section dan hapus page-break-inside */
        .section {
          margin-bottom: 25pt;
          page-break-inside: auto;
          break-inside: auto;
        }
        
        .section:last-child {
          margin-bottom: 0; /* Hapus margin untuk section terakhir */
        }
        
        .section-title {
          font-size: 16pt;
          font-weight: 700;
          margin-bottom: 10pt; /* Kurangi dari 12pt menjadi 10pt */
          padding-bottom: 6pt; /* Kurangi dari 8pt menjadi 6pt */
          border-bottom: 2pt solid #e2e8f0;
          color: #1e40af;
          position: relative;
          display: flex;
          align-items: center;
        }
        .section-title::after {
          content: "";
          position: absolute;
          bottom: -2pt;
          left: 0;
          width: 60pt;
          height: 2pt;
          background: #3b82f6;
        }
        .main-content { padding: 0 25pt; }
        .summary {
          font-size: 10pt;
          line-height: 1.6;
          margin-bottom: 15pt; /* Kurangi dari 20pt menjadi 15pt */
          padding: 12pt; /* Kurangi dari 15pt menjadi 12pt */
          background: #f8fafc;
          border-radius: 6pt;
          border-left: 4pt solid #3b82f6;
        }
        .skills-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15pt; /* Kurangi dari 20pt menjadi 15pt */
        }
        .skills-group {
          margin-bottom: 6pt; /* Kurangi dari 8pt menjadi 6pt */
          page-break-inside: avoid;
          break-inside: avoid;
        }
        .skills-title {
          font-size: 12pt;
          font-weight: 600;
          margin-bottom: 8pt; /* Kurangi dari 10pt menjadi 8pt */
          color: #334155;
        }
        .skill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5pt; /* Kurangi dari 6pt menjadi 5pt */
          page-break-inside: auto;
          break-inside: auto;
        }
        .skill-tag {
          display: inline-block;
          background: #eff6ff;
          color: #1e40af;
          padding: 3pt 8pt; /* Kurangi padding */
          border-radius: 20pt;
          font-size: 8.5pt;
          font-weight: 500;
          border: 1pt solid #bfdbfe;
        }
        .experience-item {
          margin-bottom: 15pt; /* Kurangi dari 18pt menjadi 15pt */
          padding-bottom: 15pt; /* Kurangi dari 18pt menjadi 15pt */
          border-bottom: 1pt solid #e2e8f0;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        .experience-item:last-child { 
          border-bottom: none; 
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .experience-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 5pt; /* Kurangi dari 6pt menjadi 5pt */
        }
        .experience-title {
          font-size: 13pt;
          font-weight: 700;
          color: #1e40af;
        }
        .experience-company {
          font-size: 11pt;
          font-weight: 600;
          color: #334155;
          margin-bottom: 3pt; /* Kurangi dari 4pt menjadi 3pt */
        }
        .experience-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10pt; /* Kurangi dari 12pt menjadi 10pt */
          font-size: 9pt;
          color: #64748b;
          margin-bottom: 8pt; /* Kurangi dari 10pt menjadi 8pt */
        }
        .experience-meta-item {
          display: flex;
          align-items: center;
          gap: 4pt;
        }
        .experience-achievements {
          list-style: none;
          padding-left: 0;
          margin: 0;
          page-break-inside: auto;
          break-inside: auto;
        }
        .experience-achievements li {
          font-size: 9.5pt;
          margin-bottom: 4pt; /* Kurangi dari 5pt menjadi 4pt */
          position: relative;
          padding-left: 16pt;
          line-height: 1.5;
        }
        .experience-achievements li:before {
          content: "•";
          position: absolute;
          left: 4pt;
          color: #3b82f6;
          font-weight: bold;
        }
        .education-item {
          margin-bottom: 12pt; /* Kurangi dari 16pt menjadi 12pt */
          padding-bottom: 12pt; /* Kurangi dari 16pt menjadi 12pt */
          border-bottom: 1pt solid #e2e8f0;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        .education-item:last-child { 
          border-bottom: none; 
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .education-title {
          font-size: 13pt;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 3pt; /* Kurangi dari 4pt menjadi 3pt */
        }
        .education-institution {
          font-size: 11pt;
          font-weight: 600;
          color: #334155;
          margin-bottom: 3pt; /* Kurangi dari 4pt menjadi 3pt */
        }
        .education-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10pt; /* Kurangi dari 12pt menjadi 10pt */
          font-size: 9pt;
          color: #64748b;
          margin-bottom: 5pt; /* Kurangi dari 6pt menjadi 5pt */
        }
        .education-details {
          font-size: 9.5pt;
          color: #475569;
        }
        .projects-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12pt; /* Kurangi dari 16pt menjadi 12pt */
        }
        .project-item {
          margin-bottom: 12pt; /* Kurangi dari 16pt menjadi 12pt */
          padding-bottom: 12pt; /* Kurangi dari 16pt menjadi 12pt */
          border-bottom: 1pt solid #e2e8f0;
          page-break-inside: avoid;
          break-inside: avoid;
          background: #f8fafc;
          border-radius: 6pt;
          padding: 10pt; /* Kurangi dari 12pt menjadi 10pt */
        }
        .project-item:last-child { 
          border-bottom: none; 
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .project-title {
          font-size: 12pt;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 5pt; /* Kurangi dari 6pt menjadi 5pt */
        }
        .project-description {
          font-size: 9pt;
          line-height: 1.5;
          margin-bottom: 6pt; /* Kurangi dari 8pt menjadi 6pt */
          color: #475569;
        }
        .project-links {
          display: flex;
          flex-direction: column;
          gap: 3pt; /* Kurangi dari 4pt menjadi 3pt */
          margin-bottom: 6pt; /* Kurangi dari 8pt menjadi 6pt */
        }
        .project-link {
          color: #1e40af;
          text-decoration: none;
          font-size: 8.5pt;
          display: flex;
          align-items: center;
          gap: 4pt;
        }
        .project-link:hover { text-decoration: underline; }
        .project-technologies {
          display: flex;
          flex-wrap: wrap;
          gap: 3pt; /* Kurangi dari 4pt menjadi 3pt */
        }
        .tech-tag {
          display: inline-block;
          background: #eff6ff;
          color: #1e40af;
          padding: 2pt 6pt; /* Kurangi padding */
          border-radius: 20pt;
          font-size: 8pt;
          border: 1pt solid #bfdbfe;
        }
        .certifications-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10pt; /* Kurangi dari 12pt menjadi 10pt */
        }
        .certification-item {
          padding: 10pt; /* Kurangi dari 12pt menjadi 10pt */
          border-bottom: 1pt solid #e2e8f0;
          page-break-inside: avoid;
          break-inside: avoid;
          background: #f8fafc;
          border-radius: 6pt;
        }
        .certification-item:last-child { border-bottom: none; }
        .certification-title {
          font-size: 11pt;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 3pt; /* Kurangi dari 4pt menjadi 3pt */
        }
        .certification-issuer {
          font-size: 10pt;
          font-weight: 600;
          color: #334155;
          margin-bottom: 3pt; /* Kurangi dari 4pt menjadi 3pt */
        }
        .certification-date {
          font-size: 8.5pt;
          color: #64748b;
        }
        .languages-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10pt; /* Kurangi dari 12pt menjadi 10pt */
        }
        .language-item {
          font-size: 9.5pt;
          display: flex;
          justify-content: space-between;
          padding: 8pt 10pt; /* Kurangi padding */
          border-bottom: 1pt solid #e2e8f0;
          page-break-inside: avoid;
          break-inside: avoid;
          background: #f8fafc;
          border-radius: 6pt;
        }
        .language-item:last-child { border-bottom: none; }
        .language-name {
          font-weight: 600;
          color: #334155;
        }
        .language-level {
          color: #64748b;
          font-weight: 500;
        }
        .footer {
          text-align: center;
          font-size: 8pt;
          color: #94a3b8;
          margin-top: 20pt; /* Kurangi dari 24pt menjadi 20pt */
          padding-top: 10pt; /* Kurangi dari 12pt menjadi 10pt */
          border-top: 1pt solid #e2e8f0;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        @media print {
          body { margin: 0; padding: 0; background: white; }
          .cv-container { box-shadow: none; border-radius: 0; }
          
          /* Tambahkan aturan untuk memastikan section yang panjang bisa dibagi */
          .section {
            page-break-inside: auto;
            break-inside: auto;
          }
          
          /* Pastikan item-item di dalam section tidak terpotong */
          .experience-item,
          .project-item,
          .education-item,
          .certification-item,
          .language-item,
          .skills-group {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="cv-container">
        <div class="header">
          <div class="profile-container">
            <div class="profile-info">
              <div class="name">${escapeHtml(
                personalInfo.name || 'Nama Anda'
              )}</div>
              <div class="title">${escapeHtml(
                personalInfo.title || 'Jabatan Anda'
              )}</div>
              <div class="contact-info">
                <div class="contact-item">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  <span>${escapeHtml(
                    personalInfo.email || 'email@example.com'
                  )}</span>
                </div>
                <div class="contact-item">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  <span>${escapeHtml(
                    personalInfo.phone || '+62 812 3456 7890'
                  )}</span>
                </div>
                <div class="contact-item">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  <span>${escapeHtml(
                    personalInfo.location || 'Lokasi Anda'
                  )}</span>
                </div>
                ${
                  personalInfo?.portfolio
                    ? `<div class="contact-item">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                        <span>${escapeHtml(personalInfo.portfolio)}</span>
                      </div>`
                    : ''
                }
                ${
                  personalInfo?.linkedin
                    ? `<div class="contact-item">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        <span>${escapeHtml(personalInfo.linkedin)}</span>
                      </div>`
                    : ''
                }
                ${
                  personalInfo?.github
                    ? `<div class="contact-item">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                        <span>${escapeHtml(personalInfo.github)}</span>
                      </div>`
                    : ''
                }
              </div>
            </div>
            ${
              personalInfo.image
                ? `<img src="${escapeHtml(
                    personalInfo.image
                  )}" alt="Profile" class="profile-image">`
                : ''
            }
          </div>
        </div>

        <div class="main-content">
          ${sectionsHTML.length > 0 ? sectionsHTML.join('') : ''}
        </div>
        
      </div>
    </body>
    </html>
  `;
};
