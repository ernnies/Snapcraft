// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ReentrancyGuard {
    uint256 private _status; // 1 = not entered, 2 = entered
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}