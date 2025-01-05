import React, { useState, useEffect, useCallback } from 'react';
import { TimerDisplay } from './components/Timer';
import { StartButton } from './components/StartButton';
import { GameStatus } from './components/GameStatus';
import { useTimer } from './hooks/useTimer';
import { encryptFlag, decryptFlag } from './utils/crypto';
import { GAME_CONFIG } from './config/constants';
import { createCaptureFunction, cleanupCaptureFunction, calculateTimeElapsed } from './utils/gameLogic';

const ENCRYPTED_FLAG = encryptFlag(GAME_CONFIG.FLAG);

export default function App() {
  const [attempts, setAttempts] = useState<number>(0);
  const [hasFlag, setHasFlag] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleTimeout = useCallback(() => {
    if (!hasFlag) {
      console.clear();
      console.log('Time out! Try again...');
      setHasFlag(false);
      cleanupCaptureFunction();
    }
  }, [hasFlag]);

  const { timeLeft, isRunning, hasTimedOut, startTimer, stopTimer } = useTimer(
    GAME_CONFIG.INITIAL_TIME,
    handleTimeout
  );

  const handleCapture = useCallback(() => {
    if (!isRunning || timeLeft <= 0) return;
    
    setHasFlag(true);
    stopTimer();
    const flag = decryptFlag(ENCRYPTED_FLAG);
    const message = `🎉 Congratulations! You captured the flag in ${calculateTimeElapsed(GAME_CONFIG.INITIAL_TIME, timeLeft)} seconds!`;
    setSuccessMessage(message);
    console.log(message);
    console.log('Flag:', flag);
  }, [timeLeft, stopTimer, isRunning]);

  const startChallenge = useCallback(() => {
    setAttempts((prev) => prev + 1);
    setHasFlag(false);
    setSuccessMessage('');
    console.clear();
    startTimer();
    
    // Create the capture function immediately after starting the timer
    createCaptureFunction({
      isRunning: true,
      timeLeft: GAME_CONFIG.INITIAL_TIME,
      onCapture: handleCapture
    });

    console.log('🎮 Challenge started!');
    console.log(`💡 Call a function which capture flag in the console to capture the flag before time runs out!`);
  }, [startTimer, handleCapture]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupCaptureFunction();
    };
  }, []);

  // Update capture function state when timer changes
  useEffect(() => {
    if (isRunning) {
      createCaptureFunction({
        isRunning,
        timeLeft,
        onCapture: handleCapture
      });
    }
  }, [isRunning, timeLeft, handleCapture]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Sideboard Challenge</h1>
          <p className="text-gray-400">
            Capture the flag within {GAME_CONFIG.INITIAL_TIME} seconds!
          </p>
        </div>

        <div className="space-y-6">
          <TimerDisplay timeLeft={timeLeft} />
          
          <div className="flex flex-col gap-4">
            <StartButton 
              onClick={startChallenge}
              disabled={isRunning}
            />
          </div>

          <GameStatus
            successMessage={successMessage}
            hasTimedOut={hasTimedOut}
            hasFlag={hasFlag}
            attempts={attempts}
          />
        </div>
      </div>
    </div>
  );
}