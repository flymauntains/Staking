import { useEffect, useState } from "react";
import StakingContractABI from "../assets/abi/stakingContract.json";
import tokenStakingContractABI from "../assets/abi/tokenStakingContract.json";
import chibaTokenContractABI from "../assets/abi/chibaTokenContract.json";
import { useAccount } from "wagmi";
import { multicall, fetchBalance } from "@wagmi/core";
import { global } from "../config/global";
import { formatUnits } from "viem";
import StakingContract from "../assets/abi/staking.json";
import flyTokenContractABI from "../assets/abi/flyToken.json";

export function useStakingContractStatus(refresh) {
  const [data, setData] = useState({
    walletBalance: 0, // Amount of connected account's CHIBA tokens
    totalEthRewarded_14: 0, // Sum of totalRewards
    totalStakedAmount_14: 0, // totalSharesDeposited of contract
    stakedAmountPerUser_14: 0, // staked amount per user
    stakedTimePerUser_14: 0, // staked time per user
    unClaimed_14: 0, // getUnpaid of stakingcontract_14
    tokenRewarded_14: 0, // RewardOf read function of TokenStakingPool contract
    totalEthRewarded_28: 0, // Sum of totalRewards
    totalStakedAmount_28: 0, // totalSharesDeposited of contract
    stakedAmountPerUser_28: 0, // staked amount per user
    stakedTimePerUser_28: 0, // staked time per user
    unClaimed_28: 0, // getUnpaid of stakingcontract_28
    tokenRewarded_28: 0, // RewardOf read function of TokenStakingPool contract
    totalEthRewarded_56: 0, // Sum of totalRewards
    totalStakedAmount_56: 0, // totalSharesDeposited of contract
    stakedAmountPerUser_56: 0, // staked amount per user
    stakedTimePerUser_56: 0, // staked time per user
    unClaimed_56: 0, // getUnpaid of stakingcontract_56
    tokenRewarded_56: 0, // RewardOf read function of TokenStakingPool contract
    ethBalance: 0,
    allowance1: 0,
    allowance: 0,

    totalStakedByDuration: 0,
    tokenBalance: 0,
    totalStaked: 0,
    userStakedByDuration_10: 0,
    userStakedByDuration_20: 0,
    userStakedByDuration_30: 0,
    userStakedByDuration_40: 0,
    totalStakedPerDuration_10: 0,
    totalStakedPerDuration_20: 0,
    totalStakedPerDuration_30: 0,
    totalStakedPerDuration_40: 0,
    stakeStartTime_10: 0,
    stakeStartTime_20: 0,
    stakeStartTime_30: 0,
    stakeStartTime_40: 0,
  });
  const { address } = useAccount();

  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const timerID = setInterval(() => {
      setRefetch((prevData) => {
        return !prevData;
      });
    }, global.REFETCH_INTERVAL);

    return () => {
      clearInterval(timerID);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chibaTokenContractAddress = global.CHIBA_TOKEN.address;
        const flyTokenContractAddress =
          "0x424705ca44ffBb4eF45d4bE15EFA1344dd24C219";
        const stakingContractAddress = global.FlySTAKING_CONTRACTS;
        const tokenStakingContractAddress = global.STAKING_EXTENSION_CONTRACTS;

        const contracts = [
          //   get the balance of user wallet's ChiBa token
          {
            address: chibaTokenContractAddress,
            abi: chibaTokenContractABI,
            functionName: "balanceOf",
            args: [address],
          },
          // For 14 days pool
          {
            address: stakingContractAddress,
            abi: StakingContractABI,
            functionName: "pools",
            args: [0],
          },
          {
            address: stakingContractAddress,
            abi: StakingContractABI,
            functionName: "shares",
            args: [address, 0],
          },
          {
            address: stakingContractAddress,
            abi: StakingContractABI,
            functionName: "getUnpaid",
            args: [0, address],
          },
          {
            address: tokenStakingContractAddress,
            abi: tokenStakingContractABI,
            functionName: "rewardOf",
            args: [0, address],
          },
          //   For 28 days pool
          {
            address: stakingContractAddress,
            abi: StakingContractABI,
            functionName: "pools",
            args: [1],
          },
          {
            address: stakingContractAddress,
            abi: StakingContractABI,
            functionName: "shares",
            args: [address, 1],
          },
          {
            address: stakingContractAddress,
            abi: StakingContractABI,
            functionName: "getUnpaid",
            args: [1, address],
          },
          {
            address: tokenStakingContractAddress,
            abi: tokenStakingContractABI,
            functionName: "rewardOf",
            args: [1, address],
          },
          //   For 56 days pool
          {
            address: stakingContractAddress,
            abi: StakingContractABI,
            functionName: "pools",
            args: [2],
          },
          {
            address: stakingContractAddress,
            abi: StakingContractABI,
            functionName: "shares",
            args: [address, 2],
          },
          {
            address: stakingContractAddress,
            abi: StakingContractABI,
            functionName: "getUnpaid",
            args: [2, address],
          },
          {
            address: tokenStakingContractAddress,
            abi: tokenStakingContractABI,
            functionName: "rewardOf",
            args: [2, address],
          },
          //   {
          //     address: flyTokenContractAddress,
          //     abi: flyTokenContractABI,
          //     functionName: "allowance",
          //     args: [address, stakingContractAddress],
          //   },
          {
            address: chibaTokenContractAddress, /// reason
            abi: chibaTokenContractABI,
            functionName: "allowance",
            args: [address, stakingContractAddress],
          },
        ];

        const requests = [
          {
            address: global.FlySTAKING_CONTRACTS,
            abi: StakingContract,
            functionName: "getTotalStakedByDuration", // getTotalStakedByDuration
            args: [20],
          },
          {
            address: global.FlySTAKING_CONTRACTS,
            abi: StakingContract,
            functionName: "getStakingTokenBalance", // getStakingTokenBalance
            args: [address],
          },
          {
            address: global.FlySTAKING_CONTRACTS,
            abi: StakingContract,
            functionName: "totalStaked",
            args: [address], // totalStaked
          },
          {
            address: global.FlySTAKING_CONTRACTS,
            abi: StakingContract,
            functionName: "getUserStakedByDuration",
            args: [address, 10],
          },
          {
            address: global.FlySTAKING_CONTRACTS,
            abi: StakingContract,
            functionName: "getUserStakedByDuration",
            args: [address, 20],
          },
          {
            address: global.FlySTAKING_CONTRACTS,
            abi: StakingContract,
            functionName: "getUserStakedByDuration",
            args: [address, 30],
          },
          {
            address: global.FlySTAKING_CONTRACTS,
            abi: StakingContract,
            functionName: "getUserStakedByDuration",
            args: [address, 40],
          },
          {
            address: global.FlySTAKING_CONTRACTS,
            abi: StakingContract,
            functionName: "totalStakedPerDuration",
            args: [10],
          },
          {
            address: global.FlySTAKING_CONTRACTS,
            abi: StakingContract,
            functionName: "totalStakedPerDuration",
            args: [20],
          },
          {
            address: global.FlySTAKING_CONTRACTS,
            abi: StakingContract,
            functionName: "totalStakedPerDuration",
            args: [30],
          },
          {
            address: global.FlySTAKING_CONTRACTS,
            abi: StakingContract,
            functionName: "totalStakedPerDuration",
            args: [40],
          },
          {
            address: flyTokenContractAddress,
            abi: flyTokenContractABI,
            functionName: "allowance",
            args: [address, stakingContractAddress],
          },
          {
            address: global.FlySTAKING_CONTRACTS,
            abi: StakingContract,
            functionName: "getCurrentTime",
          },
          {
            address: global.FlySTAKING_CONTRACTS,
            abi: StakingContract,
            functionName: "getStakeStartTime",
            args: [address, 10]
          },
          {
            address: global.FlySTAKING_CONTRACTS,
            abi: StakingContract,
            functionName: "getStakeStartTime",
            args: [address, 20]
          },
          {
            address: global.FlySTAKING_CONTRACTS,
            abi: StakingContract,
            functionName: "getStakeStartTime",
            args: [address, 30]
          },
          {
            address: global.FlySTAKING_CONTRACTS,
            abi: StakingContract,
            functionName: "getStakeStartTime",
            args: [address, 40]
          },

          // {
          //   address: global.FlySTAKING_CONTRACTS,
          //   abi: StakingContract,
          //   functionName: "calculateReward",
          //   args: [address, totalStakedPerDuration_10, "10"]
          // },
        ];
        const receiveData = await multicall({ contracts: requests });
        console.log("fly_receiveData", receiveData);
        const _data = await multicall({
          chainId: global.chain.id,
          contracts,
        });

        const ethBalance = address
          ? parseFloat((await fetchBalance({ address })).formatted)
          : 0;

        console.log(_data, "data is:");
        setData({
          totalStakedByDuration:
            receiveData[0].status === "success"
              ? parseFloat(
                  formatUnits(receiveData[0].result, global.EthDecimals)
                )
              : 0,
          tokenBalance:
            receiveData[1].status === "success"
              ? parseFloat(
                  formatUnits(receiveData[1].result, global.EthDecimals)
                )
              : 0,
          totalStaked:
            receiveData[2].status === "success"
              ? parseFloat(
                  formatUnits(receiveData[2].result, global.EthDecimals)
                )
              : 0,
          userStakedByDuration_10:
            receiveData[3].status === "success"
              ? parseFloat(
                  formatUnits(receiveData[3].result, global.EthDecimals)
                )
              : 0,
          userStakedByDuration_20:
            receiveData[4].status === "success"
              ? parseFloat(
                  formatUnits(receiveData[4].result, global.EthDecimals)
                )
              : 0,
          userStakedByDuration_30:
            receiveData[5].status === "success"
              ? parseFloat(
                  formatUnits(receiveData[5].result, global.EthDecimals)
                )
              : 0,
          userStakedByDuration_40:
            receiveData[6].status === "success"
              ? parseFloat(
                  formatUnits(receiveData[6].result, global.EthDecimals)
                )
              : 0,
          totalStakedPerDuration_10:
            receiveData[7].status === "success"
              ? parseFloat(
                  formatUnits(receiveData[7].result, global.EthDecimals)
                )
              : 0,
          totalStakedPerDuration_20:
            receiveData[8].status === "success"
              ? parseFloat(
                  formatUnits(receiveData[8].result, global.EthDecimals)
                )
              : 0,
          totalStakedPerDuration_30:
            receiveData[9].status === "success"
              ? parseFloat(
                  formatUnits(receiveData[9].result, global.EthDecimals)
                )
              : 0,
          totalStakedPerDuration_40:
            receiveData[10].status === "success"
              ? parseFloat(
                  formatUnits(receiveData[10].result, global.EthDecimals)
                )
              : 0,
          allowance1:
            receiveData[11].status === "success"
              ? parseFloat(
                  formatUnits(receiveData[11].result, global.EthDecimals)
                )
              : 0,
          getCurrentTime:
            receiveData[12].status === "success" ? receiveData[11].result : 0,
            stakeStartTime_10:
            receiveData[13].status === "success"
              ? (
                  Number(receiveData[13].result)
                )
              : 0,
              stakeStartTime_20:
            receiveData[14].status === "success"
              ? (
                  Number(receiveData[14].result)
                )
              : 0,
              stakeStartTime_30:
            receiveData[15].status === "success"
              ? (
                  Number(receiveData[15].result)
                )
              : 0,
              stakeStartTime_40:
            receiveData[16].status === "success"
              ? (
                  Number(receiveData[16].result)
                )
              : 0,
          // tokenRewarded_10:
          // receiveData[13].status === "success"
          //     ? parseFloat(
          //         formatUnits(receiveData[13].result, global.EthDecimals)
          //       )
          //     : 0,
          
          
          
          
          
          
          
          
          
          
          
          
          
          
            walletBalance:
            _data[0].status === "success"
              ? parseFloat(
                  formatUnits(_data[0].result, global.CHIBA_TOKEN.decimals)
                ).toFixed(2)
              : 0,
          // For 14 days pool
          totalEthRewarded_14:
            _data[1].status === "success"
              ? parseFloat(
                  formatUnits(_data[1].result[6], global.EthDecimals)
                ).toFixed(5)
              : 0,
          totalStakedAmount_14:
            _data[1].status === "success"
              ? parseFloat(
                  formatUnits(_data[1].result[3], global.CHIBA_TOKEN.decimals)
                ).toFixed(2)
              : 0,
          stakedAmountPerUser_14:
            _data[2].status === "success"
              ? parseFloat(
                  formatUnits(_data[2].result[0], global.CHIBA_TOKEN.decimals)
                )
              : 0,
          stakedTimePerUser_14:
            _data[2].status === "success" ? Number(_data[2].result[1]) : 0,
          unClaimed_14:
            _data[3].status === "success"
              ? parseFloat(
                  formatUnits(_data[3].result, global.EthDecimals)
                ).toFixed(10)
              : 0,
          //   tokenRewarded_14:
          //     _data[4].status === "success"
          //       ? parseFloat(
          //           formatUnits(_data[4].result, global.CHIBA_TOKEN.decimals)
          //         ).toFixed(5)
          //       : 0,
          // For 28 days pool
          totalEthRewarded_28:
            _data[5].status === "success"
              ? parseFloat(
                  formatUnits(_data[5].result[6], global.EthDecimals)
                ).toFixed(5)
              : 0,
          totalStakedAmount_28:
            _data[5].status === "success"
              ? parseFloat(
                  formatUnits(_data[5].result[3], global.CHIBA_TOKEN.decimals)
                ).toFixed(2)
              : 0,
          stakedAmountPerUser_28:
            _data[6].status === "success"
              ? parseFloat(
                  formatUnits(_data[6].result[0], global.CHIBA_TOKEN.decimals)
                )
              : 0,
          stakedTimePerUser_28:
            _data[6].status === "success" ? Number(_data[6].result[1]) : 0,
          unClaimed_28:
            _data[7].status === "success"
              ? parseFloat(
                  formatUnits(_data[7].result, global.EthDecimals)
                ).toFixed(10)
              : 0,
          tokenRewarded_28:
            _data[8].status === "success"
              ? parseFloat(
                  formatUnits(_data[8].result, global.CHIBA_TOKEN.decimals)
                ).toFixed(5)
              : 0,
          // For 56 days pool
          totalEthRewarded_56:
            _data[9].status === "success"
              ? parseFloat(
                  formatUnits(_data[9].result[6], global.EthDecimals)
                ).toFixed(5)
              : 0,
          totalStakedAmount_56:
            _data[9].status === "success"
              ? parseFloat(
                  formatUnits(_data[9].result[3], global.CHIBA_TOKEN.decimals)
                ).toFixed(2)
              : 0,
          stakedAmountPerUser_56:
            _data[10].status === "success"
              ? parseFloat(
                  formatUnits(_data[10].result[0], global.CHIBA_TOKEN.decimals)
                )
              : 0,
          stakedTimePerUser_56:
            _data[10].status === "success" ? Number(_data[10].result[1]) : 0,
          unClaimed_56:
            _data[11].status === "success"
              ? parseFloat(
                  formatUnits(_data[11].result, global.EthDecimals)
                ).toFixed(10)
              : 0,
          tokenRewarded_56:
            _data[12].status === "success"
              ? parseFloat(
                  formatUnits(_data[12].result, global.CHIBA_TOKEN.decimals)
                ).toFixed(5)
              : 0,
          allowance:
            _data[13].status === "success"
              ? parseFloat(
                  formatUnits(_data[13].result, global.CHIBA_TOKEN.decimals)
                ).toFixed(2)
              : 0,
          ethBalance: ethBalance,
        });
      } catch (error) {
        console.log("useStakingContractStatus err", error);
      }
    };
    fetchData();
  }, [address, refetch, refresh]);

  return data;
}
