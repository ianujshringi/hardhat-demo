// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {
    string public name = "My Token";
    string public symbol = "MT";
    uint256 public totalSupply = 1000;

    address public owner;

    mapping(address => uint256) balances;

    constructor() {
        owner = msg.sender;
        balances[owner] = totalSupply;
    }

    function transfer(address to, uint256 amount) external {
        console.log("->Sender balance is %s tokens", balances[msg.sender]);
        console.log("->Sender is sending %s tokens to %s address", amount, to);

        require(balances[msg.sender] >= amount, "Not Enough Tokens!");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function checkBalance(address account) external view returns (uint256) {
        return balances[account];
    }
}
