'use client';
import { Button } from '@/components/ui/button';
import {
  conGetNftByID,
  conGetNFTByOwner,
  conMintNFT,
  conSetBaseURI,
} from '@/nft/action';
import toast from 'react-hot-toast';

export function TestPageComp({ session }) {
  const handleMintNFT = async () => {
    try {
      await conMintNFT(session.user.walletAddress);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleGetTokenURI = async () => {
    try {
      await conGetNftByID(1);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSetBaseURI = async () => {
    try {
      await conSetBaseURI();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleGetNFTByOwner = async () => {
    try {
      const resp = await conGetNFTByOwner(session.user.walletAddress);
      console.log(resp);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col gap-2">
      <Button onClick={handleMintNFT}>mint nft</Button>
      <Button onClick={handleGetTokenURI}>get token uri</Button>
      <Button onClick={handleGetNFTByOwner}>get nft by owner</Button>
      <Button onClick={handleSetBaseURI}>set base uri</Button>
    </div>
  );
}
