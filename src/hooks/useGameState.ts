import { useState, useCallback, useEffect, useRef } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { VIBETAP_ABI, VIBETAP_CONTRACT_ADDRESS } from "@/lib/contract";

interface GameState {
  score: number;
  totalClicks: number;
}

const STORAGE_KEY = 'vibetap_game_state';
const SYNC_DEBOUNCE_MS = 3000; // Sync to chain every 3 seconds of inactivity

export const useGameState = () => {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

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

  const [lastSyncedScore, setLastSyncedScore] = useState(0);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  // Debounced sync to blockchain
  const syncToChain = useCallback(() => {
    if (!isConnected || !VIBETAP_CONTRACT_ADDRESS) return;
    if (gameState.score <= lastSyncedScore) return;
    if (isPending || isConfirming) return;

    writeContract({
      address: VIBETAP_CONTRACT_ADDRESS,
      abi: VIBETAP_ABI,
      functionName: "submitScore",
      args: [BigInt(gameState.score), BigInt(gameState.totalClicks)],
    });

    setLastSyncedScore(gameState.score);
  }, [isConnected, gameState, lastSyncedScore, isPending, isConfirming, writeContract]);

  // Schedule sync after clicks stop
  useEffect(() => {
    if (gameState.score > lastSyncedScore && isConnected && VIBETAP_CONTRACT_ADDRESS) {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      syncTimeoutRef.current = setTimeout(syncToChain, SYNC_DEBOUNCE_MS);
    }

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [gameState.score, lastSyncedScore, isConnected, syncToChain]);

  const handleClick = useCallback(() => {
    setGameState(prev => ({
      score: prev.score + 1,
      totalClicks: prev.totalClicks + 1,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({ score: 0, totalClicks: 0 });
    setLastSyncedScore(0);
  }, []);

  // Force immediate sync
  const forceSync = useCallback(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    syncToChain();
  }, [syncToChain]);

  return {
    score: gameState.score,
    totalClicks: gameState.totalClicks,
    handleClick,
    resetGame,
    forceSync,
    isSyncing: isPending || isConfirming,
    needsSync: gameState.score > lastSyncedScore,
    isContractConfigured: !!VIBETAP_CONTRACT_ADDRESS,
  };
};
