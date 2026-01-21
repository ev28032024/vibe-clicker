import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Save, Loader2 } from "lucide-react";
import UserHeader from "@/components/UserHeader";
import ScoreDisplay from "@/components/ScoreDisplay";
import ClickButton from "@/components/ClickButton";
import LeaderboardPanel from "@/components/LeaderboardPanel";
import BottomNav from "@/components/BottomNav";
import ProfilePanel from "@/components/ProfilePanel";
import SettingsPanel from "@/components/SettingsPanel";
import OnboardingModal from "@/components/OnboardingModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useGameState } from "@/hooks/useGameState";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useAuth } from "@/contexts/AuthContext";

type TabId = 'home' | 'leaderboard' | 'profile' | 'settings';

const ONBOARDING_KEY = 'vibetap_onboarding_complete';

const Index = () => {
  const { address, isConnected } = useAccount();
  const { isConnected: authConnected } = useAuth();
  const {
    score,
    totalClicks,
    handleClick,
    saveToChain,
    isSaving,
    hasUnsavedScore,
    lastSavedScore,
    isContractConfigured
  } = useGameState();
  const { leaderboard, getUserRank, isLoading: leaderboardLoading } = useLeaderboard();
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const userRank = getUserRank(address);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      const completed = localStorage.getItem(ONBOARDING_KEY);
      if (!completed) {
        setShowOnboarding(true);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen min-h-[100dvh] game-gradient-bg flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading VibeTap..." />
      </div>
    );
  }

  const leaderboardEntries = leaderboard.map(entry => ({
    rank: entry.rank,
    username: entry.username,
    avatar: entry.avatar,
    score: entry.score,
  }));

  const renderContent = () => {
    switch (activeTab) {
      case 'leaderboard':
        return (
          <div className="flex-1 overflow-hidden">
            {!isContractConfigured ? (
              <div className="p-4 text-center text-muted-foreground">
                <p>Leaderboard will be available after contract deployment.</p>
                <p className="text-sm mt-2">Set VITE_CONTRACT_ADDRESS in environment.</p>
              </div>
            ) : leaderboardLoading ? (
              <div className="flex items-center justify-center p-8">
                <LoadingSpinner size="md" text="Loading leaderboard..." />
              </div>
            ) : (
              <LeaderboardPanel entries={leaderboardEntries} currentUserRank={userRank} />
            )}
          </div>
        );
      case 'profile':
        return (
          <div className="flex-1 overflow-y-auto">
            <ProfilePanel />
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 overflow-y-auto">
            <SettingsPanel />
          </div>
        );
      default:
        return (
          <main className="flex-1 flex flex-col items-center justify-center gap-6 md:gap-10 py-4">
            {/* Score display */}
            <div className="animate-float">
              <ScoreDisplay score={score} totalClicks={totalClicks} />
            </div>

            {/* Click button */}
            <ClickButton onClick={handleClick} />

            {/* Save Score Button */}
            {isConnected && isContractConfigured && (
              <button
                onClick={saveToChain}
                disabled={isSaving || !hasUnsavedScore}
                className={`
                  min-h-[48px] px-6 py-3 rounded-2xl font-semibold text-base
                  flex items-center gap-2 transition-all duration-200
                  ${hasUnsavedScore
                    ? 'bg-gradient-to-r from-accent to-primary text-white shadow-lg hover:shadow-xl hover:scale-105'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }
                  disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
                `}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : hasUnsavedScore ? (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Score ({score - lastSavedScore} new)</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Score Saved ✓</span>
                  </>
                )}
              </button>
            )}

            {/* Status messages */}
            {!isConnected && (
              <p className="text-muted-foreground text-sm font-medium">
                Connect wallet to save your score on-chain
              </p>
            )}
            {isConnected && !isContractConfigured && (
              <p className="text-muted-foreground text-sm font-medium">
                Contract not configured yet
              </p>
            )}
            {!isSaving && !hasUnsavedScore && isConnected && (
              <p className="text-muted-foreground text-sm font-medium animate-pulse">
                Tap to earn points!
              </p>
            )}
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] game-gradient-bg flex flex-col">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen min-h-[100dvh] pb-20">
        <header className="flex-shrink-0 px-4 py-4 safe-area-top">
          <UserHeader />
        </header>
        {renderContent()}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <OnboardingModal open={showOnboarding} onComplete={handleOnboardingComplete} />
    </div>
  );
};

export default Index;
