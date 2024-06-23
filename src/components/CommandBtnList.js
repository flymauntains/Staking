import { global } from "../config/global";
import StakingContractABI from "../assets/abi/stakingContract.json";
import tokenStakingContractABI from "../assets/abi/tokenStakingContract.json";
import { formatUnits, parseUnits } from "viem";
import { writeContract, prepareWriteContract, waitForTransaction } from "@wagmi/core"
import { toast } from "react-toastify"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import StakingContract1ABI from "../assets/abi/staking.json";

const CommandBtnList = (props) => {
    const stakingContractAddress = global.FlySTAKING_CONTRACTS;
    const tokenStakingContractAddress = global.STAKING_EXTENSION_CONTRACTS;

    let data = {
        chainId: global.chain.id,
    }
   
    const handleClaimChibaRewards = async (poolOption) => {
        props.setClaimChibaPending(true)
        try {
          console.log("fly_claim_poolOption", poolOption)
            // if (props.tokenRewards_14 > 0 || props.tokenRewards_28 > 0 || props.tokenRewards_56 > 0) {
            if (poolOption === 10 && props.userStakedByDuration_10 > 0) {
                if (props.userStakedByDuration_10 > 0) {
                    data = {
                        ...data,
                        address: stakingContractAddress,
                        abi: StakingContract1ABI,
                        functionName: 'claimRewards',
                        args: [((props.userStakedByDuration_10) * 10 ** global.EthDecimals), "10"]
                    }
                    console.log("fly_writecontract_data", data);
                    console.log("fly_props.userStakedByduariton", props.userStakedByDuration_10)
                }
            } 
            else if (poolOption === 10 && props.userStakedByDuration_10 <= 0) {
            // else if (poolOption === 15) {
                toast.warn("Warning! There are not $CHIBA Rewards!")
                props.setClaimChibaPending(false)
                props.setShowButtonList_10(false);
                props.setshowButtonList_20(false);
                props.setShowButtonList_30(false);
                props.setShowButtonList_40(false);
                return
            }
            if (poolOption === 20 && props.userStakedByDuration_20 > 0) {
                console.log("fly_user",props.userStakedByDuration_20)
                if (props.userStakedByDuration_20 > 0) {
                    data = {
                        ...data,
                        address: stakingContractAddress,
                        abi: StakingContract1ABI,
                        functionName: 'claimRewards',
                        args: [((props.userStakedByDuration_20) * 10 ** global.EthDecimals), "20"]
                    }
                }
            } else if (poolOption === 20 && props.userStakedByDuration_20 <= 0) {
                toast.warn("Warning! There are not $CHIBA Rewards!20")
                props.setClaimChibaPending(false)
                props.setShowButtonList_10(false);
                props.setshowButtonList_20(false);
                props.setShowButtonList_30(false);
                props.setShowButtonList_40(false);
                return
            }
            if (poolOption === 30 && props.userStakedByDuration_20 > 0) {
                if (props.userStakedByDuration_30 > 0) {
                    data = {
                        ...data,
                        address: stakingContractAddress,
                        abi: StakingContract1ABI,
                        functionName: 'claimRewards',
                        args: [((props.userStakedByDuration_30) * 10 ** global.EthDecimals), "30"]
                    }
                }
            } else if (poolOption === 30 && props.userStakedByDuration_20 <= 0) {
                toast.warn("Warning! There are not $CHIBA Rewards!")
                props.setClaimChibaPending(false)
                props.setShowButtonList_10(false);
                props.setshowButtonList_20(false);
                props.setShowButtonList_30(false);
                props.setShowButtonList_40(false);
                return
            }
            const preparedData = await prepareWriteContract(data)
            console.log("fly_preparedData", preparedData)
            const writeData = await writeContract(preparedData)
            const txPendingData = waitForTransaction(writeData)
            toast.promise(txPendingData, {
                pending: "Waiting for pending... 👌",
            });

            const txData = await txPendingData;
            if (txData && txData.status === "success") {
                toast.success(`Successfully Chiba Token Claimed! 👌`)
            } else {
                toast.error("Error! Claiming is failed.");
            }
        } catch (error) {
            try {
                if (error?.shortMessage) {
                    toast.error(error?.shortMessage);
                } else {
                    toast.error("Unknown Error! Something went wrong.");
                }
            } catch (error) {
                toast.error("Error! Something went wrong.");
            }
        }
        try {
            if (props.setRefresh !== undefined && props.refresh !== undefined) {
                props.setRefresh(!props.refresh)
            }
        } catch (error) { }
        props.setClaimChibaPending(false);
        props.setShowButtonList_10(false);
        props.setshowButtonList_20(false);
        props.setShowButtonList_30(false);
        props.setShowButtonList_40(false);
        return
    }

    const handleUnstake = async (poolOption) => {
        props.setUnstakePending(true)
        try {
            // if (props.stakedAmountPerUser_14 > 0 && poolOption === 10) {
            if (props.userStakedByDuration_10 > 0 && poolOption === 10) {
                console.log("fly_unstake_pooloption", poolOption)
                data = {
                    ...data,
                    address: stakingContractAddress,
                    abi: StakingContract1ABI,
                    functionName: 'unstake',
                    args: [(props.userStakedByDuration_10 * 10 ** global.EthDecimals), "10"]
                }
                console.log("fly_unstake_props",props.userStakedByDuration_10 * 10 ** global.EthDecimals )
                console.log("fly_unstake_option_14",poolOption)
            } else if (props.userStakedByDuration_10 <= 0) {
                toast.warn("Warning! There are not $CHIBA to unstake!")
                props.setUnstakePending(false)
                props.setShowButtonList_10(false);
                props.setshowButtonList_20(false);
                props.setShowButtonList_30(false);
                props.setShowButtonList_40(false);
                return
            }
            if (props.userStakedByDuration_20 > 0 && poolOption === 20) {
              data = {
                ...data,
                address: stakingContractAddress,
                abi: StakingContract1ABI,
                functionName: 'unstake',
                args: [(props.userStakedByDuration_10 * 10 ** global.EthDecimals), "20"]
              }
              console.log("fly_option_28", poolOption)
            } else if (props.userStakedByDuration_20 <= 0) {
                toast.warn("Warning! There are not $CHIBA to unstake!!!!")
                props.setUnstakePending(false)
                props.setShowButtonList_10(false);
                props.setshowButtonList_20(false);
                props.setShowButtonList_30(false);
                props.setShowButtonList_40(false);
                return
            }
            if (props.userStakedByDuration_30 > 0 && poolOption === 30) {
              console.log("fly_option_56", poolOption)
              console.log("fly_userStakedByDuration_30", props.userStakedByDuration_30)
                data = {
                    ...data,
                    address: stakingContractAddress,
                    abi: StakingContract1ABI,
                    functionName: 'unstake',
                    args: [(props.userStakedByDuration_30 * 10 ** global.EthDecimals), "30"]
                }
            } else if (props.userStakedByDuration_30 <= 0) {
                toast.warn("Warning! There are not $CHIBA to unstake!!!!!")
                props.setUnstakePending(false)
                props.setShowButtonList_10(false);
                props.setshowButtonList_20(false);
                props.setShowButtonList_30(false);
                props.setShowButtonList_40(false);
                return
            }
            const preparedData = await prepareWriteContract(data)
            console.log("fly_preparedData", preparedData)
            const writeData = await writeContract(preparedData)
            const txPendingData = waitForTransaction(writeData)
            toast.promise(txPendingData, {
                pending: "Waiting for pending... 👌",
            });

            const txData = await txPendingData;
            if (txData && txData.status === "success") {
                toast.success(`Successfully Unstaked! 👌`)
            } else {
                toast.error("Error! Unstaking is failed.");
            }
        } catch (error) {
            try {
                if (error?.shortMessage) {
                    toast.error(error?.shortMessage);
                } else {
                    toast.error("Unknown Error! Something went wrong.");
                }
            } catch (error) {
                toast.error("Error! Something went wrong.");
            }
        }
        try {
            if (props.setRefresh !== undefined && props.refresh !== undefined) {
                props.setRefresh(!props.refresh)
            }
        } catch (error) { }
        props.setUnstakePending(false);
        props.setShowButtonList_10(false);
        props.setshowButtonList_20(false);
        props.setShowButtonList_30(false);
        props.setShowButtonList_40(false);
        return
    }

    return (
        <div ref={props.wrapperRef} className="z-10 bg-violet-4 rounded-xl shadow w-64 absolute right-0 px-3 py-5 border border-gray-1 border-opacity-30">
            <div className="flex flex-col gap-3 items-start">
                {/* <button
                    onClick={() => { handleCompoundAndRelock(true, props.poolOption) }}
                    className="font-medium text-center text-white px-5 py-2.5 text-sm rounded connect-button w-full"
                    disabled={(props.compoundPending === true || props.claimEthPending === true || props.claimChibaPending === true || props.unstakePending === true) ? true : false}
                >
                    <div>
                        {props.compoundPending ? "Pending " : "Compound ETH & Relock"}
                        {props.compoundPending ? <FontAwesomeIcon icon={faSpinner} size="sm" className="animate-spin" /> : <></>}
                    </div>
                </button> */}
                {/* <button
                    onClick={() => handleCompoundAndRelock(false, props.poolOption)}
                    className="font-medium text-center text-white px-5 py-2.5 text-sm rounded connect-button w-full"
                    disabled={(props.compoundPending === true || props.claimEthPending === true || props.claimChibaPending === true || props.unstakePending === true) ? true : false}
                >
                    <div>
                        {props.claimEthPending ? "Pending " : "Claim ETH & Relock"}
                        {props.claimEthPending ? <FontAwesomeIcon icon={faSpinner} size="sm" className="animate-spin" /> : <></>}
                    </div>
                </button> */}
                <button
                    onClick={() => handleClaimChibaRewards(props.poolOption)}
                    className="font-medium text-center text-white px-5 py-2.5 text-sm rounded connect-button w-full"
                    disabled={(props.compoundPending === true || props.claimEthPending === true || props.claimChibaPending === true || props.unstakePending === true) ? true : false}
                >
                    <div>
                        {props.claimChibaPending ? "Pending " : "Claim $CHIBA Rewards"}
                        {props.claimChibaPending ? <FontAwesomeIcon icon={faSpinner} size="sm" className="animate-spin" /> : <></>}
                    </div>
                </button>
                <button
                    onClick={() => handleUnstake(props.poolOption)}
                    className="font-medium text-center text-white px-5 py-2.5 text-sm rounded connect-button w-full"
                    disabled={(props.compoundPending === true || props.claimEthPending === true || props.claimChibaPending === true || props.unstakePending === true) ? true : false}
                >
                    <div>
                        {props.unstakePending ? "Pending " : "Unstake"}
                        {props.unstakePending ? <FontAwesomeIcon icon={faSpinner} size="sm" className="animate-spin" /> : <></>}
                    </div>
                </button>
            </div>
        </div>
    )
}

export default CommandBtnList;