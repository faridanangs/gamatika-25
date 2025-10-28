'use client';
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  UploadIcon,
  SendIcon,
  XIcon,
  CopyIcon,
  Trash2Icon,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

const MAX_MESSAGES = 50;
const MAX_CONTEXT_MESSAGES = 10;

const MessageImage = React.memo(({ src, alt }) => (
  <div className="mt-2 rounded-lg overflow-hidden shadow-md">
    <img src={src} alt={alt} className="w-full max-w-md rounded-lg" />
  </div>
));

MessageImage.displayName = 'MessageImage';

// Komponen pesan dengan memoization
const MessageBubble = React.memo(({ message, isTyping, onCopy }) => {
  const isUser = message.sender === 'user';

  return (
    <div
      className={`flex ${
        isUser ? 'justify-end' : 'justify-start overflow-x-auto'
      } mb-4`}
    >
      <div
        className={`max-w-2xl px-4 py-3 rounded-2xl shadow-md ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-none overflow-x-auto'
        } break-words`}
      >
        {isTyping ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
            </div>
            <span className="text-sm text-gray-500">AI sedang mengetik...</span>
          </div>
        ) : (
          <div className="text-sm">
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
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="overflow-x-auto rounded-md my-2 bg-[#2d2d2d]">
                        <SyntaxHighlighter
                          style={atomDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.text}
              </ReactMarkdown>
            )}
          </div>
        )}

        {!isTyping && (
          <button
            onClick={() => onCopy(message.text)}
            className={`mt-2 text-xs flex items-center gap-1 ${
              isUser
                ? 'text-gray-200 hover:text-gray-100 dark:text-gray-100 dark:hover:text-gray-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <CopyIcon className="w-3 h-3" />
            Salin
          </button>
        )}
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

// Komponen input chat dengan memoization
const ChatInput = React.memo(
  ({
    inputValue,
    setInputValue,
    onSendMessage,
    isTyping,
    onStopTyping,
    uploadedFiles,
    setUploadedFiles,
    onClearChat,
  }) => {
    const fileInputRef = useRef(null);

    const handleFileUpload = useCallback(
      (files) => {
        const validFiles = Array.from(files).filter((file) => {
          if (!file.type.startsWith('image/')) {
            toast.error('Hanya file gambar yang diperbolehkan');
            return false;
          }
          if (file.size > 20 * 1024 * 1024) {
            toast.error(`File ${file.name} terlalu besar. Maksimal 20MB.`);
            return false;
          }
          return true;
        });

        if (uploadedFiles.length + validFiles.length > 1) {
          toast.error('Maksimal 1 gambar dapat di-upload');
          return;
        }

        validFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            setUploadedFiles((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                file,
                preview: e.target.result,
                name: file.name,
                mimeType: file.type,
              },
            ]);
          };
          reader.readAsDataURL(file);
        });
      },
      [uploadedFiles, setUploadedFiles]
    );

    const removeFile = useCallback(
      (id) => {
        setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
      },
      [setUploadedFiles]
    );

    return (
      <div className="w-full rounded-t-2xl shadow-lg border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-900 p-4">
        {uploadedFiles.length > 0 && (
          <div className="mb-3">
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
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
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

        <div className="flex gap-2 items-center flex-col">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            placeholder={
              uploadedFiles.length > 0
                ? 'Tambahkan caption untuk gambar...'
                : 'Tanya Gama'
            }
            disabled={isTyping}
            className="max-h-[120px] h-[90px]"
          />

          <div className="flex justify-between items-center w-full">
            <div className="transition-colors inline-block cursor-pointer">
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
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <UploadIcon className="text-blue-500" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={isTyping ? onStopTyping : onSendMessage}
                disabled={
                  !isTyping &&
                  inputValue.trim() === '' &&
                  uploadedFiles.length === 0
                }
                className={`rounded-full p-3 transition-all shadow-md ${
                  isTyping
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {isTyping ? (
                  <XIcon className="w-5 h-5" />
                ) : (
                  <SendIcon className="w-5 h-5" />
                )}
              </Button>
              <Button
                onClick={onClearChat}
                variant="outline"
                className="rounded-full p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Hapus riwayat chat"
              >
                <Trash2Icon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ChatInput.displayName = 'ChatInput';

function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Halo! Saya Gama, asisten AI dari Delta Civitas. Ada yang bisa saya bantu?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const abortControllerRef = useRef(null);

  const fileToBase64 = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  }, []);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success('Teks berhasil disalin!');
      })
      .catch((err) => {
        toast.error('Gagal menyalin teks: ', err);
      });
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: '1',
        text: 'Halo! Saya Gama, asisten AI dari Delta Civitas. Ada yang bisa saya bantu?',
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
    toast.success('Riwayat chat telah dihapus');
  }, []);

  const sendMessageToAI = useCallback(async (msg, images) => {
    try {
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      const contents = images?.length
        ? images.map((img) => ({
            inlineData: { mimeType: img.mimeType, data: img.data },
          }))
        : [];

      contents.push({ text: msg });

      if (signal.aborted) {
        throw new Error('Permintaan dibatalkan');
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents,
        config: {
          systemInstruction: `Kamu adalah Gama, asisten AI bawaan dari platform Delta Civitas. 
          Peranmu adalah membantu mahasiswa dalam belajar, diskusi, membuat CV, mencari lowongan kerja, dan mengelola aktivitas akademik mereka di dashboard.
          
          Gaya komunikasi:
          - Gunakan bahasa santai tapi sopan, cocok untuk mahasiswa.
          - Jangan terlalu formal, tapi tetap informatif.
          - Beri contoh konkret jika diperlukan.
          - Gunakan format markdown dan latext untuk struktur jawaban.`,
        },
        signal,
      });

      if (signal.aborted) {
        throw new Error('Permintaan dibatalkan');
      }

      let aiText = 'Maaf, saya tidak dapat memberikan respons saat ini.';
      if (response) {
        if (typeof response.text === 'function') {
          aiText = response.text();
        } else if (response.text) {
          aiText = response.text;
        } else if (response.response?.text) {
          aiText =
            typeof response.response.text === 'function'
              ? response.response.text()
              : response.response.text;
        }
      }
      return aiText;
    } catch (error) {
      if (
        error.message === 'Permintaan dibatalkan' ||
        error.name === 'AbortError'
      ) {
        return null;
      }

      throw new Error('Maaf, terjadi kesalahan. Silakan coba lagi.');
    }
  }, []);

  const handleStopTyping = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsTyping(false);
    setMessages((prev) =>
      prev.filter((msg) => !(msg.sender === 'ai' && msg.text === ''))
    );
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (inputValue.trim() === '' && uploadedFiles.length === 0) return;

    if (isTyping) {
      handleStopTyping();
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      images: uploadedFiles.map((file) => file.preview),
    };

    setMessages((prev) => {
      const newMessages = [...prev, userMessage];
      if (newMessages.length > MAX_MESSAGES) {
        const keepMessages = newMessages.slice(-MAX_MESSAGES + 1);
        return [prev[0], ...keepMessages];
      }
      return newMessages;
    });

    const currentInputValue = inputValue;
    const currentUploadedFiles = [...uploadedFiles];

    setInputValue('');
    setUploadedFiles([]);
    setIsTyping(true);

    try {
      const imageDatas =
        currentUploadedFiles.length > 0
          ? await Promise.all(
              currentUploadedFiles.map(async (fileObj) => {
                const data = await fileToBase64(fileObj.file);
                return {
                  data,
                  mimeType: fileObj.mimeType,
                };
              })
            )
          : null;

      const aiResponse = await sendMessageToAI(currentInputValue, imageDatas);

      if (aiResponse === null) {
        return;
      }

      const aiMessage = {
        id: Date.now().toString() + '_ai',
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const newMessages = [...prev, aiMessage];
        if (newMessages.length > MAX_MESSAGES) {
          const keepMessages = newMessages.slice(-MAX_MESSAGES + 1);
          return [prev[0], ...keepMessages];
        }
        return newMessages;
      });
    } catch (error) {
      if (error.message !== 'Permintaan dibatalkan') {
        toast.error(error.message);
      }
    } finally {
      setIsTyping(false);
    }
  }, [
    inputValue,
    uploadedFiles,
    isTyping,
    fileToBase64,
    sendMessageToAI,
    messages,
  ]);

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onCopy={copyToClipboard}
          />
        ))}
        {isTyping && (
          <MessageBubble
            message={{
              sender: 'ai',
              text: '',
              timestamp: new Date(),
            }}
            isTyping={true}
            onCopy={copyToClipboard}
          />
        )}
      </div>

      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSendMessage={handleSendMessage}
        onStopTyping={handleStopTyping}
        isTyping={isTyping}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
        onClearChat={clearChat}
      />
    </div>
  );
}

ChatPage.displayName = 'ChatPage';

export default ChatPage;
