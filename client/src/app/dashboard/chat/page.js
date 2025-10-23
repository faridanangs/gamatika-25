'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { UploadIcon, SendIcon, PauseIcon, PlayIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';

// Konfigurasi AI
const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

// Format waktu
const formatTime = (date) =>
  date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

// Komponen gambar pesan
const MessageImage = ({ src, alt }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="mt-2 rounded-lg overflow-hidden shadow-md"
  >
    <img src={src} alt={alt} className="w-full max-w-md rounded-lg" />
  </motion.div>
);

// Komponen pesan
const MessageBubble = ({ message, isTyping }) => {
  const isUser = message.sender === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
          isUser
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
            : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 rounded-bl-none'
        }`}
      >
        {isTyping ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              AI sedang mengetik...
            </span>
          </div>
        ) : (
          <>
            <div className="text-sm md:text-base">
              {isUser ? (
                <>
                  <p>{message.text}</p>
                  {message.images?.map((img, idx) => (
                    <MessageImage
                      key={idx}
                      src={img}
                      alt={`Uploaded ${idx + 1}`}
                    />
                  ))}
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

// Komponen input chat
const ChatInput = ({
  inputValue,
  setInputValue,
  onSendMessage,
  isTyping,
  uploadedFiles,
  setUploadedFiles,
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (files) => {
    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith('image/')) {
        alert('Hanya file gambar yang diperbolehkan');
        return false;
      }
      if (file.size > 20 * 1024 * 1024) {
        alert(`File ${file.name} terlalu besar. Maksimal 20MB.`);
        return false;
      }
      return true;
    });

    if (uploadedFiles.length + validFiles.length > 1) {
      alert('Maksimal 1 gambar dapat di-upload');
      return;
    }

    const newFiles = [...uploadedFiles];
    validFiles.forEach((file) => {
      const fileId = `file-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedFiles((prev) => [
          ...prev,
          {
            id: fileId,
            file,
            preview: e.target.result,
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (id) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleDrag = (e, type) => {
    e.preventDefault();
    if (type === 'over') setIsDragging(true);
    else if (type === 'leave') setIsDragging(false);
    else if (type === 'drop') {
      setIsDragging(false);
      handleFileUpload(e.dataTransfer.files);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-3 w-full rounded-t-2xl shadow-lg border-t border-gray-100 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-card"
    >
      {uploadedFiles.length > 0 && (
        <div className="">
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="relative group">
                <img
                  src={file.preview}
                  alt={`Preview ${file.name}`}
                  className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                />
                <button
                  onClick={() => removeFile(file.id)}
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
            {uploadedFiles.length}/1 gambar terupload
          </div>
        </div>
      )}

      <div className="flex gap-2 justify-between items-center px-1">
        <div
          className={`py-1 rounded-lg transition-colors inline-block cursor-pointer ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
          }`}
          onDragOver={(e) => handleDrag(e, 'over')}
          onDragLeave={(e) => handleDrag(e, 'leave')}
          onDrop={(e) => handleDrag(e, 'drop')}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) =>
              e.target.files.length > 0 && handleFileUpload(e.target.files)
            }
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <UploadIcon className="text-blue-500" />
          </button>
        </div>

        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
          placeholder={
            uploadedFiles.length > 0
              ? 'Tambahkan caption untuk gambar...'
              : 'Tanya Gama'
          }
          disabled={isTyping}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSendMessage}
          disabled={
            isTyping || (inputValue.trim() === '' && uploadedFiles.length === 0)
          }
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full p-3 hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <SendIcon className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Pesan sistem
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
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Halo! Saya Gama, asisten AI dari Delta Civitas. Saya bisa membantu Anda dengan pertanyaan tentang matematika, jadwal kuliah, E-Book & Jurnal, dan lainnya. Ada yang bisa saya bantu? 🎓',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isTypingPaused, setIsTypingPaused] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Auto-scroll ke bawah
  useEffect(() => {
    if (shouldAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle scroll
  useEffect(() => {
    const container = messagesEndRef.current?.parentElement;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShouldAutoScroll(scrollHeight - scrollTop <= clientHeight + 50);
    }
  }, []);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const sendMessageToAI = async (msg, images) => {
    try {
      const contents = images?.length
        ? images.map((data) => ({
            inlineData: { mimeType: 'image/jpeg', data },
          }))
        : [];

      contents.push({ text: msg });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents,
        config: {
          systemInstruction: `
            Kamu adalah Gama, asisten AI bawaan dari platform Delta Civitas. 
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
            - Kamu bukan manusia, tapi asisten AI di Delta Civitas.
          `,
        },
      });

      return response.text;
    } catch (error) {
      throw new Error('Maaf, terjadi kesalahan. Silakan coba lagi.');
    }
  };

  // Handle kirim pesan
  const handleSendMessage = async () => {
    if (inputValue.trim() === '' && uploadedFiles.length === 0) return;

    // Pesan user
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      images: uploadedFiles.map((file) => file.preview),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setUploadedFiles([]);
    setIsTyping(true);
    setIsTypingPaused(false);

    try {
      const imageDatas =
        uploadedFiles.length > 0
          ? await Promise.all(
              uploadedFiles.map((file) => fileToBase64(file.file))
            )
          : null;

      const aiResponse = await sendMessageToAI(inputValue, imageDatas);

      const aiMessage = {
        id: messages.length + 2,
        text: '',
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      const words = aiResponse.split(' ');
      let currentText = '';
      let currentIndex = 0;

      const typeNextWord = () => {
        if (currentIndex < words.length) {
          if (!isTypingPaused) {
            currentText += words[currentIndex] + ' ';
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1].text = currentText;
              return updated;
            });
            currentIndex++;
          }
          setTimeout(typeNextWord, 30);
        } else {
          setIsTyping(false);
          setIsTypingPaused(false);
        }
      };

      typeNextWord();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-h-screen h-full w-full">
      {/* Area pesan */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-4 w-full h-full">
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

        {messages.length === 1 && (
          <SystemMessage text="Ketik pertanyaan Anda, upload gambar (maks 1), atau tekan Enter untuk memulai percakapan" />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Area input */}
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
      />
    </div>
  );
}
