import { useState, useCallback, useEffect, useRef } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { VIBETAP_ABI, VIBETAP_CONTRACT_ADDRESS } from "@/lib/contract";

interface GameState {
  score: number;
  totalClicks: number;
}

const STORAGE_KEY = 'vibetap_game_state';

export const useGameState = () => {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Read player's current on-chain score
  const { data: playerData, refetch: refetchPlayer } = useReadContract({
    address: VIBETAP_CONTRACT_ADDRESS,
    abi: VIBETAP_ABI,
    functionName: "getPlayer",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!VIBETAP_CONTRACT_ADDRESS,
    },
  });

  // Get on-chain score
  const onChainScore = playerData ? Number((playerData as [bigint, bigint, bigint])[0]) : 0;

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

  const pendingSaveScore = useRef<number | null>(null);
  const hasSyncedFromChain = useRef(false);

  // Sync score from blockchain when wallet connects
  useEffect(() => {
    if (playerData && !hasSyncedFromChain.current) {
      const [chainScore, chainClicks] = playerData as [bigint, bigint, bigint];
      const scoreFromChain = Number(chainScore);
      const clicksFromChain = Number(chainClicks);

      // Use the higher score (chain or local)
      if (scoreFromChain > gameState.score) {
        setGameState({
          score: scoreFromChain,
          totalClicks: clicksFromChain,
        });
      }

      hasSyncedFromChain.current = true;
    }
  }, [playerData, gameState.score]);

  // Reset sync flag when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      hasSyncedFromChain.current = false;
    }
  }, [isConnected]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  // Refetch on-chain score after successful save
  useEffect(() => {
    if (isSuccess && pendingSaveScore.current !== null) {
      pendingSaveScore.current = null;
      reset();
      refetchPlayer(); // Refetch to update onChainScore
    }
  }, [isSuccess, reset, refetchPlayer]);

  const handleClick = useCallback(() => {
    setGameState(prev => ({
      score: prev.score + 1,
      totalClicks: prev.totalClicks + 1,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({ score: 0, totalClicks: 0 });
  }, []);

  // Can only save if current score beats on-chain record
  const canSave = gameState.score > onChainScore;

  // Manual save to blockchain
  const saveToChain = useCallback(() => {
    if (!isConnected || !VIBETAP_CONTRACT_ADDRESS) return;
    if (!canSave) return; // Must beat on-chain score
    if (isPending || isConfirming) return;

    pendingSaveScore.current = gameState.score;

    writeContract({
      address: VIBETAP_CONTRACT_ADDRESS,
      abi: VIBETAP_ABI,
      functionName: "submitScore",
      args: [BigInt(gameState.score), BigInt(gameState.totalClicks)],
    });
  }, [isConnected, gameState, canSave, isPending, isConfirming, writeContract]);

  return {
    score: gameState.score,
    totalClicks: gameState.totalClicks,
    handleClick,
    resetGame,
    saveToChain,
    isSaving: isPending || isConfirming,
    canSave, // True only when current score > on-chain score
    onChainScore, // Current record from blockchain
    isContractConfigured: !!VIBETAP_CONTRACT_ADDRESS,
  };
};
