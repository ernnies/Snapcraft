// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/IGovernor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "./core/interfaces/IC0mradCore.sol";

contract C0mradDAO is 
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    IC0mradCore
{
    mapping(uint256 => IC0mradCore.Workflow) private _workflows;
    uint256 private _workflowCount;
    mapping(address => uint256[]) private _userWorkflows;

    event WorkflowCreated(uint256 indexed workflowId, string name, address owner);

    constructor(IVotes _token)
        Governor("C0mradDAO")
        GovernorSettings(1, 45818, 0)
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4)
    {}

    /* ========== C0MRAD CORE GETTERS ========== */

    function workflows(uint256 id) 
        public 
        view 
        override 
        returns (IC0mradCore.Workflow memory) 
    {
        return _workflows[id];
    }

    function workflowCount() 
        public 
        view 
        override 
        returns (uint256) 
    {
        return _workflowCount;
    }

    function userWorkflows(address user) 
        public 
        view 
        override 
        returns (uint256[] memory) 
    {
        return _userWorkflows[user];
    }

    /* ========== PROPOSAL LOGIC ========== */

    function proposeTemplate(
        string memory name,
        string[] memory steps
    ) public returns (uint256) 
    {
        string memory description = string(
            abi.encodePacked("Proposal: Add workflow -> ", name)
        );

        // Properly declare proposal arrays
        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);

        targets[0] = address(this);
        values[0] = 0;
        calldatas[0] = abi.encodeWithSignature(
            "createWorkflow(string,string[])",
            name,
            steps
        );

        return propose(targets, values, calldatas, description);
    }

    function createWorkflow(
        string memory name,
        string[] memory steps
    ) external override onlyGovernance returns (uint256) 
    {
        _workflowCount++;
        _workflows[_workflowCount] = IC0mradCore.Workflow({
            owner: msg.sender,
            name: name,
            steps: steps,
            createdAt: block.timestamp,
            lastExecuted: 0,
            isActive: true,
            riskScore: 0,
            sustainabilityScore: 0
        });

        _userWorkflows[msg.sender].push(_workflowCount);

        emit WorkflowCreated(_workflowCount, name, msg.sender);
        return _workflowCount;
    }

    function executeWorkflow(uint256 id) external override {
        require(id > 0 && id <= _workflowCount, "Invalid workflow ID");
        require(_workflows[id].isActive, "Inactive workflow");
        require(_workflows[id].owner == msg.sender, "Not workflow owner");

        _workflows[id].lastExecuted = block.timestamp;
    }

    function initialize() external override {}

    /* ========== REQUIRED GOVERNOR OVERRIDES (OZ v5) ========== */

    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function votingDelay()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function state(uint256 proposalId)
        public
        view
        override(Governor)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    )
        internal
        override(Governor)
    {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    )
        internal
        override(Governor)
        returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(Governor)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}