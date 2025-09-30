// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GMTKNFT is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId;
    string private _baseURIIPFS;

    mapping(address owner => uint256[] tokenIDs) internal ownerNFT;
    mapping(address => uint256) private _tokenCount;
    mapping(address => mapping(uint256 => uint256)) private _tokenIndex;

    constructor(
        address initialOwner
    ) ERC721("Gamatika", "GMTK") Ownable(initialOwner) {
        _nextTokenId = 1;
    }

    function setBaseURI(string memory newBaseURI) public onlyOwner {
        _baseURIIPFS = newBaseURI;
    }

    function mintNFT(address to_) public onlyOwner {
        uint256 tokenId = _nextTokenId;
        _safeMint(to_, tokenId);

        ownerNFT[to_].push(tokenId);
        _tokenIndex[to_][tokenId] = _tokenCount[to_];
        _tokenCount[to_]++;

        _nextTokenId = tokenId + 1;
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        require(
            ownerOf(tokenId) == from,
            "ERC721: transfer from incorrect owner"
        );
        require(to != address(0), "ERC721: invalid receiver");

        if (msg.sender != from) {
            require(
                getApproved(tokenId) == msg.sender ||
                    isApprovedForAll(from, msg.sender),
                "ERC721: caller is not owner nor approved"
            );
        }

        _update(to, tokenId, msg.sender);

        _removeToken(from, tokenId);

        ownerNFT[to].push(tokenId);
        _tokenIndex[to][tokenId] = _tokenCount[to];
        _tokenCount[to]++;
    }

    function _removeToken(address owner, uint256 tokenId) internal {
        require(_exists(tokenId), "Token does not exist");

        uint256 index = _tokenIndex[owner][tokenId];
        require(index < _tokenCount[owner], "Token not found in owner's list");

        if (index == _tokenCount[owner] - 1) {
            ownerNFT[owner].pop();
        } else {
            uint256 lastToken = ownerNFT[owner][_tokenCount[owner] - 1];
            ownerNFT[owner][index] = lastToken;
            _tokenIndex[owner][lastToken] = index;
            ownerNFT[owner].pop();
        }

        delete _tokenIndex[owner][tokenId];
        _tokenCount[owner]--;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721: URI query for nonexistent token");

        return
            string(abi.encodePacked(_baseURIIPFS, tokenId.toString(), ".json"));
    }

    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    function getNFT(address owner_) public view returns (uint256[] memory) {
        return ownerNFT[owner_];
    }

    function getAllNFTs() public view returns (uint256) {
        return _nextTokenId - 1;
    }
}
