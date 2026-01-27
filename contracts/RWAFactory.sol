// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract RWAFactory is ERC721URIStorage {
    uint256 public tokenId;
    mapping(uint256 => string) public assetMetadata;

    constructor() ERC721("C0mrad RWA", "CRWA") {}

    function tokenizeAsset(
        address to,
        string memory metadataURI,
        string memory assetType
    ) external returns (uint256) {
        uint256 newId = ++tokenId;
        _safeMint(to, newId);
        _setTokenURI(newId, metadataURI);
        assetMetadata[newId] = assetType;
        return newId;
    }
}