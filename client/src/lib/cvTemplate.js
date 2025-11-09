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

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      onclone: (clonedDoc) => {
        const styles = clonedDoc.querySelectorAll('style');
        styles.forEach((style) => {
          if (
            style.innerHTML.includes('lab(') ||
            style.innerHTML.includes('color-mix(')
          ) {
            style.remove();
          }
        });
      },
    });

    document.body.removeChild(element);

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const filename = `CV-${personalInfo.name || 'CV'}.pdf`;
    pdf.save(filename);
  } catch (error) {
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

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>CV - ${escapeHtml(personalInfo.name || 'Nama Anda')}</title>
      <style>
        @page {
          size: A4;
          margin: 1.5cm;
          @bottom-right {
            content: counter(page);
            font-size: 10pt;
          }
        }

        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11pt;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background: #fff;
          counter-reset: page;
        }

        .cv-container {
          max-width: 210mm;
          margin: 0 auto;
          background: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          padding: 20pt;
          border-radius: 5pt;
        }

        .header {
          border-bottom: 2pt solid #0F4C81;
          padding-bottom: 15pt;
          margin-bottom: 20pt;
          position: relative;
          page-break-after: avoid; /* Ini bagus, jangan sampai header terpotong */
        }

        .profile-container {
          display: flex;
          align-items: center;
          gap: 25pt;
        }

        .profile-image {
          width: 100pt;
          height: 100pt;
          border-radius: 50%;
          object-fit: cover;
          border: 3pt solid #f0f0f0;
          flex-shrink: 0;
        }

        .profile-info {
          flex: 1;
        }

        .name {
          font-size: 32pt;
          font-weight: 700;
          margin-bottom: 6pt;
          color: #0F4C81;
          line-height: 1.2;
        }

        .title {
          font-size: 18pt;
          font-weight: 600;
          margin-bottom: 12pt;
          color: #555;
        }

        .contact-info {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8pt;
          margin-top: 12pt;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 6pt;
          font-size: 10pt;
          color: #555;
        }

        .contact-item svg {
          width: 14pt;
          height: 14pt;
          fill: #0F4C81;
        }

        .summary {
          font-size: 11pt;
          line-height: 1.6;
          margin-bottom: 20pt;
          padding: 12pt;
          background: #f8f9fa;
          border-left: 4pt solid #0F4C81;
          border-radius: 0 4pt 4pt 0;
          page-break-after: avoid; /* Ini juga bagus */
        }

        /*
         *
         * INI PERBAIKANNYA: 
         * 'page-break-after: always;' telah dihapus dari sini.
         *
         */
        .section {
          margin-bottom: 20pt;
        }

        .section-title {
          font-size: 18pt;
          font-weight: 700;
          margin-bottom: 12pt;
          padding-bottom: 6pt;
          border-bottom: 1pt solid #ddd;
          color: #0F4C81;
          display: flex;
          align-items: center;
          gap: 8pt;
        }

     
        .skills-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20pt;
        }

        .skills-group {
          margin-bottom: 8pt;
          page-break-inside: avoid; /* Ini sudah benar */
        }

        .skills-title {
          font-size: 14pt;
          font-weight: 600;
          margin-bottom: 10pt;
          color: #333;
        }

        .skill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6pt;
        }

        .skill-tag {
          display: inline-block;
          background: #e8f4f8;
          color: #0F4C81;
          padding: 4pt 10pt;
          border-radius: 2pt;
          font-size: 9pt;
          font-weight: 500;
          border: 1pt solid #d0e7f0;
        }

        .experience-item {
          margin-bottom: 16pt;
          padding-bottom: 16pt;
          border-bottom: 1pt solid #eee;
          page-break-inside: avoid; /* Ini sudah benar */
        }

        .experience-item:last-child {
          border-bottom: none;
        }

        .experience-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 6pt;
        }

        .experience-title {
          font-size: 15pt;
          font-weight: 700;
          color: #0F4C81;
        }

        .experience-company {
          font-size: 13pt;
          font-weight: 600;
          color: #333;
          margin-bottom: 4pt;
        }

        .experience-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12pt;
          font-size: 10pt;
          color: #666;
          margin-bottom: 8pt;
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
        }

        .experience-achievements li {
          font-size: 10pt;
          margin-bottom: 4pt;
          position: relative;
          padding-left: 16pt;
          line-height: 1.5;
        }

        .experience-achievements li:before {
          content: "▸";
          position: absolute;
          left: 0;
          color: #0F4C81;
          font-weight: bold;
        }

        .education-item {
          margin-bottom: 14pt;
          padding-bottom: 14pt;
          border-bottom: 1pt solid #eee;
          page-break-inside: avoid; /* Ini sudah benar */
        }

        .education-item:last-child {
          border-bottom: none;
        }

        .education-title {
          font-size: 15pt;
          font-weight: 700;
          color: #0F4C81;
          margin-bottom: 4pt;
        }

        .education-institution {
          font-size: 13pt;
          font-weight: 600;
          color: #333;
          margin-bottom: 4pt;
        }

        .education-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12pt;
          font-size: 10pt;
          color: #666;
          margin-bottom: 6pt;
        }

        .education-details {
          font-size: 10pt;
          color: #555;
        }

        .projects-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16pt;
        }

        .project-item {
          margin-bottom: 14pt;
          padding-bottom: 14pt;
          border-bottom: 1pt solid #eee;
          page-break-inside: avoid; /* Ini sudah benar */
        }

        .project-item:last-child {
          border-bottom: none;
        }

        .project-title {
          font-size: 14pt;
          font-weight: 700;
          color: #0F4C81;
          margin-bottom: 6pt;
        }

        .project-description {
          font-size: 10pt;
          line-height: 1.5;
          margin-bottom: 8pt;
          color: #555;
        }

        .project-links {
          display: flex;
          flex-direction: column;
          gap: 4pt;
          margin-bottom: 8pt;
        }

        .project-link {
          color: #0F4C81;
          text-decoration: none;
          font-size: 10pt;
          display: flex;
          align-items: center;
          gap: 4pt;
        }

        .project-link:hover {
          text-decoration: underline;
        }

        .project-technologies {
          display: flex;
          flex-wrap: wrap;
          gap: 4pt;
        }

        .tech-tag {
          display: inline-block;
          background: #e8f4f8;
          color: #0F4C81;
          padding: 3pt 8pt;
          border-radius: 4pt;
          font-size: 9pt;
          border: 1pt solid #d0e7f0;
        }

        .certifications-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12pt;
        }

        .certification-item {
          padding-bottom: 12pt;
          border-bottom: 1pt solid #eee;
          page-break-inside: avoid; /* Ini sudah benar */
        }

        .certification-item:last-child {
          border-bottom: none;
        }

        .certification-title {
          font-size: 13pt;
          font-weight: 700;
          color: #0F4C81;
          margin-bottom: 4pt;
        }

        .certification-issuer {
          font-size: 11pt;
          font-weight: 600;
          color: #333;
          margin-bottom: 4pt;
        }

        .certification-date {
          font-size: 9pt;
          color: #666;
        }

        .languages-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12pt;
        }

        .language-item {
          font-size: 10pt;
          display: flex;
          justify-content: space-between;
          padding-bottom: 8pt;
          border-bottom: 1pt solid #eee;
          page-break-inside: avoid; /* Ini sudah benar */
        }

        .language-item:last-child {
          border-bottom: none;
        }

        .language-name {
          font-weight: 600;
          color: #333;
        }

        .language-level {
          color: #666;
        }

        .footer {
          text-align: center;
          font-size: 9pt;
          color: #888;
          margin-top: 24pt;
          padding-top: 12pt;
          border-top: 1pt solid #eee;
          page-break-inside: avoid;
        }

        @media print {
          body {
            margin: 0;
            padding: 0;
          }

          .cv-container {
            box-shadow: none;
            border-radius: 0;
            padding: 15pt;
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
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <span>${escapeHtml(
                    personalInfo.email || 'email@example.com'
                  )}</span>
                </div>
                <div class="contact-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <span>${escapeHtml(
                    personalInfo.phone || '+62 812 3456 7890'
                  )}</span>
                </div>
                <div class="contact-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>${escapeHtml(
                    personalInfo.location || 'Lokasi Anda'
                  )}</span>
                </div>
         ${
           personalInfo?.portfolio
             ? `
                <div class="contact-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  <span>${escapeHtml(personalInfo.portfolio)}</span>
                </div>
                `
             : ''
         }
                ${
                  personalInfo?.linkedin
                    ? `
                <div class="contact-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span>${escapeHtml(personalInfo.linkedin)}</span>
                </div>
                `
                    : ''
                }
                ${
                  personalInfo?.github
                    ? `
                <div class="contact-item">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  <span>${escapeHtml(personalInfo.github)}</span>
                </div>
                `
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

        ${
          summary
            ? `
        <div class="summary">
          <p>${escapeHtml(summary)}</p>
        </div>
        `
            : ''
        }

        ${
          experience?.length > 0
            ? `
        <div class="section">
          <div class="section-title">Pengalaman Kerja</div>
          ${experience
            ?.map(
              (exp) => `
            ${
              exp.name && exp.position
                ? `
            <div class="experience-item">
              <div class="experience-header">
                <div>
                  <div class="experience-title">${escapeHtml(
                    exp.position
                  )}</div>
                  <div class="experience-company">${escapeHtml(exp.name)}</div>
                </div>
              </div>
              <div class="experience-meta">
                ${
                  exp.location
                    ? `<div class="experience-meta-item">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <span>${escapeHtml(exp.location)}</span>
                      </div>`
                    : ''
                }
                ${
                  exp.period
                    ? `<div class="experience-meta-item">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                        </svg>
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
                  ?.map((achievement) =>
                    achievement ? `<li>${escapeHtml(achievement)}</li>` : ''
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
          skills?.technical?.length > 0 || skills?.soft?.length > 0
            ? `
        <div class="section">
          <div class="section-title">Keahlian</div>
          <div class="skills-container">
            ${
              skills?.technical?.length > 0
                ? `
            <div class="skills-group">
              <div class="skills-title">Keahlian Teknis</div>
              <div class="skill-tags">
                ${skills?.technical
                  ?.map(
                    (skill) =>
                      `<span class="skill-tag">${escapeHtml(skill)}</span>`
                  )
                  .join('')}
              </div>
            </div>
            `
                : ''
            }

            ${
              skills?.soft?.length > 0
                ? `
            <div class="skills-group">
              <div class="skills-title">Keahlian Lunak</div>
              <div class="skill-tags">
                ${skills?.soft
                  ?.map(
                    (skill) =>
                      `<span class="skill-tag">${escapeHtml(skill)}</span>`
                  )
                  .join('')}
              </div>
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
          projects?.length > 0
            ? `
        <div class="section">
          <div class="section-title">Proyek</div>
          <div class="projects-container">
            ${projects
              ?.map(
                (project) => `
              ${
                project.name && project.description
                  ? `
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
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                          </svg>
                          Demo: ${escapeHtml(project.link)}
                        </a>`
                      : ''
                  }
                  ${
                    project.github
                      ? `<a href="${escapeHtml(
                          project.github
                        )}" class="project-link" target="_blank">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                          </svg>
                          GitHub: ${escapeHtml(project.github)}
                        </a>`
                      : ''
                  }
                </div>
                `
                    : ''
                }
                ${
                  project.technologies && project.technologies?.length > 0
                    ? `
                <div class="project-technologies">
                  ${project.technologies
                    .slice(0, 5)
                    ?.map(
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
          education?.length > 0
            ? `
        <div class="section">
          <div class="section-title">Pendidikan</div>
          ${education
            ?.map(
              (edu) => `
            ${
              edu.degree && edu.institution
                ? `
            <div class="education-item">
              <div class="education-title">${escapeHtml(edu.degree)}</div>
              <div class="education-institution">${escapeHtml(
                edu.institution
              )}</div>
              <div class="education-meta">
                ${
                  edu.period
                    ? `<div class="experience-meta-item">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                        </svg>
                        <span>${edu.period}</span>
                      </div>`
                    : ''
                }
                ${
                  edu.gpa
                    ? `<div class="experience-meta-item">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                        </svg>
                        <span>IPK: ${escapeHtml(edu.gpa)}</span>
                      </div>`
                    : ''
                }
                ${
                  edu.honors
                    ? `<div class="experience-meta-item">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M5 16L3 5l5.5-2L12 4.5 15.5 3 21 5l-2 11H5zm7-13L7 5l1.5 10h9L19 5l-7 2z"/>
                        </svg>
                        <span>${escapeHtml(edu.honors)}</span>
                      </div>`
                    : ''
                }
              </div>
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
          certifications?.length > 0
            ? `
        <div class="section">
          <div class="section-title">Sertifikat</div>
          <div class="certifications-grid">
            ${certifications
              ?.map(
                (cert) => `
              ${
                cert.name && cert.issuer
                  ? `
              <div class="certification-item">
                <div class="certification-title">${escapeHtml(cert.name)}</div>
                <div class="certification-issuer">${escapeHtml(
                  cert.issuer
                )}</div>
                <div class="certification-date">${cert.date}</div>
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
          languages?.length > 0
            ? `
        <div class="section">
          <div class="section-title">Bahasa</div>
          <div class="languages-grid">
            ${languages
              ?.map(
                (lang) => `
              ${
                lang.name
                  ? `
              <div class="language-item">
                <span class="language-name">${escapeHtml(lang.name)}</span>
                <span class="language-level">${escapeHtml(
                  lang.level || '-'
                )}</span>
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
      </div>
    </body>
    </html>
  `;
};
