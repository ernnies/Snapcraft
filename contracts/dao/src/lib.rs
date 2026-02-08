// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IInsurance {
    /// @notice Emitted when a user adds a contribution
    event ContributionAdded(address indexed user, uint256 amount);

    /// @notice Emitted when a claim is processed
    event ClaimProcessed(address indexed user, uint256 amount);

    /// @notice Adds a contribution to the insurance pool
    /// @param amount Amount of tokens to contribute
    function addContribution(uint256 amount) external;

    /// @notice Processes a claim from the pool
    /// @param amount Amount to claim
    function processClaim(uint256 amount) external;
}