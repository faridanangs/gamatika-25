'use server';

export async function getEBooks(selectedCourse) {
  try {
    let query = '';
    switch (selectedCourse) {
      case 'Kalkulus II':
        query = 'calculus mathematics';
        break;
      case 'Aljabar Linear':
        query = 'linear algebra';
        break;
      case 'Fisika Dasar':
        query = 'physics fundamentals';
        break;
      case 'Kimia Dasar':
        query = 'chemistry basics';
        break;
      case 'Biologi':
        query = 'biology science';
        break;
      case 'Matematika Diskrit':
        query = 'discrete mathematics';
        break;
      case 'Statistika':
        query = 'statistics';
        break;
      case 'Fisika Modern':
        query = 'modern physics';
        break;
      case 'Kimia Organik':
        query = 'organic chemistry';
        break;
      case 'Biologi Molekuler':
        query = 'molecular biology';
        break;
      case 'Matematika Terapan':
        query = 'applied mathematics';
        break;
      case 'Fisika Komputasi':
        query = 'computational physics';
        break;
      case 'Kimia Analitik':
        query = 'analytical chemistry';
        break;
      case 'Biologi Evolusioner':
        query = 'evolutionary biology';
        break;
      case 'Matematika Finansial':
        query = 'financial mathematics';
        break;
      case 'Fisika Kuantum':
        query = 'quantum physics';
        break;
      case 'Kimia Fisik':
        query = 'physical chemistry';
        break;
      case 'Biologi Sel':
        query = 'cell biology';
        break;
      case 'Pancasila':
        query = 'pancasila';
        break;
      default:
        query = 'mathematics science';
    }

    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(
        query
      )}&limit=20`
    );
    if (!response.ok) {
      throw new Error('Gagal mengambil data buku');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Network Error Occurred');
  }
}
