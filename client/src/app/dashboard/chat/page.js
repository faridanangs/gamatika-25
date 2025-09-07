'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// Fungsi untuk memformat tanggal
const formatTime = (date) => {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Komponen untuk gambar dalam pesan
const MessageImage = ({ src, alt }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="mt-2 rounded-lg overflow-hidden shadow-md"
  >
    <img src={src} alt={alt} className="w-full max-w-md rounded-lg" />
  </motion.div>
);

// Komponen untuk pesan dengan animasi
const MessageBubble = ({ message, isTyping }) => {
  const isUser = message.sender === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
          isUser
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
            : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 rounded-bl-none'
        }`}
      >
        {isTyping ? (
          <div className="flex gap-1">
            <motion.div
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <motion.div
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        ) : (
          <>
            <div className="text-sm md:text-base">
              {isUser ? (
                <>
                  <p>{message.text}</p>
                  {message.images && message.images.length > 0 && (
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {message.images.map((image, index) => (
                        <MessageImage
                          key={index}
                          src={image}
                          alt={`Uploaded image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={atomDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    table({ children }) {
                      return (
                        <div className="overflow-x-auto">
                          <table className="min-w-full my-4 border-collapse border border-gray-300 dark:border-gray-700">
                            {children}
                          </table>
                        </div>
                      );
                    },
                    th({ children }) {
                      return (
                        <th className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 px-4 py-2 text-left font-semibold">
                          {children}
                        </th>
                      );
                    },
                    td({ children }) {
                      return (
                        <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                          {children}
                        </td>
                      );
                    },
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              )}
            </div>
            <p
              className={`text-xs mt-2 ${
                isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {formatTime(message.timestamp)}
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
};

// Komponen input area dengan dukungan hingga 2 gambar
const ChatInput = ({
  inputValue,
  setInputValue,
  handleSendMessage,
  isTyping,
  onFileUpload,
  uploadedFiles,
  setUploadedFiles,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      handleMultipleFileUpload(files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleMultipleFileUpload(files);
    }
  };

  const handleMultipleFileUpload = (files) => {
    const validFiles = files.filter((file) => {
      // Cek apakah file adalah gambar
      if (!file.type.startsWith('image/')) {
        alert('Hanya file gambar yang diperbolehkan');
        return false;
      }

      // Cek ukuran file (maksimal 20MB)
      if (file.size > 20 * 1024 * 1024) {
        alert(`File ${file.name} terlalu besar. Maksimal 20MB.`);
        return false;
      }

      return true;
    });

    // Cek apakah total gambar melebihi 2
    if (uploadedFiles.length + validFiles.length > 2) {
      alert('Maksimal 2 gambar dapat di-upload');
      return;
    }

    // Proses file yang valid
    const newFiles = [...uploadedFiles];

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile = {
          file,
          preview: e.target.result,
          name: file.name,
        };
        newFiles.push(newFile);
        setUploadedFiles([...newFiles]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-4 rounded-t-2xl shadow-lg border-t border-gray-200 dark:border-gray-700"
    >
      {/* Area upload file */}
      <div
        className={`mb-3 p-3 rounded-lg border-2 border-dashed transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-sm">
            Drag & drop gambar di sini atau klik untuk upload (maks 2 gambar,
            20MB per gambar)
          </span>
        </div>
        <input
          type="file"
          className="hidden"
          id="file-upload"
          accept="image/*"
          multiple
          onChange={handleFileInputChange}
        />
        <label
          htmlFor="file-upload"
          className="mt-2 block text-center text-xs text-blue-500 hover:text-blue-600 cursor-pointer"
        >
          Pilih gambar
        </label>
      </div>

      {/* Preview gambar terupload */}
      {uploadedFiles.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={file.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[80px]">
                  {file.name}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {uploadedFiles.length}/2 gambar terupload
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={
            uploadedFiles.length > 0
              ? 'Tambahkan caption untuk gambar...'
              : 'Tanyakan tentang matematika, jadwal kuliah, atau upload gambar...'
          }
          className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          disabled={isTyping}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSendMessage}
          disabled={
            isTyping || (inputValue.trim() === '' && uploadedFiles.length === 0)
          }
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full p-3 hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </motion.button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        Tekan Enter untuk mengirim pesan • Maksimal 2 gambar (20MB per gambar)
      </p>
    </motion.div>
  );
};

