// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../core/interfaces/IC0mradCore.sol";

contract RiskEngine is Ownable {
    IC0mradCore public core;
    mapping(uint256 => uint256) public workflowRiskScores;

    event RiskAssessed(uint256 workflowId, uint256 riskScore);

    constructor(address _coreAddress) Ownable() {
        core = IC0mradCore(_coreAddress);
    }

    function assessRisk(uint256 workflowId) external onlyOwner {
        IC0mradCore.Workflow memory wf = core.workflows(workflowId); // Changed from getWorkflow to workflows
        require(wf.isActive, "Workflow inactive");

        uint256 risk = _calculateRisk(wf);
        workflowRiskScores[workflowId] = risk;

        emit RiskAssessed(workflowId, risk);
    }

    function _calculateRisk(IC0mradCore.Workflow memory wf) internal pure returns (uint256) {
        uint256 risk = 0;

        for (uint256 i = 0; i < wf.steps.length; i++) {
            bytes32 step = keccak256(bytes(wf.steps[i]));

            if (step == keccak256("FlashLoan")) risk += 30;
            if (step == keccak256("Leverage")) risk += 25;
            if (step == keccak256("HighGas")) risk += 15;
        }

        return risk > 100 ? 100 : risk;
    }

    function getRiskScore(uint256 workflowId) external view returns (uint256) {
        return workflowRiskScores[workflowId];
    }

    function updateCoreAddress(address _newCoreAddress) external onlyOwner {
        core = IC0mradCore(_newCoreAddress);
    }
}