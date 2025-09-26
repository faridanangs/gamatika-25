'use client';
import { ethers } from 'ethers';
import { ABI, GMTKNFTAddress, polygonAmoyProvider } from './constant';
import toast from 'react-hot-toast';

const handleError = (error) => {
  // Error dari JSON-RPC (MetaMask, provider)
  if (typeof error.code === 'number') {
    switch (error.code) {
      case -32603:
        return 'Internal JSON-RPC error. Mungkin ada masalah dengan provider atau kontrak.';
      case 4001: // User rejected transaction (MetaMask)
        return 'Transaction rejected by user.';
      case -32000: // Gas estimation failed atau nonce error
        return 'RPC error: gas estimation failed atau nonce error.';
      default:
        return `RPC Error (${error.code}): ${error.message || 'Unknown error'}`;
    }
  }

  // Error dari Ethers.js
  if (typeof error.code === 'string') {
    switch (error.code) {
      case 'CALL_EXCEPTION':
        if (error.reason) return `Smart Contract Error: ${error.reason}`;
        return 'Smart Contract execution failed. Please check contract requirements.';
      case 'UNPREDICTABLE_GAS_LIMIT':
        return 'Gas estimation failed. Transaction might fail. Try increasing gas limit.';
      case 'NETWORK_ERROR':
        return 'Network connection error. Please check your internet connection.';
      case 'INVALID_ARGUMENT':
        return `Invalid input: ${error.argument}`;
      case 'SIGNER_REQUIRED':
        return 'Wallet connection required. Please connect your wallet first.';
      case 'ACTION_REJECTED':
        return 'Transaction rejected by user.';
      case 'INSUFFICIENT_FUNDS':
        return 'Insufficient funds to complete transaction.';
      case 'TRANSACTION_FAILED':
        return 'Transaction failed. Please check transaction details.';
      default:
        return `Ethers Error (${error.code}): ${
          error.message || 'Unknown error'
        }`;
    }
  }

  // Error dari MetaMask message
  if (error.message?.includes('denied')) {
    return 'Transaction rejected by user.';
  }

  if (error.message?.includes('insufficient funds')) {
    return 'Insufficient funds to complete transaction.';
  }

  if (error.message?.includes('Failed to fetch')) {
    return 'Failed to fetch NFT metadata. Please try again later.';
  }

  return error.message || 'An unexpected error occurred.';
};

// Fungsi konfigurasi contract dengan error handling
export const contractConfigWithSigner = async () => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(GMTKNFTAddress, ABI, signer);
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage);
  }
};

export const contractConfigWithoutSigner = async () => {
  try {
    return new ethers.Contract(GMTKNFTAddress, ABI, polygonAmoyProvider);
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage);
  }
};

// Fungsi interaksi dengan contract
export const conMintNFT = async (address) => {
  try {
    const contract = await contractConfigWithSigner();
    const tx = await contract.mintNFT(address);
    await tx.wait();
    return tx;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage);
  }
};

export const conSetBaseURI = async () => {
  try {
    const contract = await contractConfigWithSigner();
    const tx = await contract.setBaseURI(process.env.NEXT_PUBLIC_BASE_URI);
    await tx.wait();
    return tx;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage);
  }
};

export const conGetNftByID = async (id) => {
  try {
    const contract = await contractConfigWithoutSigner();
    return await contract.tokenURI(id);
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage);
  }
};

export const conGetNFTByOwner = async (address) => {
  try {
    const contract = await contractConfigWithoutSigner();
    const tx = await contract.getNFT(address);

    if (!tx || tx.length === 0) return [];

    const fetchNFTInIPFS = tx.map((e) =>
      fetch(
        `${
          process.env.NEXT_PUBLIC_IPFS_GATEWAY
        }${process.env.NEXT_PUBLIC_BASE_URI.slice(7)}${e.toString()}.json`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      ).then((r) => r.json())
    );

    return await Promise.all(fetchNFTInIPFS);
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage);
  }
};
