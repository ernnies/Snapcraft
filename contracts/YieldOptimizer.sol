// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IUniswapV2Router {
    function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts);
}

contract YieldOptimizer {
    address public uniswapRouter = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    function autoRebalance(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external {
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        IUniswapV2Router(uniswapRouter).swapExactTokensForTokens(
            amountIn, 0, path, msg.sender, block.timestamp + 300
        );
    }
}