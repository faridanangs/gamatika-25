'use server';

export async function getJurnals(selectedCourse, currentPage) {
  try {
    let query = '';
    switch (selectedCourse) {
      case 'Kalkulus II':
        query = 'kalkulus';
        break;
      case 'Aljabar Linear':
        query = 'aljabar linear';
        break;
      case 'Fisika Dasar':
        query = 'fisika';
        break;
      case 'Kimia Dasar':
        query = 'kimia';
        break;
      case 'Biologi':
        query = 'biologi';
        break;
      case 'Matematika Diskrit':
        query = 'matematika diskrit';
        break;
      case 'Statistika':
        query = 'statistika';
        break;
      case 'Fisika Modern':
        query = 'fisika modern';
        break;
      case 'Blockchain':
        query = 'blockchain';
        break;
      case 'Kecerdasan Buatan':
        query = 'ai';
        break;
      case 'Kimia Organik':
        query = 'kimia organik';
        break;
      case 'Biologi Molekuler':
        query = 'biologi molekuler';
        break;
      case 'Matematika Terapan':
        query = 'matematika terapan';
        break;
      case 'Fisika Komputasi':
        query = 'fisika komputasi';
        break;
      case 'Kimia Analitik':
        query = 'kimia analitik';
        break;
      case 'Biologi Evolusioner':
        query = 'biologi evolusioner';
        break;
      case 'Matematika Finansial':
        query = 'matematika finansial';
        break;
      case 'Fisika Kuantum':
        query = 'fisika kuantum';
        break;
      case 'Kimia Fisik':
        query = 'kimia fisik';
        break;
      case 'Biologi Sel':
        query = 'biologi sel';
        break;
      case 'Pancasila':
        query = 'pancasila';
        break;
      case 'Digital':
        query = 'digital';
        break;
      default:
        query = 'science';
    }

    const url = `https://doaj.org/api/v4/search/articles/${query}?page=${currentPage}&pageSize=6`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil data jurnal`);
    }

    return await response.json();
  } catch (error) {
    throw new Error('Network Error Occurred');
  }
}
