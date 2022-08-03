//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Treasury {
    using SafeERC20 for IERC20;

    mapping(address => mapping(address => uint256)) public userBalances;

    event Deposit(address sender, address token, uint256 amount);
    event Withdraw(address receiver, address token, uint256 amount);

    function deposit(address token, uint256 amount) public {
        require(amount > 0, "amount must be greater than zero");
        userBalances[msg.sender][token] += amount;
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        emit Deposit(msg.sender, token, amount);
    }

    function withdraw(address token, uint256 amount) public {
        require(amount > 0, "amount must be greater than zero");
        require(
            userBalances[msg.sender][token] > amount,
            "insufficient balance"
        );
        userBalances[msg.sender][token] -= amount;
        IERC20(token).transfer(msg.sender, amount);
        emit Withdraw(msg.sender, token, amount);
    }
}
