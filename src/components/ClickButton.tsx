import { useState } from "react";
import { Zap } from "lucide-react";

interface ClickButtonProps {
  onClick: () => void;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface FloatingPoint {
  id: number;
  x: number;
  y: number;
}

const ClickButton = ({ onClick }: ClickButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [floatingPoints, setFloatingPoints] = useState<FloatingPoint[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    let x: number, y: number;
    
    if ('touches' in e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const touch = e.touches[0] || e.changedTouches[0];
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    // Add ripple effect
    const rippleId = Date.now();
    setRipples(prev => [...prev, { id: rippleId, x, y }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 600);

    // Add floating +1 point
    const pointId = Date.now() + Math.random();
    const randomX = x + (Math.random() - 0.5) * 60;
    setFloatingPoints(prev => [...prev, { id: pointId, x: randomX, y }]);
    setTimeout(() => {
      setFloatingPoints(prev => prev.filter(p => p.id !== pointId));
    }, 600);

    // Trigger press animation
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);

    onClick();
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings */}
      <div className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full bg-accent/5 animate-pulse" />
      <div className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full bg-accent/10 animate-pulse-glow" />
      
      {/* Main button - 44px+ touch target, actually much larger */}
      <button
        onClick={handleClick}
        className={`
          relative w-48 h-48 md:w-64 md:h-64 rounded-full
          bg-gradient-to-br from-accent via-primary to-secondary
          glow-button
          flex items-center justify-center
          cursor-pointer select-none touch-manipulation
          transition-all duration-100 ease-out
          hover:scale-105
          active:scale-95
          overflow-hidden
          ${isPressed ? 'scale-95' : 'animate-pulse-glow'}
        `}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {/* Inner gradient overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-transparent to-white/20" />
        
        {/* Inner highlight */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
        
        {/* Icon */}
        <Zap className="w-20 h-20 md:w-28 md:h-28 text-background drop-shadow-lg z-10" fill="currentColor" />
        
        {/* Ripple effects */}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute w-4 h-4 bg-white/50 rounded-full ripple-effect pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </button>

      {/* Floating +1 points */}
      {floatingPoints.map(point => (
        <span
          key={point.id}
          className="absolute text-3xl font-bold text-white drop-shadow-lg pointer-events-none animate-fade-up"
          style={{
            left: `calc(50% + ${point.x - 96}px)`,
            top: `calc(50% + ${point.y - 96}px)`,
          }}
        >
          +1
        </span>
      ))}
    </div>
  );
};

export default ClickButton;
