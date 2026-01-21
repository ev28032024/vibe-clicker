import { useState } from "react";
import { ChevronUp, ChevronDown, Crown, Medal, Award, Users } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  platform: 'base' | 'farcaster';
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserRank?: number;
}

const Leaderboard = ({ entries, currentUserRank }: LeaderboardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-game-gold" />;
      case 2:
        return <Medal className="w-5 h-5 text-game-silver" />;
      case 3:
        return <Award className="w-5 h-5 text-game-bronze" />;
      default:
        return <span className="w-5 h-5 text-center text-muted-foreground text-sm font-medium">{rank}</span>;
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

  const getPlatformBadge = (platform: 'base' | 'farcaster') => {
    return platform === 'base' ? (
      <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
        Base
      </span>
    ) : (
      <span className="px-2 py-0.5 text-xs rounded-full bg-secondary/20 text-secondary">
        Farcaster
      </span>
    );
  };

  const formatScore = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const displayedEntries = isExpanded ? entries : entries.slice(0, 5);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full glass-panel rounded-t-2xl px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-accent" />
          <span className="font-semibold text-foreground">Leaderboard</span>
          <span className="text-sm text-muted-foreground">
            ({entries.length} players)
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {/* Entries */}
      <div className={`
        glass-panel rounded-b-2xl overflow-hidden
        transition-all duration-300 ease-out
        ${isExpanded ? 'max-h-[400px] overflow-y-auto' : 'max-h-[280px]'}
      `}>
        {displayedEntries.map((entry, index) => (
          <div
            key={entry.rank}
            className={`
              flex items-center gap-3 px-4 py-3
              ${index !== displayedEntries.length - 1 ? 'border-b border-white/5' : ''}
              ${currentUserRank === entry.rank ? 'bg-accent/10' : 'hover:bg-white/5'}
              transition-colors
            `}
          >
            {/* Rank */}
            <div className="w-8 flex justify-center">
              {getRankIcon(entry.rank)}
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-medium truncate ${getRankStyle(entry.rank)}`}>
                  {entry.username}
                </span>
                {getPlatformBadge(entry.platform)}
              </div>
            </div>

            {/* Score */}
            <div className="text-right">
              <span className="font-bold text-foreground">
                {formatScore(entry.score)}
              </span>
            </div>
          </div>
        ))}

        {/* Current user indicator if not in top */}
        {currentUserRank && currentUserRank > 5 && !isExpanded && (
          <div className="px-4 py-2 text-center text-sm text-muted-foreground border-t border-white/5">
            Your rank: #{currentUserRank}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
