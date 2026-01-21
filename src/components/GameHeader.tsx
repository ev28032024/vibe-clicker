import { Sparkles } from "lucide-react";

const GameHeader = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Sparkles className="w-6 h-6 text-accent animate-pulse" />
      <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
        VibeTap
      </h1>
      <Sparkles className="w-6 h-6 text-accent animate-pulse" />
    </div>
  );
};

export default GameHeader;
