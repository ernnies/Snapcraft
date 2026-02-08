// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ProjectAccessControl is AccessControl {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
    }

    /// @notice Checks if caller has operator role
    modifier onlyOperator() {
        require(hasRole(OPERATOR_ROLE, msg.sender), "Caller is not an operator");
        _;
    }
}
