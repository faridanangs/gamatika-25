'use client';
import { Button } from '@/components/ui/button';
import { conGetNftByID, conMintNFT, conSetBaseURI } from '@/nft/action';

export default function TestSession() {
  const handleMintNFT = async () => {
    await conMintNFT();
  };
  const handleGetTokenURI = async () => {
    await conGetNftByID(1);
  };

  const handleSetBaseURI = async () => {
    await conSetBaseURI();
  };

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col gap-2">
      <Button onClick={handleMintNFT}>mint nft</Button>
      <Button onClick={handleGetTokenURI}>get token uri</Button>
      <Button onClick={handleSetBaseURI}>set base uri</Button>
    </div>
  );
}
