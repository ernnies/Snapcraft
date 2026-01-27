// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IC0mradDAO {
    /// @notice Emitted when a proposal is created
    event ProposalCreated(uint256 proposalId, address proposer, string description);

    /// @notice Emitted when a vote is cast
    event VoteCast(uint256 proposalId, address voter, bool support, uint256 votes);

    /// @notice Creates a new governance proposal
    /// @param description Description of the proposal
    /// @return proposalId ID of the created proposal
    function createProposal(string memory description) external returns (uint256 proposalId);

    /// @notice Casts a vote on a proposal
    /// @param proposalId ID of the proposal to vote on
    /// @param support True for yes, false for no
    function castVote(uint256 proposalId, bool support) external;

    /// @notice Executes a proposal if it has passed
    /// @param proposalId ID of the proposal to execute
    function executeProposal(uint256 proposalId) external;

    /// @notice Gets the voting power of an address
    /// @param account Address to check
    /// @return Voting power in tokens
    function getVotes(address account) external view returns (uint256);
}