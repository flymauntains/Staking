// SPDX-License-Identifier: MIT 

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StakingFly is ERC20 {
    address public owner;

    constructor(address initialOwner) ERC20("StakingFly", "FLY") {
        _mint(initialOwner, 1000000 * 10 ** decimals());
        owner = initialOwner;
    }

    function mintTokens(address account, uint256 amount) external {
        require(msg.sender == owner, "Only the owner can mint tokens");
        _mint(account, amount);
    }
    
}
     