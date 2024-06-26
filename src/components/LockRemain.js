import { useState, useEffect} from "react"

const LockRemain = ({stakedTimePerUser, type}) => {

    const [day, setDay] = useState(0);
    const [hour, setHour] = useState(0);
    const [min, setMin] = useState(0);
    const [sec, setSec] = useState(0);

    const [refetch, setRefetch] = useState (false)

    const getUpdateTime = () => {
        var d1 = new Date();
        const currentTime = Math.floor(d1.getTime() / 1000);
        const secondsInDay = 86400;
        const typeInSeonds = secondsInDay * type;
        const periodTime = typeInSeonds + Number(stakedTimePerUser) - currentTime;
        if (periodTime > 0) {
            let temp = periodTime;
            setDay(Math.floor(temp / 86400));
            temp = temp - day * 86400;
            setHour(Math.floor(temp / 3600));
            temp = temp - hour * 3600;
            setMin(Math.floor(temp / 60));
            setSec(Math.floor(temp % 60));
        }
    }

    useEffect(() => {
        const timerID = setInterval(() => {
            setRefetch((prevData) => {
                return !prevData;
            })
        }, global.REFETCH_SECOND);

        return () => {
            clearInterval(timerID);
        };
    }, []);

    useEffect(() => {
        getUpdateTime();
    }, [refetch]);

    return (
        <div className="flex flex-col">
            <span>
                <h1 className="lg:text-lg text-base font-bold">{day}D {hour}H {min}M {sec}S </h1>
            </span>
            <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">Lock Remaining</h2>
        </div>
    )
}

export default LockRemain