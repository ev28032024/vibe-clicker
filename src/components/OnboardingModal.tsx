import { useState } from "react";
import { Zap, Trophy, Users, Wallet, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

const OnboardingModal = ({ open, onComplete }: OnboardingModalProps) => {
  const [step, setStep] = useState(0);
  const { connectWallet, isConnecting, isConnected } = useAuth();

  const steps = [
    {
      icon: Zap,
      title: "Tap to Earn",
      description: "Every tap earns you points. The more you tap, the higher you climb on the leaderboard!",
      color: "text-accent",
    },
    {
      icon: Trophy,
      title: "Compete Globally",
      description: "Challenge players worldwide. Rise through the ranks and become the ultimate tapper!",
      color: "text-game-gold",
    },
    {
      icon: Users,
      title: "Build Community",
      description: "Connect with other players, share your progress, and celebrate achievements together.",
      color: "text-secondary",
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setStep(steps.length); // Move to wallet connect step
    }
  };

  const handleConnect = async () => {
    await connectWallet();
    if (isConnected) {
      onComplete();
    }
  };

  // Auto-complete after wallet connection
  if (isConnected && step === steps.length) {
    setTimeout(onComplete, 500);
  }

  const currentStep = steps[step];
  const isWalletStep = step >= steps.length;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md glass-panel border-border/50 p-0 overflow-hidden">
        {/* Progress indicator */}
        <div className="flex gap-1.5 px-6 pt-6">
          {[...steps, { title: 'Connect' }].map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                i <= step ? 'bg-accent' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <DialogHeader className="px-6 pt-4">
          <DialogTitle className="sr-only">
            {isWalletStep ? 'Connect Wallet' : currentStep.title}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-8">
          {!isWalletStep ? (
            <div className="text-center space-y-6">
              {/* Icon */}
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 bg-accent/20 rounded-full animate-pulse" />
                <currentStep.icon className={`w-12 h-12 ${currentStep.color}`} />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-foreground">
                  {currentStep.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {currentStep.description}
                </p>
              </div>

              {/* Next button */}
              <button
                onClick={handleNext}
                className="w-full min-h-[48px] rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                {step === steps.length - 1 ? (
                  <>
                    Get Started
                    <Sparkles className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              {/* Wallet icon */}
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
                <Wallet className="w-12 h-12 text-primary" />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-foreground">
                  Connect Your Wallet
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Connect your wallet to save your progress and compete on the global leaderboard.
                </p>
              </div>

              {/* Connect button */}
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full min-h-[48px] rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70"
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

              {/* Skip option */}
              <button
                onClick={onComplete}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip for now
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
