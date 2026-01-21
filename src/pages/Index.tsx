import { useState, useEffect } from "react";
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

// Mock leaderboard data
const mockLeaderboard = [
  { rank: 1, username: "TapKing99", score: 1250000 },
  { rank: 2, username: "SpeedClicker", score: 980000 },
  { rank: 3, username: "VibeMaster", score: 750000 },
  { rank: 4, username: "PointHunter", score: 520000 },
  { rank: 5, username: "ZapQueen", score: 480000 },
  { rank: 6, username: "ClickWizard", score: 320000 },
  { rank: 7, username: "TapNinja", score: 290000 },
  { rank: 8, username: "ScoreChaser", score: 250000 },
  { rank: 9, username: "FastFinger", score: 180000 },
  { rank: 10, username: "RankRiser", score: 150000 },
];

type TabId = 'home' | 'leaderboard' | 'profile' | 'settings';

const ONBOARDING_KEY = 'vibetap_onboarding_complete';

const Index = () => {
  const { score, totalClicks, handleClick } = useGameState();
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Check if onboarding was completed
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

  const renderContent = () => {
    switch (activeTab) {
      case 'leaderboard':
        return (
          <div className="flex-1 overflow-hidden">
            <LeaderboardPanel entries={mockLeaderboard} currentUserRank={42} />
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

            {/* Tap instruction */}
            <p className="text-muted-foreground text-sm font-medium animate-pulse">
              Tap to earn points!
            </p>
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] game-gradient-bg flex flex-col">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen min-h-[100dvh] pb-20">
        {/* Header */}
        <header className="flex-shrink-0 px-4 py-4 safe-area-top">
          <UserHeader />
        </header>

        {/* Dynamic content based on active tab */}
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Onboarding Modal */}
      <OnboardingModal open={showOnboarding} onComplete={handleOnboardingComplete} />
    </div>
  );
};

export default Index;
