// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IC0mradCore {
    struct Workflow {
        address owner;
        string name;
        string[] steps;
        uint256 createdAt;
        uint256 lastExecuted;
        bool isActive;
        uint256 riskScore;
        uint256 sustainabilityScore;
    }

    function workflows(uint256 id) external view returns (Workflow memory);
    function workflowCount() external view returns (uint256);
    function userWorkflows(address user) external view returns (uint256[] memory);
    function createWorkflow(string memory name, string[] memory steps) external returns (uint256);
    function executeWorkflow(uint256 id) external;
    function initialize() external;
}