import { http, createConfig } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

// Use Base Sepolia for testing, Base mainnet for production
const isProduction = import.meta.env.PROD;

export const config = createConfig({
    chains: [isProduction ? base : baseSepolia],
    connectors: [
        coinbaseWallet({
            appName: "VibeTap",
            preference: "smartWalletOnly", // Use Smart Wallet for gasless transactions
        }),
    ],
    transports: {
        [base.id]: http(),
        [baseSepolia.id]: http(),
    },
});

// Export chain for use in components
export const targetChain = isProduction ? base : baseSepolia;

declare module "wagmi" {
    interface Register {
        config: typeof config;
    }
}
