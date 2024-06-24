import "./index.css";
import React, { useState, useEffect, useRef } from "react";
import { useStakingContractStatus } from "../hooks/useStakingContractStatus";
import StakeBtn from "../components/StakeBtn";
import LockRemain from "../components/LockRemain";
import { ConnectWallet } from "../components/ConnectWallet";
import ethIco from "../assets/img/eth.png";
import chibaIco from "../assets/img/chiba.png";
import giftIco from "../assets/img/gift.png";
import { global } from "../config/global";
import { useAccount } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import CommandBtnList from "../components/CommandBtnList";
import MobileCommandBtnList from "../components/MobileCommandBtnList";
import { useContractRead } from "wagmi";
import StakingContract from "../assets/abi/staking.json";
import { readContract, multicall } from "@wagmi/core";

export default function StakingPage() {
  const { address } = useAccount();
  const [refresh, setRefresh] = useState(false);

  const [showButtonList_10, setShowButtonList_10] = useState(false);
  const [showButtonList_20, setshowButtonList_20] = useState(false);
  const [showButtonList_30, setShowButtonList_30] = useState(false);
  const [showButtonList_40, setShowButtonList_40] = useState(false);

  const [stakedPercent_10, setStakedPercent_10] = useState(0);
  const [stakedPercent_20, setStakedPercent_20] = useState(0);
  const [stakedPercent_30, setstakedPercent_30] = useState(0);
  const [stakedPercent_40, setstakedPercent_40] = useState(0);

  const [compoundPending, setCompoundPending] = useState(false);
  const [claimEthPending, setClaimEthPending] = useState(false);
  const [claimChibaPending, setClaimChibaPending] = useState(false);
  const [unstakePending, setUnstakePending] = useState(false);

  const [walletConnected, setWalletConnected] = useState(false);
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


  const {
    // Fly add
    totalStakedByDuration,
    tokenBalance,
    totalStaked,
    userStakedByDuration_10,
    userStakedByDuration_20,
    userStakedByDuration_30,
    userStakedByDuration_40,
    totalStakedPerDuration_10,
    totalStakedPerDuration_20,
    totalStakedPerDuration_30,
    totalStakedPerDuration_40,
    stakeStartTime_10,
    stakeStartTime_20,
    stakeStartTime_30,
    stakeStartTime_40,

    walletBalance, // Amount of connected account's CHIBA tokens
    // For 14 days pool
    totalEthRewarded_14, // totalRewards
    totalStakedAmount_10, // totalSharesDeposited of contract, total staked chiba amount
    stakedAmountPerUser_14, // staked amount per user
    stakedTimePerUser_14, // staked time per user
    unClaimed_14,
    tokenRewarded_14, // Earned FLY token amount
    // For 28 days pool
    totalEthRewarded_28, // totalRewards
    totalStakedAmount_28, // totalSharesDeposited of contract, total staked chiba amount
    stakedAmountPerUser_28, // staked amount per user
    stakedTimePerUser_28, // staked time per user
    unClaimed_28,
    tokenRewarded_28, // Earned FLY token amount
    // For 56 days pool
    totalEthRewarded_56, // totalRewards
    totalStakedAmount_56, // totalSharesDeposited of contract, total staked chiba amount
    stakedAmountPerUser_56, // staked amount per user
    stakedTimePerUser_56, // staked time per user
    unClaimed_56,
    tokenRewarded_56, // Earned FLY token amount
    allowance1,
    allowance,
    ethBalance,
  } = useStakingContractStatus(refresh);

  const wrapperRef = useRef(null);
  const EthDecimals = global.EthDecimals;
  const IUniswapV2Router01Address = global.IUniswapV2Router01Address;
  const addresses = [global.WethContractAddress, global.CHIBA_TOKEN.address];

  const [tokenRewarded_10, settokenRewarded_10] = useState(null);
  const [tokenRewarded_20, settokenRewarded_20] = useState(null);
  const [tokenRewarded_30, settokenRewarded_30] = useState(null);
  const [tokenRewarded_40, settokenRewarded_40] = useState(null);

  useEffect(() => {
    async function fetchtokenRewardDates() {
      try {
        // if(totalStakedPerDuration_10 !== 0 ) {
        const tokenRewarded_10 = await readContract({
          address: global.FlySTAKING_CONTRACTS,
          abi: StakingContract,
          functionName: "calculateReward",
          args: [
            address,
            totalStakedPerDuration_10 * 10 ** global.EthDecimals,
            "10",
          ],
        });
        // }
        // if(totalStakedPerDuration_10 !== 0  && totalStakedPerDuration_20 !== 0 ){
        const tokenRewarded_20 = await readContract({
          address: global.FlySTAKING_CONTRACTS,
          abi: StakingContract,
          functionName: "calculateReward",
          args: [
            address,
            totalStakedPerDuration_20 * 10 ** global.EthDecimals,
            "20",
          ],
        });
        // }
        const tokenRewarded_30 = await readContract({
          address: global.FlySTAKING_CONTRACTS,
          abi: StakingContract,
          functionName: "calculateReward",
          args: [
            address,
            totalStakedPerDuration_30 * 10 ** global.EthDecimals,
            "30",
          ],
        });
        const tokenRewarded_40 = await readContract({
          address: global.FlySTAKING_CONTRACTS,
          abi: StakingContract,
          functionName: "calculateReward",
          args: [
            address,
            totalStakedPerDuration_40 * 10 ** global.EthDecimals,
            "40",
          ],
        });

        settokenRewarded_10(tokenRewarded_10);
        settokenRewarded_20(tokenRewarded_20);
        settokenRewarded_30(tokenRewarded_30);
        settokenRewarded_40(tokenRewarded_40);
      } catch (error) {
        console.error("Error fetching tokenReward Dates:", error);
      }
    }

    fetchtokenRewardDates();
  }, [
    address,
    tokenBalance,
    // tokenRewarded_10,
    // tokenRewarded_20,
    // tokenRewarded_30,
    // tokenRewarded_40,
  ]);
  const tokenRewardedN_10 = tokenRewarded_10
    ? parseFloat(formatUnits(tokenRewarded_10, global.EthDecimals)).toFixed(2)
    : 0;
  const tokenRewardedN_20 = tokenRewarded_20
    ? parseFloat(formatUnits(tokenRewarded_20, global.EthDecimals)).toFixed(2)
    : 0;
  const tokenRewardedN_30 = tokenRewarded_30
    ? parseFloat(formatUnits(tokenRewarded_30, global.EthDecimals)).toFixed(2)
    : 0;
  const tokenRewardedN_40 = tokenRewarded_40
    ? parseFloat(formatUnits(tokenRewarded_40, global.EthDecimals)).toFixed(2)
    : 0;
   const totalTokenRewarded = tokenRewardedN_10 + tokenRewardedN_20 + tokenRewardedN_30 + tokenRewardedN_40 ;
  // const totalEthRewarded = Number(
  //   parseFloat(totalEthRewarded_14) +
  //     parseFloat(totalEthRewarded_28) +
  //     parseFloat(totalEthRewarded_56)
  // ).toFixed(5);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (userStakedByDuration_10 !== 0 && totalStakedPerDuration_10 !== 0)
      setStakedPercent_10(
        parseFloat(
          (Number(userStakedByDuration_10) * 100) /
            Number(totalStakedPerDuration_10)
        ).toFixed(2)
      );
    else if (userStakedByDuration_10 === 0) setStakedPercent_10(0);
    if (userStakedByDuration_20 !== 0 && totalStakedPerDuration_20 !== 0)
      setStakedPercent_20(
        parseFloat(
          (Number(userStakedByDuration_20) * 100) /
            Number(totalStakedPerDuration_20)
        ).toFixed(2)
      );
    else if (userStakedByDuration_20 === 0) setStakedPercent_20(0);
    if (userStakedByDuration_30 && totalStakedPerDuration_30 !== 0)
      setstakedPercent_30(
        parseFloat(
          (Number(userStakedByDuration_30) * 100) /
            Number(totalStakedPerDuration_30)
        ).toFixed(2)
      );
    else if (userStakedByDuration_30 === 0) setstakedPercent_30(0);
    if (userStakedByDuration_40 && totalStakedPerDuration_40 !== 0)
      setstakedPercent_40(
        parseFloat(
          (Number(userStakedByDuration_40) * 100) /
            Number(totalStakedPerDuration_40)
        ).toFixed(2)
      );
    else if (userStakedByDuration_40 === 0) setstakedPercent_40(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userStakedByDuration_10,
    userStakedByDuration_20,
    userStakedByDuration_30,
    userStakedByDuration_40,
  ]);

  const handleClickOutside = (event) => {
    try {
      if (
        wrapperRef &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setShowButtonList_10(false);
        setshowButtonList_20(false);
        setShowButtonList_30(false);
        setShowButtonList_40(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div className="flex md:flex-row flex-col items-start w-full min-h-screen relative font">
        <div className="flex flex-col h-full w-full md:max-w-266 max-w-none bg-violet md:py-8 py-4 px-4 items-center md:fixed relative">
          {address !== undefined && (
            <div className="block lg:hidden md:hidden sm:hidden flex flex-row justify-start w-full items-center gap-1 lg:flex mt-6">
              <img src={chibaIco} alt="" className="h-18 w-20" />
              <div className="flex flex-col">
                <h1 className="text-sm text-white text-opacity-75">
                  FLY Balance11 {/* FLY Balance{tokenBalance} */}
                </h1>
                {/* <h2 className="text-base font-bold">{walletBalance} FLY</h2> */}
                <h2 className="text-base font-bold">{tokenBalance} FLYq</h2>
              </div>
            </div>
          )}
          <div className="md:hidden flex justify-start font-medium text-center text-white text-sm rounded connect-button font-16 h-full mt-6 w-full">
            <ConnectWallet
              setWalletConnected={(val) => {
                if (val === undefined) setWalletConnected(false);
                else setWalletConnected(val);
              }}
              compoundPending={compoundPending}
              claimEthPending={claimEthPending}
              claimChibaPending={claimChibaPending}
              unstakePending={unstakePending}
            />
          </div>
          <div className="bg-reward rounded-xl w-full flex flex-col items-start py-4 px-2.5 gap-2.5 mt-5">
            <div className="flex items-center gap-3">
              <img src={ethIco} alt="" className="h-8 w-auto" />
              <h1 className="text-lg font-bold">Token Rewards</h1>
            </div>
            <p className="text-sm text-white text-opacity-75">
              Earn FLY token by staking!
            </p>
            <div className="gap-3 w-full flex items-center">
              <div className="flex flex-col">
                <h1 className="lg:text-lg text-base font-bold">
                  {/* {totalEthRewarded} ETH */}
                  {totalTokenRewarded} FLY
                </h1>
                <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">
                  Total Token Rewarded
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full min-h-screen bg-violet md:ml-[220px] ml-0">
          <div
            className="flex flex-col w-full min-h-screen lg:p-8 p-4 gap-6 sm:gap-10 md:gap-14 bg-cover"
            style={{ backgroundImage: "url('image/background.png')" }}
          >
            <div className="md:flex hidden items-center justify-between h-full">
              <h1 className="text-xxl font-bold">Staking</h1>
              <div className="flex gap-4">
                {address !== undefined && (
                  <div className="flex items-center gap-1 lg:flex">
                    <img src={chibaIco} alt="" className="h-14 w-16" />
                    <div className="flex flex-col">
                      <h1 className="text-sm text-white text-opacity-75">
                        {/* FLY Balance{" "} */}
                      </h1>
                      <h2 className="text-base font-bold">
                        {/* {tokenBalance} FLY111 */}
                        {tokenBalance} FLY
                      </h2>
                    </div>
                  </div>
                )}
                <div className="font-medium text-center text-white text-sm rounded connect-button font-16 h-full">
                  <ConnectWallet
                    setWalletConnected={(val) => {
                      if (val === undefined) setWalletConnected(false);
                      else setWalletConnected(val);
                    }}
                    compoundPending={compoundPending}
                    claimEthPending={claimEthPending}
                    claimChibaPending={claimChibaPending}
                    unstakePending={unstakePending}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full items-start gap-5">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <h1 className="lg:text-xxl text-lg font-bold leading-normal">
                    Pool Size
                  </h1>
                  <p className="lg:text-lg text-sm font-medium">
                    {/* Leverage the power of compounding by staking your FLY
                    tokens and compounding rewards as they accrue. */}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-4 grid-cols-1 md:gap-10 gap-5 w-full">
                <div className="w-full border border-gray-1 border-opacity-30 rounded-xl lg:px-6 px-3 py-5 relative bg-violet-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h1 className="text-base font-bold">10 Days</h1>
                    <h2 className="text-sm font-medium text-white text-opacity-75">
                      10% FLY token Rewards{" "}
                    </h2>
                  </div>
                  <h1 className="text-violet-2">
                    <span className="text-2xl font-bold">10%</span>
                    <span className="ml-2 text-base font-bold">APR</span>
                  </h1>
                  <div className="flex flex-col gap-1.5">
                    <div className="w-full rounded-full bg-violet-3 h-2.5">
                      <div
                        className={`rounded-full h-full flowing-progress`}
                        style={{
                          width: `${stakedPercent_10}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-medium">
                      <h1>
                        {userStakedByDuration_10} FLY/{stakedPercent_10}%{" "}
                      </h1>
                    </div>
                  </div>
                  <div className="font-lg text-center text-white text-sm rounded connect-button w-full">
                    <StakeBtn
                      setRefresh={setRefresh}
                      refresh={refresh}
                      connected={walletConnected}
                      stakeModalOption={10}
                      // amount={walletBalance}
                      amount={tokenBalance}
                      allowance1={allowance1}
                      allowance={allowance}
                      ethBalance={ethBalance}
                      compoundPending={compoundPending}
                      claimEthPending={claimEthPending}
                      claimChibaPending={claimChibaPending}
                      unstakePending={unstakePending}
                    />
                  </div>
                </div>
                <div className="w-full border border-gray-1 border-opacity-30 rounded-xl lg:px-6 px-3 py-5 relative bg-violet-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h1 className="text-base font-bold">20 Days</h1>
                    <h2 className="text-sm font-medium text-white text-opacity-75">
                      20% FLY token Rewards{" "}
                    </h2>
                  </div>
                  <h1 className="text-violet-2">
                    <span className="text-2xl font-bold">20%</span>
                    <span className="ml-2 text-base font-bold">APR</span>
                  </h1>
                  <div className="flex flex-col gap-1.5">
                    <div className="w-full rounded-full bg-violet-3 h-2.5">
                      <div
                        className={`rounded-full h-full flowing-progress`}
                        style={{
                          width: `${stakedPercent_20}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-medium">
                      <h1>
                        {userStakedByDuration_20} FLY/{stakedPercent_20}%{" "}
                      </h1>
                    </div>
                  </div>
                  <div className="font-lg text-center text-white text-sm rounded connect-button w-full">
                    <StakeBtn
                      connected={walletConnected}
                      stakeModalOption={20}
                      // amount={walletBalance}
                      amount={tokenBalance}
                      allowance1={allowance1}
                      allowance={allowance}
                      ethBalance={ethBalance}
                      compoundPending={compoundPending}
                      claimEthPending={claimEthPending}
                      claimChibaPending={claimChibaPending}
                      unstakePending={unstakePending}
                    />
                  </div>
                </div>
                <div className="w-full border border-gray-1 border-opacity-30 rounded-xl lg:px-6 px-3 py-5 relative bg-violet-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h1 className="text-base font-bold">30 Days</h1>
                    <h2 className="text-sm font-medium text-white text-opacity-75">
                      30% FLY token Rewards
                    </h2>
                  </div>
                  <h1 className="text-violet-2">
                    <span className="text-2xl font-bold">30%</span>
                    <span className="ml-2 text-base font-bold">APR</span>
                  </h1>
                  <div className="flex flex-col gap-1.5">
                    <div className="w-full rounded-full bg-violet-3 h-2.5">
                      <div
                        className={`rounded-full h-full flowing-progress`}
                        style={{
                          width: `${stakedPercent_30}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-medium">
                      <h1>
                        {userStakedByDuration_30} FLY/{stakedPercent_30}%{" "}
                      </h1>
                    </div>
                  </div>
                  <div className="font-lg text-center text-white text-sm rounded connect-button w-full">
                    <StakeBtn
                      connected={walletConnected}
                      stakeModalOption={30}
                      // amount={walletBalance}
                      amount={tokenBalance}
                      allowance1={allowance1}
                      allowance={allowance}
                      ethBalance={ethBalance}
                      compoundPending={compoundPending}
                      claimEthPending={claimEthPending}
                      claimChibaPending={claimChibaPending}
                      unstakePending={unstakePending}
                    />
                  </div>
                </div>
                <div className="w-full border border-gray-1 border-opacity-30 rounded-xl lg:px-6 px-3 py-5 relative bg-violet-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h1 className="text-base font-bold">40 Days</h1>
                    <h2 className="text-sm font-medium text-white text-opacity-75">
                      40% FLY token Rewards{" "}
                    </h2>
                  </div>
                  <h1 className="text-violet-2">
                    <span className="text-2xl font-bold">40%</span>
                    <span className="ml-2 text-base font-bold">APR</span>
                  </h1>
                  <div className="flex flex-col gap-1.5">
                    <div className="w-full rounded-full bg-violet-3 h-2.5">
                      <div
                        className={`rounded-full h-full flowing-progress`}
                        style={{
                          width: `${stakedPercent_40}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-medium">
                      <h1>
                        {userStakedByDuration_40} FLY/{stakedPercent_40}%{" "}
                      </h1>
                    </div>
                  </div>
                  <div className="font-lg text-center text-white text-sm rounded connect-button w-full">
                    <StakeBtn
                      connected={walletConnected}
                      stakeModalOption={40}
                      // amount={walletBalance}
                      amount={tokenBalance}
                      allowance1={allowance1}
                      allowance={allowance}
                      ethBalance={ethBalance}
                      compoundPending={compoundPending}
                      claimEthPending={claimEthPending}
                      claimChibaPending={claimChibaPending}
                      unstakePending={unstakePending}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full items-start gap-5">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <h1 className="lg:text-xxl text-lg font-bold leading-normal">
                    My Stakes &amp; Rewards
                  </h1>
                  <p className="lg:text-lg text-sm font-medium"></p>
                </div>
              </div>
              <div className="w-full border border-gray-1 border-opacity-30 rounded-xl lg:px-6 px-3 py-5 relative bg-violet-6 bg-opacity-75 flex flex-col gap-5">
                {userStakedByDuration_10 === 0 &&
                  userStakedByDuration_20 === 0 &&
                  userStakedByDuration_30 === 0 &&
                  userStakedByDuration_40 === 0 && (
                    <div className="flex flex-col items-center justify-center w-full h-full py-6 md:py-10 gap-3">
                      <img
                        src="/image/chiba.png"
                        alt=""
                        className="h-8 md:h-16 w-auto"
                      />
                      <h1 className="text-center text-xl font-medium">
                        Connect your wallet
                      </h1>
                      <div className="font-medium text-center text-white text-sm rounded connect-button">
                        <StakeBtn
                          connected={walletConnected}
                          stakeModalOption={0}
                          // amount={walletBalance}
                          amount={tokenBalance}
                          allowance1={allowance1}
                          allowance={allowance}
                          ethBalance={ethBalance}
                          compoundPending={compoundPending}
                          claimEthPending={claimEthPending}
                          claimChibaPending={claimChibaPending}
                          unstakePending={unstakePending}
                        />
                      </div>
                    </div>
                  )}
                {userStakedByDuration_10 !== 0 && (
                  <div className="flex lg:flex-row flex-col lg:items-center lg:justify-between item-start lg:gap-0 gap-5 lg:p-5 p-3 rounded md:border-0 border border-gray-1 border-opacity-30 relative bg-violet-4">
                    <div className="gap-3 w-full flex items-center">
                      <div className="flex flex-col">
                        <h1 className="lg:text-lg text-base font-bold">
                          10% APR
                        </h1>
                        <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">
                          10 Days Lockup
                        </h2>
                      </div>
                    </div>
                    <div className="gap-3 w-full flex flex-row lg:flex-col items-center lg:items-start">
                      <img
                        src={chibaIco}
                        alt=""
                        className="lg:h-14 lg:w-16 md:h-14 md:w-16 h-10 w-10"
                      />
                      <div className="flex flex-col">
                        <h1 className="lg:text-lg text-base font-bold">
                          {userStakedByDuration_10.toFixed(2)} FLY
                        </h1>
                        <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">
                          Staked
                        </h2>
                      </div>
                    </div>
                    {/* <div className="gap-3 w-full flex flex-row lg:flex-col items-center lg:items-start">
                      <img
                        src={giftIco}
                        alt=""
                        className="lg:h-8 lg:w-8 w-6 h-6"
                      />
                      {/* <div className="flex flex-col">
                        <h1 className="lg:text-lg text-base font-bold">
                          {unClaimed_14} ETH
                        </h1>
                        <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">
                          Unclaimed ETHaa
                        </h2>
                      </div> */}
                    {/* </div> */}
                    <div className="gap-3 w-full flex flex-row lg:flex-col items-center lg:items-start">
                      <img
                        src={chibaIco}
                        alt=""
                        className="lg:h-14 lg:w-16 md:h-14 md:w-16 h-10 w-10"
                      />
                      <div className="flex flex-col">
                        <h1 className="lg:text-lg text-base font-bold">
                          {Number(tokenRewardedN_10)} FLY
                          {/* {tokenRewarded_14} FLYaa */}
                        </h1>
                        <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">
                          Earned FLY
                        </h2>
                      </div>
                    </div>
                    <div className="gap-3 w-full flex items-center">
                      <LockRemain
                        stakedTimePerUser={stakeStartTime_10}
                        type={10}
                      />
                    </div>
                    <div className="lg:block hidden relative">
                      <button
                        className="outline-none"
                        onClick={() => {
                          setshowButtonList_20(false);
                          setShowButtonList_30(false);
                          setShowButtonList_40(false);
                          setShowButtonList_10(!showButtonList_10);
                        }}
                        disabled={
                          compoundPending === true ||
                          claimEthPending === true ||
                          claimChibaPending === true ||
                          unstakePending === true
                            ? true
                            : false
                        }
                      >
                        <svg
                          width="16"
                          height="29"
                          viewBox="0 0 16 29"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.74539 25.4064C5.74539 24.6634 6.04231 23.9509 6.57082 23.4256C7.09933 22.9002 7.81615 22.6051 8.56357 22.6051C9.311 22.6051 10.0278 22.9002 10.5563 23.4256C11.0848 23.9509 11.3818 24.6634 11.3818 25.4064C11.3818 26.1493 11.0848 26.8618 10.5563 27.3872C10.0278 27.9125 9.311 28.2076 8.56357 28.2076C7.81615 28.2076 7.09933 27.9125 6.57082 27.3872C6.04231 26.8618 5.74539 26.1493 5.74539 25.4064ZM5.74539 14.2012C5.74539 13.4583 6.04231 12.7458 6.57082 12.2204C7.09933 11.6951 7.81615 11.4 8.56357 11.4C9.311 11.4 10.0278 11.6951 10.5563 12.2204C11.0848 12.7458 11.3818 13.4583 11.3818 14.2012C11.3818 14.9442 11.0848 15.6567 10.5563 16.182C10.0278 16.7074 9.311 17.0025 8.56357 17.0025C7.81615 17.0025 7.09933 16.7074 6.57082 16.182C6.04231 15.6567 5.74539 14.9442 5.74539 14.2012ZM5.74539 2.99611C5.74539 2.25316 6.04231 1.54064 6.57082 1.0153C7.09933 0.489958 7.81615 0.194824 8.56357 0.194824C9.311 0.194824 10.0278 0.489958 10.5563 1.0153C11.0848 1.54064 11.3818 2.25316 11.3818 2.99611C11.3818 3.73905 11.0848 4.45157 10.5563 4.97691C10.0278 5.50225 9.311 5.79739 8.56357 5.79739C7.81615 5.79739 7.09933 5.50225 6.57082 4.97691C6.04231 4.45157 5.74539 3.73905 5.74539 2.99611Z"
                            fill="white"
                          ></path>
                        </svg>
                      </button>
                      {showButtonList_10 === true && (
                        <CommandBtnList
                          setRefresh={setRefresh}
                          refresh={refresh}
                          wrapperRef={wrapperRef}
                          poolOption={10}
                          userStakedByDuration_10={userStakedByDuration_10}
                          userStakedByDuration_20={userStakedByDuration_20}
                          userStakedByDuration_30={userStakedByDuration_30}
                          userStakedByDuration_40={userStakedByDuration_40}
                          // _minTokensToReceive1={_minTokensToReceive1}
                          // _minTokensToReceive2={_minTokensToReceive2}
                          // _minTokensToReceive3={_minTokensToReceive3}
                          setShowButtonList_10={setShowButtonList_10}
                          setshowButtonList_20={setshowButtonList_20}
                          setShowButtonList_30={setShowButtonList_30}
                          setShowButtonList_40={setShowButtonList_40}
                          tokenRewarded_14={tokenRewarded_14}
                          tokenRewarded_10={tokenRewarded_10}
                          tokenRewarded_28={tokenRewarded_28}
                          tokenRewarded_56={tokenRewarded_56}
                          compoundPending={compoundPending}
                          setCompoundPending={setCompoundPending}
                          claimEthPending={claimEthPending}
                          setClaimEthPending={setClaimEthPending}
                          claimChibaPending={claimChibaPending}
                          setClaimChibaPending={setClaimChibaPending}
                          unstakePending={unstakePending}
                          setUnstakePending={setUnstakePending}
                        />
                      )}
                    </div>
                    <div className="md:hidden relative">
                      <MobileCommandBtnList
                        wrapperRef={wrapperRef}
                        setRefresh={setRefresh}
                        refresh={refresh}
                        poolOption={10}
                        userStakedByDuration_10={userStakedByDuration_10}
                        userStakedByDuration_20={userStakedByDuration_20}
                        userStakedByDuration_30={userStakedByDuration_30}
                        userStakedByDuration_40={userStakedByDuration_40}
                        // _minTokensToReceive1={_minTokensToReceive1}
                        // _minTokensToReceive2={_minTokensToReceive2}
                        // _minTokensToReceive3={_minTokensToReceive3}
                        tokenRewarded_14={tokenRewarded_14}
                        tokenRewarded_28={tokenRewarded_28}
                        tokenRewarded_56={tokenRewarded_56}
                        compoundPending={compoundPending}
                        setCompoundPending={setCompoundPending}
                        claimEthPending={claimEthPending}
                        setClaimEthPending={setClaimEthPending}
                        claimChibaPending={claimChibaPending}
                        setClaimChibaPending={setClaimChibaPending}
                        unstakePending={unstakePending}
                        setUnstakePending={setUnstakePending}
                      />
                    </div>
                  </div>
                )}
                {userStakedByDuration_20 !== 0 && (
                  // <div className="w-full border border-gray-1 border-opacity-30 rounded-xl lg:px-6 px-3 py-5 relative bg-violet-6 bg-opacity-75 flex flex-col gap-5">
                  <div className="flex lg:flex-row flex-col lg:items-center lg:justify-between item-start lg:gap-0 gap-5 lg:p-5 p-3 rounded md:border-0 border border-gray-1 border-opacity-30 relative bg-violet-4">
                    <div className="gap-3 w-full flex items-center">
                      <div className="flex flex-col">
                        <h1 className="lg:text-lg text-base font-bold">
                          20% APR
                        </h1>
                        <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">
                          20 Days Lockup
                        </h2>
                      </div>
                    </div>
                    <div className="gap-3 w-full flex flex-row lg:flex-col items-center lg:items-start">
                      <img
                        src={chibaIco}
                        alt=""
                        className="lg:h-14 lg:w-16 md:h-14 md:w-16 h-10 w-10"
                      />
                      <div className="flex flex-col">
                        <h1 className="lg:text-lg text-base font-bold">
                          {userStakedByDuration_20.toFixed(2)} FLY
                        </h1>
                        <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">
                          Staked
                        </h2>
                      </div>
                    </div>
                    {/* <div className="gap-3 w-full flex flex-row lg:flex-col items-center lg:items-start">
                      <img
                        src={giftIco}
                        alt=""
                        className="lg:h-8 lg:w-8 w-6 h-6"
                      />
                      <div className="flex flex-col">
                        <h1 className="lg:text-lg text-base font-bold">
                          {unClaimed_28} ETH
                        </h1>
                        <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">
                          Unclaimed ETH
                        </h2>
                      </div>
                    </div> */}
                    <div className="gap-3 w-full flex flex-row lg:flex-col items-center lg:items-start">
                      <img
                        src={chibaIco}
                        alt=""
                        className="lg:h-14 lg:w-16 md:h-14 md:w-16 h-10 w-10"
                      />
                      <div className="flex flex-col">
                        <h1 className="lg:text-lg text-base font-bold">
                          {tokenRewardedN_20 ? tokenRewardedN_20 : 0} FLY
                          {/* {tokenRewarded_28} FLY */}
                        </h1>
                        <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">
                          Earned FLY
                        </h2>
                      </div>
                    </div>
                    <div className="gap-3 w-full flex items-center">
                      <LockRemain
                        stakedTimePerUser={stakeStartTime_20}
                        type={20}
                      />
                    </div>
                    <div className="lg:block hidden relative">
                      <button
                        className="outline-none"
                        onClick={() => {
                          setShowButtonList_10(false);
                          setShowButtonList_30(false);
                          setShowButtonList_40(false);
                          setshowButtonList_20(!showButtonList_20);
                        }}
                        disabled={
                          compoundPending === true ||
                          claimEthPending === true ||
                          claimChibaPending === true ||
                          unstakePending === true
                            ? true
                            : false
                        }
                      >
                        <svg
                          width="16"
                          height="29"
                          viewBox="0 0 16 29"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.74539 25.4064C5.74539 24.6634 6.04231 23.9509 6.57082 23.4256C7.09933 22.9002 7.81615 22.6051 8.56357 22.6051C9.311 22.6051 10.0278 22.9002 10.5563 23.4256C11.0848 23.9509 11.3818 24.6634 11.3818 25.4064C11.3818 26.1493 11.0848 26.8618 10.5563 27.3872C10.0278 27.9125 9.311 28.2076 8.56357 28.2076C7.81615 28.2076 7.09933 27.9125 6.57082 27.3872C6.04231 26.8618 5.74539 26.1493 5.74539 25.4064ZM5.74539 14.2012C5.74539 13.4583 6.04231 12.7458 6.57082 12.2204C7.09933 11.6951 7.81615 11.4 8.56357 11.4C9.311 11.4 10.0278 11.6951 10.5563 12.2204C11.0848 12.7458 11.3818 13.4583 11.3818 14.2012C11.3818 14.9442 11.0848 15.6567 10.5563 16.182C10.0278 16.7074 9.311 17.0025 8.56357 17.0025C7.81615 17.0025 7.09933 16.7074 6.57082 16.182C6.04231 15.6567 5.74539 14.9442 5.74539 14.2012ZM5.74539 2.99611C5.74539 2.25316 6.04231 1.54064 6.57082 1.0153C7.09933 0.489958 7.81615 0.194824 8.56357 0.194824C9.311 0.194824 10.0278 0.489958 10.5563 1.0153C11.0848 1.54064 11.3818 2.25316 11.3818 2.99611C11.3818 3.73905 11.0848 4.45157 10.5563 4.97691C10.0278 5.50225 9.311 5.79739 8.56357 5.79739C7.81615 5.79739 7.09933 5.50225 6.57082 4.97691C6.04231 4.45157 5.74539 3.73905 5.74539 2.99611Z"
                            fill="white"
                          ></path>
                        </svg>
                      </button>
                      {showButtonList_20 === true && (
                        <CommandBtnList
                          setRefresh={setRefresh}
                          refresh={refresh}
                          wrapperRef={wrapperRef}
                          poolOption={20}
                          userStakedByDuration_10={userStakedByDuration_10}
                          userStakedByDuration_20={userStakedByDuration_20}
                          userStakedByDuration_30={userStakedByDuration_30}
                          userStakedByDuration_40={userStakedByDuration_40}
                          // _minTokensToReceive1={_minTokensToReceive1}
                          // _minTokensToReceive2={_minTokensToReceive2}
                          // _minTokensToReceive3={_minTokensToReceive3}
                          setShowButtonList_10={setShowButtonList_10}
                          setshowButtonList_20={setshowButtonList_20}
                          setShowButtonList_30={setShowButtonList_30}
                          setShowButtonList_40={setShowButtonList_40}
                          tokenRewarded_14={tokenRewarded_14}
                          tokenRewarded_28={tokenRewarded_28}
                          tokenRewarded_56={tokenRewarded_56}
                          compoundPending={compoundPending}
                          setCompoundPending={setCompoundPending}
                          claimEthPending={claimEthPending}
                          setClaimEthPending={setClaimEthPending}
                          claimChibaPending={claimChibaPending}
                          setClaimChibaPending={setClaimChibaPending}
                          unstakePending={unstakePending}
                          setUnstakePending={setUnstakePending}
                        />
                      )}
                    </div>
                    <div className="md:hidden relative">
                      <MobileCommandBtnList
                        wrapperRef={wrapperRef}
                        setRefresh={setRefresh}
                        refresh={refresh}
                        poolOption={20}
                        userStakedByDuration_10={userStakedByDuration_10}
                        userStakedByDuration_20={userStakedByDuration_20}
                        userStakedByDuration_30={userStakedByDuration_30}
                        userStakedByDuration_40={userStakedByDuration_40}
                        // _minTokensToReceive1={_minTokensToReceive1}
                        // _minTokensToReceive2={_minTokensToReceive2}
                        // _minTokensToReceive3={_minTokensToReceive3}
                        tokenRewarded_14={tokenRewarded_14}
                        tokenRewarded_28={tokenRewarded_28}
                        tokenRewarded_56={tokenRewarded_56}
                        compoundPending={compoundPending}
                        setCompoundPending={setCompoundPending}
                        claimEthPending={claimEthPending}
                        setClaimEthPending={setClaimEthPending}
                        claimChibaPending={claimChibaPending}
                        setClaimChibaPending={setClaimChibaPending}
                        unstakePending={unstakePending}
                        setUnstakePending={setUnstakePending}
                      />
                    </div>
                  </div>
                )}
                {userStakedByDuration_30 !== 0 && (
                  // <div className="w-full border border-gray-1 border-opacity-30 rounded-xl lg:px-6 px-3 py-5 relative bg-violet-6 bg-opacity-75 flex flex-col gap-5">
                  <div className="flex lg:flex-row flex-col lg:items-center lg:justify-between item-start lg:gap-0 gap-5 lg:p-5 p-3 rounded md:border-0 border border-gray-1 border-opacity-30 relative bg-violet-4">
                    <div className="gap-3 w-full flex items-center">
                      <div className="flex flex-col">
                        <h1 className="lg:text-lg text-base font-bold">
                          30% APR
                        </h1>
                        <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">
                          30 Days Lockup
                        </h2>
                      </div>
                    </div>
                    <div className="gap-3 w-full flex flex-row lg:flex-col items-center lg:items-start">
                      <img
                        src={chibaIco}
                        alt=""
                        className="lg:h-14 lg:w-16 md:h-14 md:w-16 h-10 w-10"
                      />
                      <div className="flex flex-col">
                        <h1 className="lg:text-lg text-base font-bold">
                          {userStakedByDuration_30.toFixed(2)} FLY
                        </h1>
                        <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">
                          Staked
                        </h2>
                      </div>
                    </div>
                    {/* <div className="gap-3 w-full flex flex-row lg:flex-col items-center lg:items-start">
                      <img
                        src={giftIco}
                        alt=""
                        className="lg:h-8 lg:w-8 w-6 h-6"
                      />
                      <div className="flex flex-col">
                        <h1 className="lg:text-lg text-base font-bold">
                          {unClaimed_28} ETH
                        </h1>
                        <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">
                          Unclaimed ETH
                        </h2>
                      </div>
                    </div> */}
                    <div className="gap-3 w-full flex flex-row lg:flex-col items-center lg:items-start">
                      <img
                        src={chibaIco}
                        alt=""
                        className="lg:h-14 lg:w-16 md:h-14 md:w-16 h-10 w-10"
                      />
                      <div className="flex flex-col">
                        <h1 className="lg:text-lg text-base font-bold">
                          {tokenRewardedN_30 ? tokenRewardedN_30 : 0} FLY
                          {/* {tokenRewarded_28} FLY */}
                        </h1>
                        <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">
                          Earned FLY
                        </h2>
                      </div>
                    </div>
                    <div className="gap-3 w-full flex items-center">
                      <LockRemain
                        stakedTimePerUser={stakeStartTime_30}
                        type={30}
                      />
                    </div>
                    <div className="lg:block hidden relative">
                      <button
                        className="outline-none"
                        onClick={() => {
                          setShowButtonList_10(false);
                          setshowButtonList_20(false);
                          setShowButtonList_40(false);
                          setShowButtonList_30(!showButtonList_30);
                        }}
                        disabled={
                          compoundPending === true ||
                          claimEthPending === true ||
                          claimChibaPending === true ||
                          unstakePending === true
                            ? true
                            : false
                        }
                      >
                        <svg
                          width="16"
                          height="29"
                          viewBox="0 0 16 29"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.74539 25.4064C5.74539 24.6634 6.04231 23.9509 6.57082 23.4256C7.09933 22.9002 7.81615 22.6051 8.56357 22.6051C9.311 22.6051 10.0278 22.9002 10.5563 23.4256C11.0848 23.9509 11.3818 24.6634 11.3818 25.4064C11.3818 26.1493 11.0848 26.8618 10.5563 27.3872C10.0278 27.9125 9.311 28.2076 8.56357 28.2076C7.81615 28.2076 7.09933 27.9125 6.57082 27.3872C6.04231 26.8618 5.74539 26.1493 5.74539 25.4064ZM5.74539 14.2012C5.74539 13.4583 6.04231 12.7458 6.57082 12.2204C7.09933 11.6951 7.81615 11.4 8.56357 11.4C9.311 11.4 10.0278 11.6951 10.5563 12.2204C11.0848 12.7458 11.3818 13.4583 11.3818 14.2012C11.3818 14.9442 11.0848 15.6567 10.5563 16.182C10.0278 16.7074 9.311 17.0025 8.56357 17.0025C7.81615 17.0025 7.09933 16.7074 6.57082 16.182C6.04231 15.6567 5.74539 14.9442 5.74539 14.2012ZM5.74539 2.99611C5.74539 2.25316 6.04231 1.54064 6.57082 1.0153C7.09933 0.489958 7.81615 0.194824 8.56357 0.194824C9.311 0.194824 10.0278 0.489958 10.5563 1.0153C11.0848 1.54064 11.3818 2.25316 11.3818 2.99611C11.3818 3.73905 11.0848 4.45157 10.5563 4.97691C10.0278 5.50225 9.311 5.79739 8.56357 5.79739C7.81615 5.79739 7.09933 5.50225 6.57082 4.97691C6.04231 4.45157 5.74539 3.73905 5.74539 2.99611Z"
                            fill="white"
                          ></path>
                        </svg>
                      </button>
                      {showButtonList_30 === true && (
                        <CommandBtnList
                          setRefresh={setRefresh}
                          refresh={refresh}
                          wrapperRef={wrapperRef}
                          poolOption={20}
                          userStakedByDuration_10={userStakedByDuration_10}
                          userStakedByDuration_20={userStakedByDuration_20}
                          userStakedByDuration_30={userStakedByDuration_30}
                          userStakedByDuration_40={userStakedByDuration_40}
                          // _minTokensToReceive1={_minTokensToReceive1}
                          // _minTokensToReceive2={_minTokensToReceive2}
                          // _minTokensToReceive3={_minTokensToReceive3}
                          setShowButtonList_10={setShowButtonList_10}
                          setshowButtonList_20={setshowButtonList_20}
                          setShowButtonList_30={setShowButtonList_30}
                          setShowButtonList_40={setShowButtonList_40}
                          tokenRewarded_14={tokenRewarded_14}
                          tokenRewarded_28={tokenRewarded_28}
                          tokenRewarded_56={tokenRewarded_56}
                          compoundPending={compoundPending}
                          setCompoundPending={setCompoundPending}
                          claimEthPending={claimEthPending}
                          setClaimEthPending={setClaimEthPending}
                          claimChibaPending={claimChibaPending}
                          setClaimChibaPending={setClaimChibaPending}
                          unstakePending={unstakePending}
                          setUnstakePending={setUnstakePending}
                        />
                      )}
                    </div>
                    <div className="md:hidden relative">
                      <MobileCommandBtnList
                        wrapperRef={wrapperRef}
                        setRefresh={setRefresh}
                        refresh={refresh}
                        poolOption={20}
                        userStakedByDuration_10={userStakedByDuration_10}
                        userStakedByDuration_20={userStakedByDuration_20}
                        userStakedByDuration_30={userStakedByDuration_30}
                        userStakedByDuration_40={userStakedByDuration_40}
                        // _minTokensToReceive1={_minTokensToReceive1}
                        // _minTokensToReceive2={_minTokensToReceive2}
                        // _minTokensToReceive3={_minTokensToReceive3}
                        tokenRewarded_14={tokenRewarded_14}
                        tokenRewarded_28={tokenRewarded_28}
                        tokenRewarded_56={tokenRewarded_56}
                        compoundPending={compoundPending}
                        setCompoundPending={setCompoundPending}
                        claimEthPending={claimEthPending}
                        setClaimEthPending={setClaimEthPending}
                        claimChibaPending={claimChibaPending}
                        setClaimChibaPending={setClaimChibaPending}
                        unstakePending={unstakePending}
                        setUnstakePending={setUnstakePending}
                      />
                    </div>
                  </div>
                )}
                {userStakedByDuration_40 !== 0 && (
                  // <div className="w-full border border-gray-1 border-opacity-30 rounded-xl lg:px-6 px-3 py-5 relative bg-violet-6 bg-opacity-75 flex flex-col gap-5">
                  <div className="flex lg:flex-row flex-col lg:items-center lg:justify-between item-start lg:gap-0 gap-5 lg:p-5 p-3 rounded md:border-0 border border-gray-1 border-opacity-30 relative bg-violet-4">
                    <div className="gap-3 w-full flex items-center">
                      <div className="flex flex-col">
                        <h1 className="lg:text-lg text-base font-bold">
                          40% APR
                        </h1>
                        <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">
                          40 Days Lockup
                        </h2>
                      </div>
                    </div>
                    <div className="gap-3 w-full flex flex-row lg:flex-col items-center lg:items-start">
                      <img
                        src={chibaIco}
                        alt=""
                        className="lg:h-14 lg:w-16 md:h-14 md:w-16 h-10 w-10"
                      />
                      <div className="flex flex-col">
                        <h1 className="lg:text-lg text-base font-bold">
                          {userStakedByDuration_40.toFixed(2)} FLY
                        </h1>
                        <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">
                          Staked
                        </h2>
                      </div>
                    </div>
                    {/* <div className="gap-3 w-full flex flex-row lg:flex-col items-center lg:items-start">
                      <img
                        src={giftIco}
                        alt=""
                        className="lg:h-8 lg:w-8 w-6 h-6"
                      />
                      <div className="flex flex-col">
                        <h1 className="lg:text-lg text-base font-bold">
                          {unClaimed_28} ETH
                        </h1>
                        <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">
                          Unclaimed ETH
                        </h2>
                      </div>
                    </div> */}
                    <div className="gap-3 w-full flex flex-row lg:flex-col items-center lg:items-start">
                      <img
                        src={chibaIco}
                        alt=""
                        className="lg:h-14 lg:w-16 md:h-14 md:w-16 h-10 w-10"
                      />
                      <div className="flex flex-col">
                        <h1 className="lg:text-lg text-base font-bold">
                          {tokenRewardedN_40 ? tokenRewardedN_40 : 0} FLY
                        </h1>
                        <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">
                          Earned FLY
                        </h2>
                      </div>
                    </div>
                    <div className="gap-3 w-full flex items-center">
                      <LockRemain
                        stakedTimePerUser={stakeStartTime_40}
                        type={40}
                      />
                    </div>
                    <div className="lg:block hidden relative">
                      <button
                        className="outline-none"
                        onClick={() => {
                          setShowButtonList_10(false);
                          setshowButtonList_20(false);
                          setShowButtonList_40(!showButtonList_40);
                          setShowButtonList_30(false);
                        }}
                        disabled={
                          compoundPending === true ||
                          claimEthPending === true ||
                          claimChibaPending === true ||
                          unstakePending === true
                            ? true
                            : false
                        }
                      >
                        <svg
                          width="16"
                          height="29"
                          viewBox="0 0 16 29"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.74539 25.4064C5.74539 24.6634 6.04231 23.9509 6.57082 23.4256C7.09933 22.9002 7.81615 22.6051 8.56357 22.6051C9.311 22.6051 10.0278 22.9002 10.5563 23.4256C11.0848 23.9509 11.3818 24.6634 11.3818 25.4064C11.3818 26.1493 11.0848 26.8618 10.5563 27.3872C10.0278 27.9125 9.311 28.2076 8.56357 28.2076C7.81615 28.2076 7.09933 27.9125 6.57082 27.3872C6.04231 26.8618 5.74539 26.1493 5.74539 25.4064ZM5.74539 14.2012C5.74539 13.4583 6.04231 12.7458 6.57082 12.2204C7.09933 11.6951 7.81615 11.4 8.56357 11.4C9.311 11.4 10.0278 11.6951 10.5563 12.2204C11.0848 12.7458 11.3818 13.4583 11.3818 14.2012C11.3818 14.9442 11.0848 15.6567 10.5563 16.182C10.0278 16.7074 9.311 17.0025 8.56357 17.0025C7.81615 17.0025 7.09933 16.7074 6.57082 16.182C6.04231 15.6567 5.74539 14.9442 5.74539 14.2012ZM5.74539 2.99611C5.74539 2.25316 6.04231 1.54064 6.57082 1.0153C7.09933 0.489958 7.81615 0.194824 8.56357 0.194824C9.311 0.194824 10.0278 0.489958 10.5563 1.0153C11.0848 1.54064 11.3818 2.25316 11.3818 2.99611C11.3818 3.73905 11.0848 4.45157 10.5563 4.97691C10.0278 5.50225 9.311 5.79739 8.56357 5.79739C7.81615 5.79739 7.09933 5.50225 6.57082 4.97691C6.04231 4.45157 5.74539 3.73905 5.74539 2.99611Z"
                            fill="white"
                          ></path>
                        </svg>
                      </button>
                      {showButtonList_40 === true && (
                        <CommandBtnList
                          setRefresh={setRefresh}
                          refresh={refresh}
                          wrapperRef={wrapperRef}
                          poolOption={40}
                          userStakedByDuration_10={userStakedByDuration_10}
                          userStakedByDuration_20={userStakedByDuration_20}
                          userStakedByDuration_30={userStakedByDuration_30}
                          userStakedByDuration_40={userStakedByDuration_40}
                          // _minTokensToReceive1={_minTokensToReceive1}
                          // _minTokensToReceive2={_minTokensToReceive2}
                          // _minTokensToReceive3={_minTokensToReceive3}
                          setShowButtonList_10={setShowButtonList_10}
                          setshowButtonList_20={setshowButtonList_20}
                          setShowButtonList_30={setShowButtonList_30}
                          setShowButtonList_40={setShowButtonList_40}
                          tokenRewarded_14={tokenRewarded_14}
                          tokenRewarded_28={tokenRewarded_28}
                          tokenRewarded_56={tokenRewarded_56}
                          compoundPending={compoundPending}
                          setCompoundPending={setCompoundPending}
                          claimEthPending={claimEthPending}
                          setClaimEthPending={setClaimEthPending}
                          claimChibaPending={claimChibaPending}
                          setClaimChibaPending={setClaimChibaPending}
                          unstakePending={unstakePending}
                          setUnstakePending={setUnstakePending}
                        />
                      )}
                    </div>
                    <div className="md:hidden relative">
                      <MobileCommandBtnList
                        wrapperRef={wrapperRef}
                        setRefresh={setRefresh}
                        refresh={refresh}
                        poolOption={40}
                        userStakedByDuration_10={userStakedByDuration_10}
                        userStakedByDuration_20={userStakedByDuration_20}
                        userStakedByDuration_30={userStakedByDuration_30}
                        userStakedByDuration_40={userStakedByDuration_40}
                        // _minTokensToReceive1={_minTokensToReceive1}
                        // _minTokensToReceive2={_minTokensToReceive2}
                        // _minTokensToReceive3={_minTokensToReceive3}
                        tokenRewarded_14={tokenRewarded_14}
                        tokenRewarded_28={tokenRewarded_28}
                        tokenRewarded_56={tokenRewarded_56}
                        compoundPending={compoundPending}
                        setCompoundPending={setCompoundPending}
                        claimEthPending={claimEthPending}
                        setClaimEthPending={setClaimEthPending}
                        claimChibaPending={claimChibaPending}
                        setClaimChibaPending={setClaimChibaPending}
                        unstakePending={unstakePending}
                        setUnstakePending={setUnstakePending}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default Home;
