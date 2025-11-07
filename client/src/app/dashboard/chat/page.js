'use client';
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SendIcon, CopyIcon, Trash2Icon, XIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { RenderReactMarkDown } from '@/lib/reactMarkDown';

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

const MAX_MESSAGES = 50;

// Komponen pesan dengan memoization
const MessageBubble = React.memo(({ message, isTyping, onCopy }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-2xl px-4 py-3 rounded-2xl shadow-md ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-none'
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
              <p>{message.text}</p>
            ) : (
              <RenderReactMarkDown content={message.text} isSubstring={false} />
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
    onClearChat,
  }) => {
    return (
      <div className="w-full rounded-t-2xl shadow-lg border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-900 p-4">
        <div className="flex gap-2 items-center flex-col lg:flex-row">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            placeholder="Tanya Gama"
            disabled={isTyping}
            className="max-h-[120px] h-[90px]"
          />

          <div className="flex items-center gap-2">
            <Button
              onClick={isTyping ? onStopTyping : onSendMessage}
              disabled={!isTyping && inputValue.trim() === ''}
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
  const abortControllerRef = useRef(null);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success('Teks berhasil disalin!');
      })
      .catch((err) => {
        toast.error('Gagal menyalin teks. Silakan coba lagi.');
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

  const sendMessageToAI = useCallback(async (msg) => {
    try {
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      if (signal.aborted) {
        throw new Error('Permintaan dibatalkan');
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [{ text: msg }],
        config: {
          systemInstruction: `Kamu adalah Gama, asisten AI bawaan dari platform Delta Civitas. 
          Peranmu adalah membantu mahasiswa dalam belajar, diskusi, membuat CV, mencari lowongan kerja, dan mengelola aktivitas akademik mereka di dashboard.
          
          Gaya komunikasi:
          - Gunakan bahasa santai tapi sopan, cocok untuk mahasiswa.
          - Jangan terlalu formal, tapi tetap informatif.
          - Beri contoh konkret jika diperlukan.
          - Gunakan format markdown dan latex untuk struktur jawaban.`,
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

      // Menangani berbagai jenis error dengan pesan yang lebih jelas
      if (error.name === 'APIError' || error.message.includes('API')) {
        throw new Error(
          'Sedang ada masalah dengan layanan AI. Silakan coba lagi dalam beberapa menit.'
        );
      } else if (
        error.name === 'NetworkError' ||
        error.message.includes('network')
      ) {
        throw new Error(
          'Koneksi internet Anda tidak stabil. Silakan periksa koneksi Anda dan coba lagi.'
        );
      } else if (
        error.name === 'AuthenticationError' ||
        error.message.includes('auth')
      ) {
        throw new Error(
          'Terjadi masalah autentikasi. Silakan hubungi administrator.'
        );
      } else {
        throw new Error('Maaf, terjadi kesalahan. Silakan coba lagi.');
      }
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
    if (inputValue.trim() === '') return;

    if (isTyping) {
      handleStopTyping();
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
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

    setInputValue('');
    setIsTyping(true);

    try {
      const aiResponse = await sendMessageToAI(currentInputValue);

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

        // Tambahkan pesan error ke chat agar user bisa melihat
        const errorMessage = {
          id: Date.now().toString() + '_error',
          text: `Terjadi kesalahan: ${error.message}`,
          sender: 'ai',
          timestamp: new Date(),
        };

        setMessages((prev) => {
          const newMessages = [...prev, errorMessage];
          if (newMessages.length > MAX_MESSAGES) {
            const keepMessages = newMessages.slice(-MAX_MESSAGES + 1);
            return [prev[0], ...keepMessages];
          }
          return newMessages;
        });
      }
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, isTyping, sendMessageToAI, messages]);

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
        onClearChat={clearChat}
      />
    </div>
  );
}

export default ChatPage;
