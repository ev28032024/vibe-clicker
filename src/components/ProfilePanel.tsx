import { useAuth } from "@/contexts/AuthContext";
import { Trophy, Zap, LogOut, Wallet, Loader2 } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";

const ProfilePanel = () => {
  const { user, isConnected, connectWallet, disconnectWallet, isConnecting } = useAuth();
  const { score, totalClicks } = useGameState();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 py-12 space-y-6">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
          <Wallet className="w-12 h-12 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-foreground">Connect to Play</h2>
          <p className="text-muted-foreground text-sm max-w-xs">
            Connect your wallet to save your progress and compete on the leaderboard.
          </p>
        </div>
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="min-h-[48px] px-8 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-6 py-8 space-y-6">
      {/* Avatar and Name */}
      <div className="text-center space-y-3">
        <div className="relative">
          <img
            src={user?.avatar}
            alt={user?.username}
            className="w-24 h-24 rounded-full border-4 border-accent/50"
          />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <Zap className="w-4 h-4 text-accent-foreground" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{user?.username}</h2>
          <p className="text-sm text-muted-foreground">{user?.shortAddress}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="w-full max-w-sm grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-2xl p-4 text-center">
          <Trophy className="w-8 h-8 text-game-gold mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{score.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total Points</p>
        </div>
        <div className="glass-panel rounded-2xl p-4 text-center">
          <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{totalClicks.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total Taps</p>
        </div>
      </div>

      {/* Rank Card */}
      <div className="w-full max-w-sm glass-panel rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Rank</p>
              <p className="text-xl font-bold text-foreground">#42</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">To next rank</p>
            <p className="text-lg font-semibold text-accent">+2,500</p>
          </div>
        </div>
      </div>

      {/* Disconnect */}
      <button
        onClick={disconnectWallet}
        className="min-h-[48px] px-6 rounded-xl border border-destructive/30 text-destructive font-medium flex items-center gap-2 hover:bg-destructive/10 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Disconnect Wallet
      </button>
    </div>
  );
};

export default ProfilePanel;
