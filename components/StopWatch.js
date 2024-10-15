"use client"
import { useEffect, useState } from "react";
import { useStopwatch } from 'react-timer-hook';
import {Roboto_Mono} from "next/font/google"

const robo = Roboto_Mono({ subsets: ['latin'] })

export default function StopWatch({playing, onTimeChange}){

    useEffect(() => {
        if(playing === 0){
            reset(0, false);
        } else if (playing === 1){
            start();
        } else if (playing === 2){
            pause();
        }
    },[playing])

    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        isRunning,
        start,
        pause,
        reset,
      } = useStopwatch({ autoStart: false });

      useEffect(() => {
        if (onTimeChange) {
            onTimeChange(totalSeconds);
        }
    }, [totalSeconds, onTimeChange]);

      const formatTime = (time) => {
        return String(time).padStart(2, '0')
      }

      return (
          <div  className={robo.className} style={{fontSize: "30px", width: "150px",textAlign: "center",fontVariant: "tabular-nums",color: playing ===2 ? "green" : "black"}}>
            <span>{formatTime(minutes)}</span>:<span>{formatTime(seconds)}</span>
          </div>
      );
}