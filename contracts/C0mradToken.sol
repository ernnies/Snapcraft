// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract C0mradToken is ERC20, ERC20Permit, ERC20Votes {
    constructor()
        ERC20("C0mrad", "CMR")
        ERC20Permit("C0mrad")
    {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    // ✅ OZ v4 uses the transfer hook, not `_update`
    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    // ✅ Required override for minting
    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    // ✅ Required override for burning
    function _burn(address from, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(from, amount);
    }
}
