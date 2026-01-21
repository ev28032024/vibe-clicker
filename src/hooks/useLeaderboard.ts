import { useReadContract } from "wagmi";
import { useMemo } from "react";
import { VIBETAP_ABI, VIBETAP_CONTRACT_ADDRESS } from "@/lib/contract";

export interface LeaderboardEntry {
    rank: number;
    address: string;
    username: string;
    avatar?: string;
    score: number;
}

// Generate username from address
const generateUsername = (address: string) => {
    const names = ['Tapper', 'Clicker', 'Zapper', 'Vibester', 'PointMaster', 'TapKing', 'ClickWizard'];
    const randomIndex = parseInt(address.slice(-2), 16) % names.length;
    const shortId = address.slice(-4).toUpperCase();
    return `${names[randomIndex]}${shortId}`;
};

// Generate avatar from address
const generateAvatar = (address: string) => {
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`;
};

export const useLeaderboard = (limit: number = 50) => {
    const { data, isLoading, error, refetch } = useReadContract({
        address: VIBETAP_CONTRACT_ADDRESS,
        abi: VIBETAP_ABI,
        functionName: "getAllPlayers",
        query: {
            enabled: !!VIBETAP_CONTRACT_ADDRESS,
            refetchInterval: 10000, // Refetch every 10 seconds
        },
    });

    const leaderboard = useMemo<LeaderboardEntry[]>(() => {
        if (!data) return [];

        const [addresses, scores] = data as [string[], bigint[]];

        // Combine and sort by score descending
        const combined = addresses.map((addr, i) => ({
            address: addr,
            score: Number(scores[i]),
        }));

        combined.sort((a, b) => b.score - a.score);

        // Take top entries and add rank, username, avatar
        return combined.slice(0, limit).map((entry, index) => ({
            rank: index + 1,
            address: entry.address,
            username: generateUsername(entry.address),
            avatar: generateAvatar(entry.address),
            score: entry.score,
        }));
    }, [data, limit]);

    // Find current user's rank
    const getUserRank = (userAddress: string | undefined): number | undefined => {
        if (!userAddress || !data) return undefined;

        const [addresses, scores] = data as [string[], bigint[]];

        const combined = addresses.map((addr, i) => ({
            address: addr.toLowerCase(),
            score: Number(scores[i]),
        }));

        combined.sort((a, b) => b.score - a.score);

        const index = combined.findIndex(
            (entry) => entry.address === userAddress.toLowerCase()
        );

        return index >= 0 ? index + 1 : undefined;
    };

    return {
        leaderboard,
        isLoading,
        error,
        refetch,
        getUserRank,
        isContractConfigured: !!VIBETAP_CONTRACT_ADDRESS,
    };
};
