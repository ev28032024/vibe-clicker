import { Wallet, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const UserHeader = () => {
  const { user, isConnected, isConnecting, connectWallet } = useAuth();

  return (
    <div className="flex items-center justify-between w-full max-w-lg mx-auto px-2">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <span className="text-xl font-bold text-primary-foreground">V</span>
        </div>
        <span className="text-xl font-bold text-foreground">VibeTap</span>
      </div>

      {/* User / Connect button */}
      {isConnected ? (
        <div className="flex items-center gap-3 glass-panel rounded-full pl-3 pr-4 py-2">
          <img
            src={user?.avatar}
            alt={user?.username}
            className="w-8 h-8 rounded-full border-2 border-accent/50"
          />
          <div className="text-right">
            <p className="text-sm font-medium text-foreground leading-tight">
              {user?.username}
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.shortAddress}
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="min-h-[44px] px-4 rounded-full glass-panel flex items-center gap-2 text-foreground font-medium hover:bg-white/10 transition-colors disabled:opacity-70"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="hidden sm:inline">Connecting...</span>
            </>
          ) : (
            <>
              <Wallet className="w-5 h-5" />
              <span className="hidden sm:inline">Connect</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default UserHeader;
