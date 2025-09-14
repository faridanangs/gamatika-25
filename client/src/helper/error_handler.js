const { default: toast } = require('react-hot-toast');

// Error handler yang lebih rapi
export const handleRegistrationError = (error) => {
  // Parsing error message dari server
  const errorMessage =
    error || error.error || 'Terjadi kesalahan saat registrasi';

  // Cek tipe error dan berikan pesan yang lebih spesifik
  if (errorMessage.includes('Username or email already exists')) {
    toast.error(
      'Username atau email sudah digunakan. Silakan gunakan yang lain.'
    );
  } else if (
    errorMessage.includes('Validation failed') &&
    errorMessage.includes('Nim')
  ) {
    toast.error('NIM harus diisi dan berupa angka minimal 8 digit.');
  } else if (
    errorMessage.includes('Validation failed') &&
    errorMessage.includes('Prodi')
  ) {
    toast.error('Program studi harus dipilih.');
  } else if (
    errorMessage.includes('Validation failed') &&
    errorMessage.includes('Email')
  ) {
    toast.error('Format email tidak valid.');
  } else if (
    errorMessage.includes('Validation failed') &&
    errorMessage.includes('Password')
  ) {
    toast.error('Password minimal 6 karakter.');
  } else if (
    errorMessage.includes('Validation failed') &&
    errorMessage.includes('full_name')
  ) {
    toast.error('Nama lengkap harus diisi.');
  } else if (
    errorMessage.includes('Validation failed') &&
    errorMessage.includes('username')
  ) {
    toast.error('Username harus diisi.');
  } else {
    toast.error(errorMessage);
  }
};
