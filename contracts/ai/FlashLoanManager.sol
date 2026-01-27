// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../core/interfaces/IC0mradCore.sol";

contract FlashLoanManager is ReentrancyGuard, Ownable {
    IC0mradCore public core;
    address public lender; // Mock lender address (e.g., Aave)
    mapping(uint256 => bool) public approvedLoans;

    event FlashLoanExecuted(uint256 workflowId, uint256 amount, address token);

    constructor(address _coreAddress, address _lender) Ownable() {
        core = IC0mradCore(_coreAddress);
        lender = _lender;
    }

    function requestFlashLoan(
        uint256 workflowId, 
        uint256 amount, 
        address token
    ) 
        external 
        nonReentrant 
        onlyOwner 
    {
        IC0mradCore.Workflow memory wf = core.workflows(workflowId);
        require(wf.isActive, "Workflow inactive");
        require(_isViableLoan(workflowId, amount, token), "Loan not viable");

        approvedLoans[workflowId] = true;

        _executeFlashLoan(amount, token);

        emit FlashLoanExecuted(workflowId, amount, token);
    }

    function _isViableLoan(
        uint256 workflowId, 
        uint256 amount, 
        address token
    ) 
        internal 
        view 
        returns (bool) 
    {
        IC0mradCore.Workflow memory wf = core.workflows(workflowId);
        return wf.riskScore < 50 && amount > 0;
    }

    function _executeFlashLoan(uint256 amount, address token) internal {
        // TODO: Aave v3 call + callback pattern
        // Placeholder: integrate with 0G compute check + lending protocol
    }

    function updateLender(address _newLender) external onlyOwner {
        lender = _newLender;
    }

    function getLoanStatus(uint256 workflowId) external view returns (bool) {
        return approvedLoans[workflowId];
    }
}
