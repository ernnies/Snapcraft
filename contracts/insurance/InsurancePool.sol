// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IInsurance.sol";

contract InsurancePool is ReentrancyGuard, IInsurance {
    uint256 public totalPool;
    mapping(address => uint256) public userContributions;
    IERC20 public premiumToken;

    constructor(address _premiumToken) {
        premiumToken = IERC20(_premiumToken);
    }

    /// @notice Adds contribution to the insurance pool
    /// @param amount Amount of tokens to contribute
    function addContribution(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(premiumToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        userContributions[msg.sender] += amount;
        totalPool += amount;

        emit ContributionAdded(msg.sender, amount);
    }

    /// @notice Processes a claim from the pool
    /// @param amount Amount to claim
    function processClaim(uint256 amount) external nonReentrant {
        require(userContributions[msg.sender] >= amount, "Insufficient contribution");
        require(totalPool >= amount, "Insufficient pool funds");

        userContributions[msg.sender] -= amount;
        totalPool -= amount;

        require(premiumToken.transfer(msg.sender, amount), "Claim transfer failed");

        emit ClaimProcessed(msg.sender, amount);
    }
}
