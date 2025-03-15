import React, { useEffect } from "react";
import { useTimer, useStopwatch } from "react-timer-hook";
import { formatTime } from "../CommonFunction";

const ExamTimer = ({ expiryTime, getTime, onExpireTime }) => {
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(
    expiryTimestamp.getSeconds() + expiryTime
  );

   const { seconds, minutes, hours } = useTimer({
    expiryTimestamp,
    onExpire: () => onExpireTime({ seconds, minutes, hours }),
  });


  useEffect(() => {
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

export default ExamTimer;
