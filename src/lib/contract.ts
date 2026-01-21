// VibeTapLeaderboard Contract ABI and Address
// Deploy the contract from contracts/VibeTapLeaderboard.sol and update the address

export const VIBETAP_CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}` | undefined;

export const VIBETAP_ABI = [
    {
        type: "function",
        name: "submitScore",
        inputs: [
            { name: "newScore", type: "uint256" },
            { name: "newTotalClicks", type: "uint256" },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "getPlayer",
        inputs: [{ name: "playerAddress", type: "address" }],
        outputs: [
            { name: "score", type: "uint256" },
            { name: "totalClicks", type: "uint256" },
            { name: "lastUpdate", type: "uint256" },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getPlayerCount",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getAllPlayers",
        inputs: [],
        outputs: [
            { name: "addresses", type: "address[]" },
            { name: "scores", type: "uint256[]" },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "players",
        inputs: [{ name: "", type: "address" }],
        outputs: [
            { name: "score", type: "uint256" },
            { name: "totalClicks", type: "uint256" },
            { name: "lastUpdate", type: "uint256" },
            { name: "exists", type: "bool" },
        ],
        stateMutability: "view",
    },
    {
        type: "event",
        name: "ScoreSubmitted",
        inputs: [
            { name: "player", type: "address", indexed: true },
            { name: "score", type: "uint256", indexed: false },
            { name: "totalClicks", type: "uint256", indexed: false },
        ],
    },
    {
        type: "event",
        name: "NewPlayer",
        inputs: [{ name: "player", type: "address", indexed: true }],
    },
] as const;
