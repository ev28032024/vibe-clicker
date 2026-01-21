import { Home, Trophy, User, Settings } from "lucide-react";

type TabId = 'home' | 'leaderboard' | 'profile' | 'settings';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const tabs = [
    { id: 'home' as TabId, icon: Home, label: 'Play' },
    { id: 'leaderboard' as TabId, icon: Trophy, label: 'Ranks' },
    { id: 'profile' as TabId, icon: User, label: 'Profile' },
    { id: 'settings' as TabId, icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-border/30 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col items-center justify-center gap-1
                min-w-[64px] min-h-[48px] px-3 py-2
                rounded-xl transition-all duration-200
                ${isActive 
                  ? 'text-accent bg-accent/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <tab.icon className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
