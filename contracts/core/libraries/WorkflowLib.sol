// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library WorkflowLib {
    struct WorkflowData {
        string name;
        string[] steps;
        uint256 createdAt;
        uint256 lastExecuted;
        bool isActive;
        uint256 riskScore;
        uint256 sustainabilityScore;
    }

    function validateSteps(string[] memory steps) internal pure returns (bool) {
        return steps.length > 0 && steps.length <= 10; // Max 10 steps
    }

    function calculateSustainability(string[] memory steps) internal pure returns (uint256) {
        uint256 score = 100;
        for (uint i = 0; i < steps.length; i++) {
            if (keccak256(bytes(steps[i])) == keccak256("HighGas")) score -= 20;
            if (keccak256(bytes(steps[i])) == keccak256("GreenToken")) score += 10;
        }
        return score < 0 ? 0 : score;
    }
}