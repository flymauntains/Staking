// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract StakingContract is ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 duration; // in seconds
        uint256 apr; // Annual Percentage Rate (in percentage)
        bool active;
        bool claimed; // Flag to check if reward is claimed
    }

    IERC20 public stakingToken;
    IERC20 public rewardToken; // Token used as reward
    uint256 public constant SECONDS_IN_DAY = 86400;

    mapping(address => mapping(uint256 => Stake)) public stakes; // user address => durationDays => Stake
    mapping(address => uint256) public totalStaked;
    mapping(address => mapping(uint256 => uint256)) public userStakesByDuration; // user address => duration => staked amount
    mapping(uint256 => uint256) public totalStakedPerDuration; // duration => total staked amount

    event Staked(address indexed user, uint256 amount, uint256 duration);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);

    constructor(IERC20 _stakingToken, IERC20 _rewardToken) {
        stakingToken = _stakingToken;
        rewardToken = _rewardToken;
    }

    function getCurrentTime() public view returns (uint256) {
        return block.timestamp;
    }

    function stake(uint256 amount, uint256 durationDays) external nonReentrant {
        console.log("fly_amount", amount);
        console.log("fly_durationDays", durationDays);
        require(durationDays == 10 || durationDays == 20 || durationDays == 30 || durationDays == 40, "Invalid duration");
        require(amount > 0, "Cannot stake zero tokens");
        require(stakes[msg.sender][durationDays].amount == 0, "Stake already exists for this duration");

        uint256 apr;
        if (durationDays == 10) {
            apr = 10;
        } else if (durationDays == 20) {
            apr = 20;
        } else if (durationDays == 30) {
            apr = 30;
        } else if (durationDays == 40) {
            apr = 40;
        }

        uint256 durationSeconds = durationDays * SECONDS_IN_DAY;
        stakes[msg.sender][durationDays] = Stake({
            amount: amount,
            startTime: getCurrentTime(),
            duration: durationSeconds,
            apr: apr,
            active: true,
            claimed: false
        });
        totalStaked[msg.sender] += amount;
        totalStakedPerDuration[durationDays] += amount;
        userStakesByDuration[msg.sender][durationDays] += amount;

        stakingToken.safeTransferFrom(msg.sender, address(this), amount);

        emit Staked(msg.sender, amount, durationDays);
    }

    function unstake(uint256 amount, uint256 durationDays) external nonReentrant {
        console.log("fly_amount", amount);
        console.log("fly_durationDays", durationDays);
        require(durationDays == 10 || durationDays == 20 || durationDays == 30 || durationDays == 40, "Invalid duration");

        Stake storage stakeData = stakes[msg.sender][durationDays];
        require(stakeData.amount == amount, "Invalid amount");
        require(stakeData.active, "Stake already withdrawn");
        require(getCurrentTime() >= stakeData.startTime + stakeData.duration, "Stake is still locked");

        uint256 rewardAmount = calculateReward(msg.sender, amount, durationDays);
        console.log("fly_rewardAmount", rewardAmount);
        stakeData.active = false;
        totalStaked[msg.sender] -= amount;
        totalStakedPerDuration[durationDays] -= amount;
        userStakesByDuration[msg.sender][durationDays] -= amount;

        stakingToken.safeTransfer(msg.sender, amount);
        rewardToken.safeTransfer(msg.sender, rewardAmount);

        emit Unstaked(msg.sender, amount);
        emit RewardClaimed(msg.sender, rewardAmount);
    }

    function calculateReward(address user, uint256 amount, uint256 durationDays) public view returns (uint256) {
        Stake memory stakeData = stakes[user][durationDays];
        require(stakeData.amount == amount, "Invalid amount");
        uint256 stakingDuration = getCurrentTime() - stakeData.startTime;
        uint256 rewardAmount = (stakeData.amount * stakeData.apr * stakingDuration) / (365 days * 100);
        return rewardAmount;
    }

    function claimRewards(uint256 amount, uint256 durationDays) external nonReentrant {
        console.log("fly_amount", amount);
        console.log("fly_durationDays", durationDays);
        require(durationDays == 10 || durationDays == 20 || durationDays == 30 || durationDays == 40, "Invalid duration");

        Stake storage stakeData = stakes[msg.sender][durationDays];
        require(stakeData.amount == amount, "Invalid amount");
        require(stakeData.active, "Stake not active");
        require(!stakeData.claimed, "Already claimed");

        uint256 rewardAmount = calculateReward(msg.sender, amount, durationDays);
        stakeData.startTime = getCurrentTime();
        stakeData.claimed = true;
        rewardToken.safeTransfer(msg.sender, rewardAmount);

        emit RewardClaimed(msg.sender, rewardAmount);
    }

    function totalStakes(address user) external view returns (uint256) {
        uint256 count = 0;
        if (stakes[user][10].amount > 0) count++;
        if (stakes[user][20].amount > 0) count++;
        if (stakes[user][30].amount > 0) count++;
        if (stakes[user][40].amount > 0) count++;
        return count;
    }

    // Function to get remaining staked tokens for a user
    function getRemainingStakedTokens(address user) external view returns (uint256) {
        return totalStaked[user];
    }

    // Function to get total staked tokens according to duration days
    function getTotalStakedByDuration(uint256 durationDays) external view returns (uint256) {
        require(durationDays == 10 || durationDays == 20 || durationDays == 30 || durationDays == 40, "Invalid duration");
        return totalStakedPerDuration[durationDays];
    }

    // Function to get staked tokens for a user according to duration days
    function getUserStakedByDuration(address user, uint256 durationDays) external view returns (uint256) {
        require(durationDays == 10 || durationDays == 20 || durationDays == 30 || durationDays == 40, "Invalid duration");
        return userStakesByDuration[user][durationDays];
    }

    // Function to get the balance of the staking token for the connected wallet
    function getStakingTokenBalance(address user) external view returns (uint256) {
        return stakingToken.balanceOf(user);
    }

    // Function to get the balance of the reward token for the connected wallet
    function getRewardTokenBalance(address user) external view returns (uint256) {
        return rewardToken.balanceOf(user);
    }
}
