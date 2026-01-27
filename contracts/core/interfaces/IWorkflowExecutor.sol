// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IWorkflowExecutor {
    function executeWorkflow(uint256 workflowId) external returns (bool);
    function getExecutionStatus(uint256 workflowId) external view returns (bool, string memory);
    function registerExecutor(address executor) external;
}