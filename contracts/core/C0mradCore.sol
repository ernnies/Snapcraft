// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract C0mradCore is Initializable, UUPSUpgradeable, AccessControlUpgradeable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");

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

    mapping(uint256 => Workflow) public workflows;
    mapping(address => uint256[]) public userWorkflows;
    uint256 public workflowCount;

    event WorkflowCreated(uint256 id, address owner, string name);
    event WorkflowExecuted(uint256 id, uint256 timestamp);

    function initialize() public initializer {
        __UUPSUpgradeable_init();
        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function createWorkflow(string memory name, string[] memory steps) external returns (uint256) {
        uint256 id = ++workflowCount;
        workflows[id] = Workflow({
            owner: msg.sender,
            name: name,
            steps: steps,
            createdAt: block.timestamp,
            lastExecuted: 0,
            isActive: true,
            riskScore: _calculateRisk(steps),
            sustainabilityScore: _calculateSustainability(steps)
        });
        userWorkflows[msg.sender].push(id);
        emit WorkflowCreated(id, msg.sender, name);
        return id;
    }

    function executeWorkflow(uint256 id) external onlyRole(EXECUTOR_ROLE) {
        require(workflows[id].isActive, "Inactive workflow");
        workflows[id].lastExecuted = block.timestamp;
        emit WorkflowExecuted(id, block.timestamp);
    }

    function _calculateRisk(string[] memory steps) internal pure returns (uint256) {
        uint256 risk = 0;
        for (uint i = 0; i < steps.length; i++) {
            if (keccak256(bytes(steps[i])) == keccak256("FlashLoan")) risk += 30;
            if (keccak256(bytes(steps[i])) == keccak256("Leverage")) risk += 25;
        }
        return risk > 100 ? 100 : risk;
    }

    function _calculateSustainability(string[] memory steps) internal pure returns (uint256) {
        uint256 score = 100;
        for (uint i = 0; i < steps.length; i++) {
            if (keccak256(bytes(steps[i])) == keccak256("HighGas")) score -= 20;
        }
        return score < 0 ? 0 : score;
    }

    function _authorizeUpgrade(address) internal override onlyRole(ADMIN_ROLE) {}
}