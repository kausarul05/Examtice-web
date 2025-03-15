import React, {useEffect} from "react";
import { useStopwatch } from "react-timer-hook";
import { formatTime } from "../CommonFunction";

const TestTimer = ({getTime}) => {
  const { seconds, minutes, hours } = useStopwatch({
    autoStart: true
  });
  
  useEffect(()=>{
      getTime({ seconds, minutes, hours });
  }, [seconds, minutes, hours])


  return (
    <div className="timer">
      <img src="assets/images/timer.png" alt="" />
      <span>
        {formatTime(hours)} : {formatTime(minutes)} : {formatTime(seconds)}
      </span>
    </div>
  );
};

export default TestTimer;
