'use client';
import { ethers } from 'ethers';
import { ABI, GMTKNFTAddress } from './constant';

export const contractConfig = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(GMTKNFTAddress, ABI, signer);

  return contract;
};

export const conMintNFT = async () => {
  try {
    const contract = await contractConfig();

    const tx = await contract.mintNFT(
      '0x8f1a46d0464f75468a68f0548a4078c37d2cd041'
    );
    await tx.wait();

    console.log(tx);
  } catch (error) {
    console.error(error);
  }
};
export const conSetBaseURI = async () => {
  try {
    const contract = await contractConfig();
    const tx = await contract.setBaseURI(process.env.NEXT_PUBLIC_BASE_URI);
    await tx.wait();

    console.log(tx);
  } catch (error) {
    console.error(error);
  }
};

export const conGetNftByID = async (id) => {
  try {
    const contract = await contractConfig();

    const tx = await contract.tokenURI(id);

    console.log(tx);
  } catch (error) {
    console.error(error);
  }
};
