// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract GMTKNFT is ERC721 {
    uint256 private _nextTokenId;
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("Gamatika", "GMTK") {
        _nextTokenId = 0;
    }

    function mintNFT(address to_, string memory tokenURI_) public {
        uint256 tokenId = _nextTokenId;
        _safeMint(to_, tokenId);
        _setTokenURI(tokenId, tokenURI_);
        _nextTokenId = tokenId + 1;
    }

    function _setTokenURI(
        uint256 tokenId,
        string memory _tokenURI
    ) internal virtual {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return _tokenURIs[tokenId];
    }

    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
