import { useState } from "react";
import { ChevronDown, Crown, Medal, Award, Users } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar?: string;
  score: number;
}

interface LeaderboardPanelProps {
  entries: LeaderboardEntry[];
  currentUserRank?: number;
}

const LeaderboardPanel = ({ entries, currentUserRank }: LeaderboardPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-game-gold" />;
      case 2:
        return <Medal className="w-5 h-5 text-game-silver" />;
      case 3:
        return <Award className="w-5 h-5 text-game-bronze" />;
      default:
        return (
          <span className="w-5 h-5 text-center text-muted-foreground text-sm font-medium flex items-center justify-center">
            {rank}
          </span>
        );
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'rank-gold';
      case 2:
        return 'rank-silver';
      case 3:
        return 'rank-bronze';
      default:
        return 'text-foreground';
    }
  };

  const formatScore = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const generateAvatar = (username: string) => {
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-accent" />
          <h2 className="font-semibold text-foreground">Leaderboard</h2>
          <span className="text-sm text-muted-foreground">
            ({entries.length})
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-muted/50 transition-colors"
        >
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
              }`}
          />
        </button>
      </div>

      {/* List */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isExpanded ? '' : 'hidden'}`}>
        <div className="space-y-2 px-4 pb-4">
          {entries.map((entry) => (
            <div
              key={entry.rank}
              className={`
                glass-panel rounded-2xl p-3 flex items-center gap-3
                transition-all duration-200 hover:bg-white/10
                ${currentUserRank === entry.rank ? 'border-2 border-accent bg-accent/10' : 'border-2 border-transparent'}
              `}
            >
              {/* Rank */}
              <div className="w-8 flex justify-center">
                {getRankIcon(entry.rank)}
              </div>

              {/* Avatar */}
              <img
                src={entry.avatar || generateAvatar(entry.username)}
                alt={entry.username}
                className="w-10 h-10 rounded-full border-2 border-border/50"
              />

              {/* User info */}
              <div className="flex-1 min-w-0">
                <span className={`font-medium truncate block ${getRankStyle(entry.rank)}`}>
                  {entry.username}
                </span>
              </div>

              {/* Score */}
              <div className="text-right">
                <span className="font-bold text-foreground text-lg">
                  {formatScore(entry.score)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Current user indicator if not visible */}
        {currentUserRank && currentUserRank > entries.length && (
          <div className="px-4 pb-4">
            <div className="glass-panel rounded-2xl p-3 text-center text-sm text-muted-foreground border border-accent/30">
              Your rank: <span className="font-bold text-accent">#{currentUserRank}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPanel;
