import { useState, useCallback, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { VIBETAP_ABI, VIBETAP_CONTRACT_ADDRESS } from "@/lib/contract";

interface GameState {
  score: number;
  totalClicks: number;
}

const STORAGE_KEY = 'vibetap_game_state';

export const useGameState = () => {
  const { isConnected } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const [gameState, setGameState] = useState<GameState>(() => {
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

  const [lastSavedScore, setLastSavedScore] = useState(0);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  // Update lastSavedScore when transaction confirms
  useEffect(() => {
    if (isSuccess) {
      setLastSavedScore(gameState.score);
    }
  }, [isSuccess, gameState.score]);

  const handleClick = useCallback(() => {
    setGameState(prev => ({
      score: prev.score + 1,
      totalClicks: prev.totalClicks + 1,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({ score: 0, totalClicks: 0 });
    setLastSavedScore(0);
  }, []);

  // Manual save to blockchain - user clicks button
  const saveToChain = useCallback(() => {
    if (!isConnected || !VIBETAP_CONTRACT_ADDRESS) return;
    if (gameState.score <= lastSavedScore) return;
    if (isPending || isConfirming) return;

    writeContract({
      address: VIBETAP_CONTRACT_ADDRESS,
      abi: VIBETAP_ABI,
      functionName: "submitScore",
      args: [BigInt(gameState.score), BigInt(gameState.totalClicks)],
    });
  }, [isConnected, gameState, lastSavedScore, isPending, isConfirming, writeContract]);

  return {
    score: gameState.score,
    totalClicks: gameState.totalClicks,
    handleClick,
    resetGame,
    saveToChain,
    isSaving: isPending || isConfirming,
    hasUnsavedScore: gameState.score > lastSavedScore,
    lastSavedScore,
    isContractConfigured: !!VIBETAP_CONTRACT_ADDRESS,
  };
};
