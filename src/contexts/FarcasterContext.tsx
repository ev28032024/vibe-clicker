import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

// Types for Farcaster SDK context
export interface FarcasterUser {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
}

export interface FarcasterContext {
    isInMiniApp: boolean;
    isReady: boolean;
    user: FarcasterUser | null;
    sdk: typeof import("@farcaster/miniapp-sdk").sdk | null;
}

interface FarcasterContextType extends FarcasterContext {
    signIn: () => Promise<void>;
}

const FarcasterCtx = createContext<FarcasterContextType | undefined>(undefined);

export const FarcasterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isInMiniApp, setIsInMiniApp] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [user, setUser] = useState<FarcasterUser | null>(null);
    const [sdk, setSdk] = useState<typeof import("@farcaster/miniapp-sdk").sdk | null>(null);

    useEffect(() => {
        const initFarcaster = async () => {
            try {
                // Dynamic import to avoid SSR/build issues when SDK is not installed
                const farcasterModule = await import("@farcaster/miniapp-sdk");
                const farcasterSdk = farcasterModule.sdk;

                setSdk(farcasterSdk);

                // Check if running inside Farcaster mini-app environment
                const context = await farcasterSdk.context;

                if (context) {
                    setIsInMiniApp(true);

                    // Extract user info from context if available
                    if (context.user) {
                        setUser({
                            fid: context.user.fid,
                            username: context.user.username,
                            displayName: context.user.displayName,
                            pfpUrl: context.user.pfpUrl,
                        });
                    }

                    // Signal that the app is ready to be displayed
                    await farcasterSdk.actions.ready();
                }

                setIsReady(true);
            } catch (error) {
                // SDK not available or not in mini-app context - gracefully degrade
                console.log("Farcaster SDK not available or not in mini-app context:", error);
                setIsReady(true);
            }
        };

        initFarcaster();
    }, []);

    const signIn = useCallback(async () => {
        if (!sdk || !isInMiniApp) {
            console.log("Cannot sign in: not in Farcaster mini-app context");
            return;
        }

        try {
            const result = await sdk.actions.signIn({
                siweUri: window.location.origin,
                domain: window.location.host,
            });

            if (result?.fid) {
                setUser({
                    fid: result.fid,
                    username: result.username,
                    displayName: result.displayName,
                    pfpUrl: result.pfpUrl,
                });
            }
        } catch (error) {
            console.error("Farcaster sign in failed:", error);
        }
    }, [sdk, isInMiniApp]);

    return (
        <FarcasterCtx.Provider value={{
            isInMiniApp,
            isReady,
            user,
            sdk,
            signIn,
        }}>
            {children}
        </FarcasterCtx.Provider>
    );
};

export const useFarcaster = () => {
    const context = useContext(FarcasterCtx);
    if (!context) {
        throw new Error("useFarcaster must be used within a FarcasterProvider");
    }
    return context;
};
