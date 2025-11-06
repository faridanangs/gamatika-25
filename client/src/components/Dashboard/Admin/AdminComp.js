'use client';
import { useEffect, useState } from 'react';
import { Star, Award, Plus } from 'lucide-react';
import { conGetAllNFTs, conMintNFT } from '@/nft/action';
import toast from 'react-hot-toast';
import { TopContributors } from '../../Forum/Forum';
import { Button } from '@/components/ui/button';

const AdminComp = ({ initialContribs, token }) => {
  const [nfts, setNfts] = useState('0');
  const [contribs, setContribs] = useState(initialContribs);
  const [recipient, setRecipient] = useState('');

  useEffect(() => {
    const fetchNFTs = async () => {
      const nftsCount = await conGetAllNFTs();
      setNfts(nftsCount.toString());
    };

    fetchNFTs();
  }, []);

  const handleMintNFT = async () => {
    try {
      await conMintNFT(recipient);
      setRecipient('');
      toast.success('NFT berhasil di mint!');
      // Refresh NFT count after minting
      const nftsCount = await conGetAllNFTs();
      setNfts(nftsCount.toString());
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Kelola platform Delta Civitas
          </p>
        </div>

        {/* Stats Cards - Only NFT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Award
                  className="text-purple-600 dark:text-purple-400"
                  size={24}
                />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 dark:text-gray-400">Total NFT</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {nfts}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Star className="text-yellow-500 mr-2" /> Top Contributor
          </h2>

          <TopContributors props={contribs} isText={false} isAddress={true} />
        </div>

        {/* Mint NFT */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 my-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Award className="text-purple-500 mr-2" /> Mint NFT
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Penerima
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Wallet Address"
                value={recipient}
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleMintNFT}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center"
              >
                <Plus className="mr-2" /> Mint NFT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComp;
