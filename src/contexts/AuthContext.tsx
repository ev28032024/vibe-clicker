import React, { createContext, useContext, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useFarcaster } from "./FarcasterContext";

export interface User {
  id: string;
  username: string;
  avatar: string;
  walletAddress: string;
  shortAddress: string;
  farcasterFid?: number;
}

interface AuthContextType {
  user: User | null;
  isConnecting: boolean;
  isConnected: boolean;
  isFarcasterUser: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate random avatar URL
const generateAvatar = (seed: string) => {
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`;
};

// Generate username from address
const generateUsername = (address: string) => {
  const names = ['Tapper', 'Clicker', 'Zapper', 'Vibester', 'PointMaster', 'TapKing', 'ClickWizard'];
  const randomIndex = parseInt(address.slice(-2), 16) % names.length;
  const shortId = address.slice(-4).toUpperCase();
  return `${names[randomIndex]}${shortId}`;
};

// Shorten wallet address for display
const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address, isConnected: walletConnected, isConnecting: walletConnecting } = useAccount();
  const { connect, connectors, isPending: connectPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { isInMiniApp, user: farcasterUser } = useFarcaster();

  // Build user object from wallet/Farcaster data
  const user: User | null = React.useMemo(() => {
    if (!address) return null;

    // Use Farcaster data if available
    if (farcasterUser) {
      return {
        id: `farcaster-${farcasterUser.fid}`,
        username: farcasterUser.username || farcasterUser.displayName || `Fren${farcasterUser.fid}`,
        avatar: farcasterUser.pfpUrl || generateAvatar(address),
        walletAddress: address,
        shortAddress: shortenAddress(address),
        farcasterFid: farcasterUser.fid,
      };
    }

    // Fallback to wallet-derived data
    return {
      id: address,
      username: generateUsername(address),
      avatar: generateAvatar(address),
      walletAddress: address,
      shortAddress: shortenAddress(address),
    };
  }, [address, farcasterUser]);

  // Auto-connect in mini-app context
  useEffect(() => {
    if (isInMiniApp && !walletConnected && !walletConnecting && connectors.length > 0) {
      // In mini-app, wallet is usually already connected via Base Account
      const coinbaseConnector = connectors.find(c => c.id === 'coinbaseWalletSDK');
      if (coinbaseConnector) {
        connect({ connector: coinbaseConnector });
      }
    }
  }, [isInMiniApp, walletConnected, walletConnecting, connectors, connect]);

  const connectWallet = () => {
    const coinbaseConnector = connectors.find(c => c.id === 'coinbaseWalletSDK');
    if (coinbaseConnector) {
      connect({ connector: coinbaseConnector });
    } else if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  return (
    <AuthContext.Provider value={{
      user,
      isConnecting: walletConnecting || connectPending,
      isConnected: walletConnected && !!address,
      isFarcasterUser: !!farcasterUser,
      connectWallet,
      disconnectWallet,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
