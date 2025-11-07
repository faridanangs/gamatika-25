'use client';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { formatDateTime } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { getPrivateKey } from '@/data/getUserData';

export const EditPostModal = ({ post, onDeletePost, onSave, onClose }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const handleSave = () => {
    onSave({
      id: post.id,
      title,
      content,
    });
  };

  const handleDelete = () => {
    onDeletePost(post.id);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Postingan</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Judul</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul postingan"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Konten</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Masukkan konten postingan"
              rows={4}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
          <Button onClick={handleSave}>Simpan</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const PrivateKeyModal = ({ isOpen, onClose, onVerify, token }) => {
  const [password, setPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const handleVerify = async () => {
    setIsLoading(true);
    setError('');
    try {
      const resp = await getPrivateKey(token, password);
      if (!resp.success) {
        toast.error(resp.errors[0].message);
        setIsLoading(false);
        return;
      }
      setPrivateKey(resp.data.private_key);
      onVerify(true);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(privateKey);
    toast.success('Private key copied!');
    setPrivateKey('');
    onClose(true);
    setPassword('');
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[90%] dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle>Lihat Private Key</DialogTitle>
        </DialogHeader>
        {privateKey ? (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 mb-2 dark:text-white">
                Private Key Anda:
              </p>
              <div className="flex items-center justify-between gap-1">
                <code className="text-sm font-mono dark:bg-gray-800 bg-white p-2 rounded border break-all">
                  {privateKey}
                </code>
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </Button>
              </div>
            </div>
            <p className="text-xs text-red-400">
              *Simpan private key dengan aman. Jangan berikan kepada siapa pun.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Masukkan Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password Anda"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button onClick={handleVerify} disabled={isLoading || !password}>
                {isLoading ? 'Memverifikasi...' : 'Verifikasi'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
