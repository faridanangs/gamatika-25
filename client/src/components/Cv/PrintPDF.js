// Fungsi untuk print PDF
export const printPDF = () => {
  // Clone elemen untuk print
  const printContent = componentRef.current.cloneNode(true);
  // Hapus elemen yang tidak perlu untuk print
  const downloadButton = printContent.querySelector('.download-button');
  if (downloadButton) downloadButton.remove();
  const contactLinks = printContent.querySelector('.contact-links');
  if (contactLinks) contactLinks.remove();
  // Buat iframe sementara
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  // Isi iframe dengan konten yang akan di-print
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
          <div class="name">${cvData.personal.name || 'Your Name'}</div>
          <div class="title">${cvData.personal.title || 'Your Title'}</div>
          <div class="contact-info">
            <div class="contact-item">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>${cvData.personal.email || 'your.email@example.com'}</span>
            </div>
            <div class="contact-item">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>${cvData.personal.phone || '+1 (555) 123-4567'}</span>
            </div>
            <div class="contact-item">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>${cvData.personal.location || 'Your Location'}</span>
            </div>
            <div class="contact-item">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>${cvData.personal.portfolio || 'yourportfolio.com'}</span>
            </div>
          </div>
        </div>
        
        ${
          cvData.summary
            ? `
        <div class="summary">
          ${cvData.summary}
        </div>
        `
            : ''
        }
        
        ${
          cvData.skills.technical.length > 0 || cvData.skills.soft.length > 0
            ? `
        <div class="section">
          <div class="section-title">Skills</div>
          <div class="skills-container">
            ${
              cvData.skills.technical.length > 0
                ? `
            <div class="skills-group">
              <div class="skills-title">Technical Skills</div>
              ${cvData.skills.technical
                .map((skill) => `<span class="skill-tag">${skill}</span>`)
                .join('')}
            </div>
            `
                : ''
            }
            
            ${
              cvData.skills.soft.length > 0
                ? `
            <div class="skills-group">
              <div class="skills-title">Soft Skills</div>
              ${cvData.skills.soft
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
          cvData.experience.length > 0
            ? `
        <div class="section">
          <div class="section-title">Work Experience</div>
          ${cvData.experience
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
          cvData.education.length > 0
            ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${cvData.education
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
          cvData.projects.length > 0 || cvData.certifications.length > 0
            ? `
        <div class="section">
          <div class="section-title">Projects & Certifications</div>
          <div class="projects-container">
            ${cvData.projects
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
            
            ${cvData.certifications
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
          cvData.languages.length > 0
            ? `
        <div class="section">
          <div class="section-title">Languages</div>
          <div class="languages-grid">
            ${cvData.languages
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
    cvData.personal.name || 'Your Name'
  }</p>
        </div>
      </div>
    `;
  // Print iframe
  iframe.contentWindow.print();
  // Hapus iframe setelah print
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 1000);
};
