import { useEffect, useRef, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { isRunningAtom } from '../store';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const StatsDisplay = () => {
  const [todayPracticeTime, setTodayPracticeTime] = useState(0);
  const [totalPracticeCount, setTotalPracticeCount] = useState(0);
  const isRunning = useAtomValue(isRunningAtom);
  const setIsRunning = useSetAtom(isRunningAtom);
  const timerRef = useRef(null);

  const formatTime = (seconds) => {
    const totalSeconds = Number(seconds);
    if (isNaN(totalSeconds)) return '0h 0m 0s';
    
    const duration = dayjs.duration(totalSeconds, 'seconds');
    if (duration.asDays() >= 1) {
      return `${Math.floor(duration.asDays())}d ${duration.hours()}h ${duration.minutes()}m`;
    }
    return `${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
  };

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      const today = new Date().toLocaleDateString();
      
      timerRef.current = setInterval(() => {
        const storedTime = Number(localStorage.getItem(`practiceTime-${today}`) || 0);
        const totalTime = storedTime + 1;
        localStorage.setItem(`practiceTime-${today}`, totalTime);
        setTodayPracticeTime(totalTime);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    }
  };

  const toggleTimer = () => {
    if (isRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  const updateStats = () => {
    const today = new Date().toLocaleDateString();
    const storedTodayTime = Number(localStorage.getItem(`practiceTime-${today}`) || 0);
    const storedTotalCount = localStorage.getItem('totalPracticeCount') || 0;
    
    setTodayPracticeTime(storedTodayTime);
    setTotalPracticeCount(Number(storedTotalCount));
  };

  useEffect(() => {
    // Initial load
    updateStats();
    
    // Listen for storage changes
    const handleStorageChange = () => updateStats();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="stats-container">
      <div className="stat-item">
        <span className="stat-label">Today Practice Time:</span>
        <span className="stat-value">{formatTime(todayPracticeTime)}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Total Practice Count:</span>
        <span className="stat-value">{totalPracticeCount}</span>
      </div>
      <button 
        className={`timer-button ${isRunning ? 'running' : ''}`}
        onClick={toggleTimer}
      >
        {isRunning ? 'Pause' : 'Start'}
      </button>
    </div>
  );
};

export default StatsDisplay;
