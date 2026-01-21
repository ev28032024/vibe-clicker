import { useState, useCallback, useEffect } from "react";

interface GameState {
  score: number;
  totalClicks: number;
}

const STORAGE_KEY = 'vibetap_game_state';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Load from localStorage on initial render
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { score: 0, totalClicks: 0 };
      }
    }
    return { score: 0, totalClicks: 0 };
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const handleClick = useCallback(() => {
    setGameState(prev => ({
      score: prev.score + 1,
      totalClicks: prev.totalClicks + 1,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({ score: 0, totalClicks: 0 });
  }, []);

  return {
    score: gameState.score,
    totalClicks: gameState.totalClicks,
    handleClick,
    resetGame,
  };
};
