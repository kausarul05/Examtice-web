import React, { useEffect } from "react";
import { useStopwatch } from "react-timer-hook";
import { isTestStart } from "../../features/userSlice";
import { useDispatch, useSelector } from "react-redux";

const MyStopwatch = ({ isStopTimer, timeSpent }) => {

    const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
        useStopwatch({ autoStart: true });

    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(isTestStart(true));
    }, []);
    if (isStopTimer) {
        console.log("isStopTimer", isStopTimer)
    }

    // if(isStopTimer){
    //   const spentTime = {
    //     hours: hours,
    //     minutes:minutes,
    //     seconds:seconds,
    //   }
    //   timeSpent= spentTime;
    //   console.log(isStopTimer,'isStopTimer');
    //   console.log(timeSpent,'timeSpent');
    //   pause();
    // }


    return (
        <>
            <div className="timer">
                <img src="assets/images/timer.png" alt="" />
                <span>
                    {hours} : {minutes} : {seconds}
                </span>
            </div>
            {/* <button onClick={start}>Start</button>
            <button onClick={pause}>Pause</button>
            <button onClick={reset}>Reset</button> */}
        </>
    );
};

export default MyStopwatch;
