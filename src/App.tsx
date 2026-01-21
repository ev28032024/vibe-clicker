import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { config, targetChain } from "@/lib/wagmi";
import { AuthProvider } from "@/contexts/AuthContext";
import { FarcasterProvider } from "@/contexts/FarcasterContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <OnchainKitProvider chain={targetChain}>
        <FarcasterProvider>
          <ThemeProvider>
            <AuthProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </AuthProvider>
          </ThemeProvider>
        </FarcasterProvider>
      </OnchainKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
