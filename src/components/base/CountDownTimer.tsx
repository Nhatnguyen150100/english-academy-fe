import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import Visibility from './visibility';

interface CountdownTimerProps {
  initialMinutes: number;
  onCountdownComplete: () => void;
  isActive: boolean;
  isShowStartTest: boolean;
  onStart: (value: boolean) => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialMinutes,
  isActive,
  isShowStartTest,
  onCountdownComplete,
  onStart,
}) => {
  const totalSeconds = initialMinutes * 60;
  const [remainingTime, setRemainingTime] = useState<number>(totalSeconds);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      clearInterval(interval!);
      onStart(false);
      onCountdownComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, remainingTime, onCountdownComplete]);

  const handleStart = () => {
    onStart(true);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { hours, minutes, secs };
  };

  const { hours, minutes, secs } = formatTime(remainingTime);

  return (
    <div className='space-y-5'>
      <Clock size={'100px'} value={new Date(Date.now() + remainingTime)} />
      <div className='space-y-3'>
        <h3>{`${hours} hours, ${minutes} minutes, ${secs} seconds remaining`}</h3>
        <Visibility visibility={isShowStartTest}>
          <Button type="primary" onClick={handleStart} disabled={isActive}>
            Start test
          </Button>
        </Visibility>
      </div>
    </div>
  );
};

export default CountdownTimer;
