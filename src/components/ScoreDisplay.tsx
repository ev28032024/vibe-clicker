import { useEffect, useState } from "react";

interface ScoreDisplayProps {
  score: number;
  totalClicks: number;
}

const ScoreDisplay = ({ score, totalClicks }: ScoreDisplayProps) => {
  const [displayScore, setDisplayScore] = useState(score);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (score !== displayScore) {
      setIsAnimating(true);
      setDisplayScore(score);
      const timer = setTimeout(() => setIsAnimating(false), 250);
      return () => clearTimeout(timer);
    }
  }, [score, displayScore]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className="text-center space-y-2">
      {/* Main score */}
      <div className="relative">
        <h2
          className={`text-6xl md:text-8xl font-bold score-text ${isAnimating ? 'animate-score-pop' : ''}`}
        >
          {formatNumber(displayScore)}
        </h2>
      </div>
      
      {/* Points label */}
      <p className="text-lg text-muted-foreground font-medium">
        points
      </p>

      {/* Stats row */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="glass-panel rounded-full px-4 py-2">
          <span className="text-sm text-muted-foreground">
            Taps: <span className="font-semibold text-foreground">{totalClicks.toLocaleString()}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
