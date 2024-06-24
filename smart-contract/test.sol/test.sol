// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract StakingContract is ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 duration;
        uint256 apr;
        bool active;
    }

    IERC20 public skakingToken;
    IERC20 public rewardToken;
    uint256 public constant SECONDS_IN_DAY = 86400;
    uint256 public mockTime;
    address public owner;

    mapping (address => Stake[]) public stakes;
    mapping (address => uint256) public totalStaked;
    mapping (address => mapping (uint256 => uint256)) public userStakedByDuration;
    mapping (address => uint256) public totalStakedByDuration;

    event Staked(address indexed user, uint256 amount, uint256 duration);
    event Unstaked(address indexed user, uint256 amount);
    event RewardCliamed(address indexed user, uint256 amount);

    constructor(IERC20 _stakingToken, IERC20 _rewardToken) {
        skakingToken = _stakingToken;
        rewardToken = _rewardToken;
        mockTime = block.timestamp;
    }

    function setMockTime(uint256 _mockTime) external {
        require(owner == msg.sender, "Not owner");
        mockTime = _mockTime;
    }

    function getCurrentTime() public view returns(uint256) {
        return mockTime;
    }

    function stake(uint256 amount, uint256 durationDays) external nonReentrant {
        require(durationDays == 10 || durationDays == 20 || durationDays == 30 || durationDays == 40, "Invalid duration");;
        require(amount > 0, "Cannot stake zero tokens");

        uint256 apr;
        if(durationDays == 10) {
            apr = 10;
        } else if (durationDays == 20) {
            apr = 20;
        } else if (durationDays == 30) {
            apr = 30;
        } else  if (durationDays == 40) {
            apr = 40;
        }

        uint256 durationSeconds = durationDays * SECONDS_IN_DAY;
        stakes[msg.sender].push(Stake({
            amount: amount;
            startTime: startTime;
            duration : durationSeconds;
            apr: apr;
            active: true;
        }))

        totalStaked[msg.sender] += amount;
        totalStakedByDuration[durationDays] += amount;
        userStakedByDuration[msg.sender][durationDays] += amount;
        stakingToken.safeTransferFrom(msg.sender, adderss(this), amount);
        emit Staked(msg.sender, amount, durationDays);
    }

}

function Stake(uint256 amount, uint256 durationDays) external nonReentrant {
    require(durationDays);
    require(amount > 0);
    uint256 apr;
    if (){apr =10}else if(){}
    uint256 durationSeconds = durationDays * SECONDS_IN_DAY;
    stakes[msg.sender].push(Stake({
        amount: amount;
        startTime: startTime;
        duration: durationSeconds;
        apr: apr;
        active: true;
    }))

    totalStaked[msg.sender] += amount;
    userStakedByDuration[msg.sender][durationDays] += amount;
    totalStakedPerDuration[durationDays] += amount;

    totalStakedByDuration
}



contract Staking is ReentrantGurad {
    using SafeERC20 for IERC20;

    struct Stake {
        uint256 amount;
        uint256 duration;
        uint256 apr;
        uint256 startTime;
        bool active;
    }

    IERC20 public stakingToken;
    IERC20 public rewardToken;
    uint256 public constant SECONDS_IN_DAYS = 86400;

    mapping (address => Stake[]) public stakes;
    mapping (address => uint256) public totalStaked;
    mapping (address => mapping (uint256 => uint256)) public userStakedByDuration;
    mapping (uint256 => uint256) public totalStakedByDuration;

    event Stake(address indexed  user, uint256 amount, uint256 duration);
    event Unstake(address indexed  user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);

    constructor(IERC20 _stakingToken, IERC20 _rewardToken) {
        stakingToken = _stakingToken;
        rewardToken = _rewardToken;
    }
}

function stake(uint256 amount, uint256 durationDays) external nonReentrant {
    require(durationDays == 10);
    require(amount > 0);
    uint256 durationSecnonds = durationDays * SECONDS_IN_DAY;
    uint256 apr;
    if (durationDays = 10){
        apr = 10
    } else if () {}
    stakes[msg.sender].push(Stake({
        amount: amount;
        duration: 
        startTime:
        apr:
        active
    }))
    totalStaked[msg.sender] += amount;
    totalStakedByDuration[durationDays] += amount;
    userStakesByDuration[msg.sender][durationDays] += amount;

    stakingToken.safeTrans
}


contract Staking is ReentrancyGurad {
    using SafeERC20 for IERC20

    struct Stake {
        uint256 amount;
        uint256 startTime,
        uint256 duration,
        uint256 apr;
        bool active;
    }

    IERC20 public stakingToken;
    IERC20 public rewardToken;
    uint256 public  constant SECONDS_IN_DAY = 86400;

    mapping (address => uint256) public totalStaked;
    mapping (address => Stake[]) public stakes;
    mapping (address => mapping (uint256 => uint256)) public userStakesByDuration;
    mapping (uint256 => uint256) public totalStakedPerDuration;

    event Staked(address indexed  user, uint256 amount, uint256 duration);
    event Unstaked(address indexed  user, uint256 amount);
    event RewardCliamed(address indexed user, uint256 amount);

    constructor(IERC20 _stakingToken, IERC20 _rewardToken) {
        stakingToken = _stakingToken;
        rewardToken = _rewardToken;
    }

    function stake(uint256 amount, uint256 DurationDays) external  nonReentrant{
        require(durationDays);
        require(amount > 0);
        uint256 apr;
        if (durationDays == 10) {
            apr = 10;
        } else if (duratoinDays == 20) {
            apr = 20;
        }
        durationSeconds = durtaionDays * SECONDS_IN_DAY;
        stakes[msg.sender].push(Stake({
            amount: amount;
            duration: durationSeconds;
            apr: apr;
            startTime: startTime;
            active: true
        }))
        totalStaked[msg.sender] += amount;
        userStakesByDuration[msg.sender] += amount;
    }

    function unstake(uint256 amount) external nonReentrant {
        require(index < stakes[msg.sender].length, "Invalid index");
        Stake storage stakeData = stakes[msg.sender][index];
        require(stakeData.active, "Stake already withdrawn");
        require(getCurrentTime() >= stakeData.startTime + stakeData.duration, "Stake is still locked");

        uint256 amount = stakeData.amount;
        uint256 rewardAmount = calculateReward(msg.sender, index);
        
    }
}