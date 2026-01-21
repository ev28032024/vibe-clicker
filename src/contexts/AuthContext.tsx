import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
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
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'vibetap_user';

// Generate random avatar URL
const generateAvatar = (address: string) => {
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`;
};

// Generate username from address
const generateUsername = (address: string) => {
  const names = ['Tapper', 'Clicker', 'Zapper', 'Vibester', 'PointMaster', 'TapKing', 'ClickWizard'];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const shortId = address.slice(-4).toUpperCase();
  return `${randomName}${shortId}`;
};

// Shorten wallet address for display
const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isInMiniApp, isReady: farcasterReady, user: farcasterUser, signIn: farcasterSignIn } = useFarcaster();

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isConnecting, setIsConnecting] = useState(false);

  // Auto-connect when Farcaster user is available
  useEffect(() => {
    if (farcasterReady && farcasterUser && !user) {
      const fid = farcasterUser.fid.toString();
      const newUser: User = {
        id: `farcaster-${fid}`,
        username: farcasterUser.username || farcasterUser.displayName || `Fren${fid}`,
        avatar: farcasterUser.pfpUrl || generateAvatar(fid),
        walletAddress: `fid:${fid}`,
        shortAddress: `FID #${fid}`,
        farcasterFid: farcasterUser.fid,
      };
      setUser(newUser);
    }
  }, [farcasterReady, farcasterUser, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);

    // If in Farcaster mini-app, try Farcaster sign-in first
    if (isInMiniApp) {
      try {
        await farcasterSignIn();
        setIsConnecting(false);
        return;
      } catch (error) {
        console.log("Farcaster sign-in failed, falling back to mock wallet");
      }
    }

    // Simulate wallet connection delay (fallback for non-Farcaster)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock wallet address
    const mockAddress = '0x' + Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const newUser: User = {
      id: mockAddress,
      username: generateUsername(mockAddress),
      avatar: generateAvatar(mockAddress),
      walletAddress: mockAddress,
      shortAddress: shortenAddress(mockAddress),
    };

    setUser(newUser);
    setIsConnecting(false);
  }, [isInMiniApp, farcasterSignIn]);

  const disconnectWallet = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isConnecting,
      isConnected: !!user,
      isFarcasterUser: !!user?.farcasterFid,
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
