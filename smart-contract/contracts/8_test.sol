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
    }

    IERC20 public stakingToken;
    IERC20 public rewardToken; // Token used as reward
    uint256 public rewardRate = 1000; // Reward rate per staked token per second (adjust as needed)
    uint256 public constant SECONDS_IN_DAY = 86400;
    address public owner;

    uint256 public mockTime; // Mock timestamp

    mapping(address => Stake[]) public stakes;
    mapping(address => uint256) public totalStaked;

    event Staked(address indexed user, uint256 amount, uint256 duration);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);

    constructor(IERC20 _stakingToken, IERC20 _rewardToken) {
        stakingToken = _stakingToken;
        rewardToken = _rewardToken;
        mockTime = block.timestamp; // Initialize mockTime
    }

    // Function to set mock timestamp
    function setMockTime(uint256 _mockTime) external {
        mockTime = _mockTime;
    }

    function getCurrentTime() public view returns (uint256) {
        return mockTime;
    }

    function stake(uint256 amount, uint256 durationDays) external nonReentrant {
        console.log("fly_amount", amount);
        console.log("fly_durationDays", durationDays);
        require(durationDays == 10 || durationDays == 20 || durationDays == 30 || durationDays == 40, "Invalid duration");
        require(amount > 0, "Cannot stake zero tokens");

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
        stakes[msg.sender].push(Stake({
            amount: amount,
            startTime: getCurrentTime(),
            duration: durationSeconds,
            apr: apr,
            active: true
        }));
        totalStaked[msg.sender] += amount;

        stakingToken.safeTransferFrom(msg.sender, address(this), amount);

        emit Staked(msg.sender, amount, durationDays);
    }

    function unstake(uint256 index) external nonReentrant {
        console.log("fly_index", index);
        require(index < stakes[msg.sender].length, "Invalid index");

        Stake storage stakeData = stakes[msg.sender][index];
        require(stakeData.active, "Stake already withdrawn");

        uint256 amount = stakeData.amount;
        console.log("fly_stakeAmount", amount);
        uint256 rewardAmount = calculateReward(msg.sender, index);
        console.log("fly_rewardAmount", rewardAmount);
        stakeData.active = false;
        totalStaked[msg.sender] -= amount;

        stakingToken.safeTransfer(msg.sender, amount);
        rewardToken.safeTransfer(msg.sender, rewardAmount);

        emit Unstaked(msg.sender, amount);
        emit RewardClaimed(msg.sender, rewardAmount);
    }

    function calculateReward(address user, uint256 index) public view returns (uint256) {
        Stake memory stakeData = stakes[user][index];
        uint256 stakingDuration = getCurrentTime() - stakeData.startTime;
        uint256 rewardAmount = (stakeData.amount * stakeData.apr * stakingDuration) / (365 days * 100);
        return rewardAmount;
    }

    function claimRewards(uint256 index) external nonReentrant {
        uint256 rewardAmount = calculateReward(msg.sender, index);
        stakes[msg.sender][index].startTime = getCurrentTime();
        rewardToken.safeTransfer(msg.sender, rewardAmount);

        emit RewardClaimed(msg.sender, rewardAmount);
    }

    function totalStakes(address user) external view returns (uint256) {
        return stakes[user].length;
    }

    function withdrawTokens(IERC20 _token, address to, uint256 amount) external {
        require(owner == msg.sender, "Not owner");
        uint256 balance = _token.balanceOf(address(this));
        require(balance >= amount, "Insufficient fund");
        _token.transfer(to, amount);
    }
}
