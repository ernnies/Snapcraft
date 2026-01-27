// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockUniswapRouter {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts) {
        require(amountIn > 0, "Amount in must be greater than 0");
        require(amountOutMin > 0, "Amount out min must be greater than 0");
        require(path.length >= 2, "Invalid path");
        require(to != address(0), "Invalid to address");
        require(block.timestamp <= deadline, "Deadline exceeded");

        // Mock swap logic: assume 1:1 exchange rate for simplicity
        amounts = new uint256[](path.length);
        amounts[0] = amountIn;
        amounts[1] = amountIn; // Simplified 1:1 swap
        require(IERC20(path[0]).transferFrom(msg.sender, address(this), amountIn), "Transfer failed");
        require(IERC20(path[1]).transfer(to, amountIn), "Transfer failed");
        return amounts;
    }
}