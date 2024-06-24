// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TimeManipulation {
    uint256 private _currentTime;

    constructor() {
        _currentTime = block.timestamp;
    }

    function currentTime() public view returns (uint256) {
        return _currentTime;
    }

    function setCurrentTime(uint256 timestamp) external {
        _currentTime = timestamp;
    }
}