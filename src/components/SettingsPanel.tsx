import { Moon, Sun, Volume2, VolumeX, Info } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";

const SettingsPanel = () => {
  const { theme, toggleTheme } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(true);

  const settings = [
    {
      id: 'theme',
      icon: theme === 'dark' ? Moon : Sun,
      label: 'Dark Mode',
      description: 'Toggle dark/light theme',
      action: (
        <button
          onClick={toggleTheme}
          className={`
            relative w-14 h-8 rounded-full transition-colors duration-300
            ${theme === 'dark' ? 'bg-accent' : 'bg-muted'}
          `}
        >
          <span
            className={`
              absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md
              transition-transform duration-300
              ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}
            `}
          />
        </button>
      ),
    },
    {
      id: 'sound',
      icon: soundEnabled ? Volume2 : VolumeX,
      label: 'Sound Effects',
      description: 'Toggle tap sounds',
      action: (
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`
            relative w-14 h-8 rounded-full transition-colors duration-300
            ${soundEnabled ? 'bg-accent' : 'bg-muted'}
          `}
        >
          <span
            className={`
              absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md
              transition-transform duration-300
              ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}
            `}
          />
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col px-6 py-8 space-y-6">
      <h2 className="text-xl font-bold text-foreground">Settings</h2>

      {/* Settings list */}
      <div className="space-y-3">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="glass-panel rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <setting.icon className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">{setting.label}</p>
                <p className="text-xs text-muted-foreground">{setting.description}</p>
              </div>
            </div>
            {setting.action}
          </div>
        ))}
      </div>

      {/* App info */}
      <div className="mt-auto pt-6 space-y-4">
        <div className="glass-panel rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Info className="w-5 h-5 text-accent" />
            <span className="font-medium text-foreground">About VibeTap</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            VibeTap is an on-chain tapping game on Base. Tap to earn points, save your score to the blockchain, and compete on the global leaderboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
