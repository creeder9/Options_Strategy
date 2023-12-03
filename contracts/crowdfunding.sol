// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    address public owner;
    uint256 public fundingGoal;
    uint256 public totalContributed;
    uint256 public constant returnPercentage = 25;
    mapping(address => uint256) public contributions;
    address[] private contributors;

    // Make the constructor payable
    constructor() payable {
        owner = msg.sender;
        fundingGoal = 4 ether;  // Your funding goal
        
        // Ensure the contract is deployed with enough Ether to cover 25% returns
        require(msg.value == fundingGoal * returnPercentage / 100, "Insufficient initial funding");
    }

    function contribute() public payable {
        require(totalContributed < fundingGoal, "Funding goal reached");
        if (contributions[msg.sender] == 0) {
            contributors.push(msg.sender);
        }
        contributions[msg.sender] += msg.value;
        totalContributed += msg.value;
    }

    function distributeReturns() public {
        require(msg.sender == owner, "Only owner can distribute returns");
        require(totalContributed >= fundingGoal, "Funding goal not reached");
        require(address(this).balance >= totalContributed * (100 + returnPercentage) / 100, "Insufficient funds for returns");

        for (uint256 i = 0; i < contributors.length; i++) {
            address contributor = contributors[i];
            uint256 contributedAmount = contributions[contributor];
            uint256 returnAmount = contributedAmount * (100 + returnPercentage) / 100;
            payable(contributor).transfer(returnAmount);
        }

        // Reset contract state
        totalContributed = 0;
        delete contributors;
    }

    // Additional functions...
}