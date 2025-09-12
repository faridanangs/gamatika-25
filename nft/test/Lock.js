const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('GMTKNFT', function () {
  let ScientistNFT;
  let scientistNFT;
  let owner;
  let addr1;
  let addr2;
  let tokenURI1 = 'https://example.com/token1.json';
  let tokenURI2 = 'https://example.com/token2.json';

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    ScientistNFT = await ethers.getContractFactory('GMTKNFT');
    scientistNFT = await ScientistNFT.deploy();
  });

  describe('Deployment', function () {
    it('Should set the correct name and symbol', async function () {
      expect(await scientistNFT.name()).to.equal('Gamatika');
      expect(await scientistNFT.symbol()).to.equal('GMTK');
    });
  });

  describe('Minting', function () {
    it('Should mint a new NFT and assign it to the owner', async function () {
      await scientistNFT.mintNFT(owner.address, tokenURI1);
      expect(await scientistNFT.balanceOf(owner.address)).to.equal(1);
      expect(await scientistNFT.ownerOf(0)).to.equal(owner.address);
      expect(await scientistNFT.tokenURI(0)).to.equal(tokenURI1);
    });

    it('Should mint multiple NFTs with different token IDs', async function () {
      await scientistNFT.mintNFT(owner.address, tokenURI1);
      await scientistNFT.mintNFT(addr1.address, tokenURI2);

      expect(await scientistNFT.balanceOf(owner.address)).to.equal(1);
      expect(await scientistNFT.balanceOf(addr1.address)).to.equal(1);
      expect(await scientistNFT.ownerOf(0)).to.equal(owner.address);
      expect(await scientistNFT.ownerOf(1)).to.equal(addr1.address);
      expect(await scientistNFT.tokenURI(0)).to.equal(tokenURI1);
      expect(await scientistNFT.tokenURI(1)).to.equal(tokenURI2);
    });

    it('Should fail to set token URI for non-existent token', async function () {
      await expect(scientistNFT.tokenURI(0)).to.be.revertedWith(
        'ERC721Metadata: URI query for nonexistent token'
      );
    });
  });

  describe('Transfers', function () {
    beforeEach(async function () {
      await scientistNFT.mintNFT(owner.address, tokenURI1);
    });

    it('Should transfer NFT from owner to another address', async function () {
      await scientistNFT.transferFrom(owner.address, addr1.address, 0);
      expect(await scientistNFT.ownerOf(0)).to.equal(addr1.address);
      expect(await scientistNFT.balanceOf(owner.address)).to.equal(0);
      expect(await scientistNFT.balanceOf(addr1.address)).to.equal(1);
    });

    it('Should fail to transfer NFT when not owner', async function () {
      await expect(
        scientistNFT
          .connect(addr1)
          .transferFrom(owner.address, addr2.address, 0)
      ).to.be.revertedWithCustomError(
        scientistNFT,
        'ERC721InsufficientApproval'
      );
    });

    it('Should allow approved address to transfer NFT', async function () {
      await scientistNFT.approve(addr1.address, 0);
      await scientistNFT
        .connect(addr1)
        .transferFrom(owner.address, addr2.address, 0);
      expect(await scientistNFT.ownerOf(0)).to.equal(addr2.address);
    });
  });

  describe('Approvals', function () {
    beforeEach(async function () {
      await scientistNFT.mintNFT(owner.address, tokenURI1);
    });

    it('Should set approval for an address', async function () {
      await scientistNFT.approve(addr1.address, 0);
      expect(await scientistNFT.getApproved(0)).to.equal(addr1.address);
    });

    it('Should set approval for all', async function () {
      await scientistNFT.setApprovalForAll(addr1.address, true);
      expect(
        await scientistNFT.isApprovedForAll(owner.address, addr1.address)
      ).to.equal(true);
    });

    it('Should allow approved address to transfer NFT', async function () {
      await scientistNFT.approve(addr1.address, 0);
      await scientistNFT
        .connect(addr1)
        .transferFrom(owner.address, addr2.address, 0);
      expect(await scientistNFT.ownerOf(0)).to.equal(addr2.address);
    });
  });
});
