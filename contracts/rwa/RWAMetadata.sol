// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract RWAMetadata {
    struct AssetMetadata {
        string name;
        string description;
        uint256 value;
        string uri;
    }

    mapping(uint256 => AssetMetadata) public assets;
    uint256 public assetCount;

    event MetadataUpdated(uint256 indexed assetId, string uri);

    /// @notice Adds new RWA metadata
    /// @param name Name of the asset
    /// @param description Description of the asset
    /// @param value Value of the asset
    /// @param uri Off-chain metadata URI
    function addMetadata(string memory name, string memory description, uint256 value, string memory uri) external {
        assets[assetCount] = AssetMetadata(name, description, value, uri);
        emit MetadataUpdated(assetCount, uri);
        assetCount++;
    }
}