// Komponen untuk pesan sistem
const SystemMessage = ({ text }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex justify-center my-4"
  >
    <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-full text-sm">
      {text}
    </div>
  </motion.div>
);

export default function ChatPage() {
  const ai = new GoogleGenAI({
    apiKey: 'AIzaSyBLiJgdGYRrNEd5wVmYzRj4SCw7cifLtyM',
  });

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Halo! Saya Gama, asisten AI dari Gamatika. Saya bisa membantu Anda dengan pertanyaan tentang matematika, jadwal kuliah, materi pembelajaran, dan lainnya. Ada yang bisa saya bantu? 🎓',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages]);

  const handleScroll = () => {
    const container = messagesEndRef.current?.parentElement;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop <= clientHeight + 50;
      setShouldAutoScroll(isNearBottom);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileUpload = (files) => {
    const validFiles = files.filter((file) => {
      // Cek apakah file adalah gambar
      if (!file.type.startsWith('image/')) {
        alert('Hanya file gambar yang diperbolehkan');
        return false;
      }

      // Cek ukuran file (maksimal 20MB)
      if (file.size > 20 * 1024 * 1024) {
        alert(`File ${file.name} terlalu besar. Maksimal 20MB.`);
        return false;
      }

      return true;
    });

    // Cek apakah total gambar melebihi 2
    if (uploadedFiles.length + validFiles.length > 2) {
      alert('Maksimal 2 gambar dapat di-upload');
      return;
    }

    // Proses file yang valid
    const newFiles = [...uploadedFiles];

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile = {
          file,
          preview: e.target.result,
          name: file.name,
        };
        newFiles.push(newFile);
        setUploadedFiles([...newFiles]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' && uploadedFiles.length === 0) return;

    // Buat pesan user dengan gambar jika ada
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    // Tambahkan gambar ke pesan jika ada
    if (uploadedFiles.length > 0) {
      userMessage.images = uploadedFiles.map((file) => file.preview);
    }

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setUploadedFiles([]);
    setIsTyping(true);

    try {
      // Siapkan data untuk dikirim ke Gemini
      const imageDatas =
        uploadedFiles.length > 0
          ? await Promise.all(
              uploadedFiles.map((file) => fileToBase64(file.file))
            )
          : null;

      // Simulasi respons AI dengan typing effect
      const aiResponse = await GeminiResponse(inputValue, imageDatas);

      // Tambahkan pesan AI dengan typing effect
      const aiMessage = {
        id: messages.length + 2,
        text: '',
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Simulasikan typing effect
      const words = aiResponse.split(' ');
      let currentText = '';

      for (let i = 0; i < words.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 30));
        currentText += words[i] + ' ';
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1].text = currentText;
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Fungsi untuk mengkonversi file ke base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const dataUrl = reader.result;
        // Extract the base64 part (after the comma)
        const base64 = dataUrl.split(',')[1];
        if (base64) {
          resolve(base64);
        } else {
          reject(new Error('Could not extract base64 data from data URL'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const GeminiResponse = async (msg, imageDatas) => {
    try {
      // Siapkan prompt dengan gambar jika ada
      if (imageDatas && imageDatas.length > 0) {
        // Menggunakan Gemini dengan multimodal
        const contents = imageDatas.map((data, index) => ({
          inlineData: {
            mimeType: uploadedFiles[index].file.type || 'image/jpeg',
            data: data,
          },
        }));

        // Tambahkan teks sebagai bagian terakhir
        contents.push({ text: msg });

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: contents,
          config: {
            systemInstruction: `
              Kamu adalah Gama, asisten AI bawaan dari platform Gamatika. 
              Peranmu adalah membantu mahasiswa dalam belajar, diskusi, 
              membuat CV, mencari lowongan kerja, dan mengelola aktivitas 
              akademik mereka di dashboard.
              
              Gaya komunikasi:
              - Gunakan bahasa santai tapi sopan, cocok untuk mahasiswa.
              - Jangan terlalu formal, tapi tetap informatif.
              - Kalau ada istilah teknis, beri penjelasan singkat biar mudah dipahami.
              - Gunakan emoji yang sesuai untuk membuat percakapan lebih hidup.
              - Beri contoh konkret jika diperlukan.
              - Gunakan format markdown untuk struktur jawaban:
                - **Bold** untuk penekanan
                - *Italic* untuk penekanan ringan
                - # Heading untuk judul
                - - List untuk poin-poin
                - \` \` \` untuk kode
                - Tabel untuk data terstruktur
              - Jika ada gambar, berikan analisis detail tentang konten gambar.
              
              Batasan:
              - Jangan memberi jawaban medis, hukum, atau keuangan yang serius.
              - Kalau ada pertanyaan di luar lingkup, jawab dengan ramah dan arahkan 
                ke sumber lain.
                
              Identitas:
              - Nama kamu: Gama.
              - Kamu bukan manusia, tapi asisten AI di Gamatika.
            `,
          },
        });

        return response.text;
      } else {
        // Tanpa gambar
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: msg,
          config: {
            systemInstruction: `
              Kamu adalah Gama, asisten AI bawaan dari platform Gamatika. 
              Peranmu adalah membantu mahasiswa dalam belajar, diskusi, 
              membuat CV, mencari lowongan kerja, dan mengelola aktivitas 
              akademik mereka di dashboard.
              
              Gaya komunikasi:
              - Gunakan bahasa santai tapi sopan, cocok untuk mahasiswa.
              - Jangan terlalu formal, tapi tetap informatif.
              - Kalau ada istilah teknis, beri penjelasan singkat biar mudah dipahami.
              - Gunakan emoji yang sesuai untuk membuat percakapan lebih hidup.
              - Beri contoh konkret jika diperlukan.
              - Gunakan format markdown untuk struktur jawaban:
                - **Bold** untuk penekanan
                - *Italic* untuk penekanan ringan
                - # Heading untuk judul
                - - List untuk poin-poin
                - \` \` \` untuk kode
                - Tabel untuk data terstruktur
              - Jika ada gambar, berikan analisis detail tentang konten gambar.
              
              Batasan:
              - Jangan memberi jawaban medis, hukum, atau keuangan yang serius.
              - Kalau ada pertanyaan di luar lingkup, jawab dengan ramah dan arahkan 
                ke sumber lain.
                
              Identitas:
              - Nama kamu: Gama.
              - Kamu bukan manusia, tapi asisten AI di Gamatika.
            `,
          },
        });

        return response.text;
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto w-full flex flex-col h-[90vh] shadow-2xl overflow-hidden bg-white dark:bg-gray-800">
        {/* Area Pesan */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          onScroll={handleScroll}
        >
          <AnimatePresence>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && (
              <MessageBubble
                message={{
                  sender: 'ai',
                  text: '',
                  timestamp: new Date(),
                }}
                isTyping={true}
              />
            )}
          </AnimatePresence>
          {/* Pesan sistem untuk instruksi */}
          {messages.length === 1 && (
            <SystemMessage text="Ketik pertanyaan Anda, upload gambar (maks 2), atau tekan Enter untuk memulai percakapan" />
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Area Input */}
        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
          isTyping={isTyping}
          onFileUpload={handleFileUpload}
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
        />
      </div>
      {/* Footer dengan informasi */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-400 py-3">
        Powered by Gamatika AI • Gemini 2.5 • Support Markdown & Gambar (maks 2
        gambar, 20MB per gambar)
      </div>
    </div>
  );
}
