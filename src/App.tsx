
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SprintPlanning from "./pages/SprintPlanning";
import DailyStandups from "./pages/DailyStandups";
import SprintReviews from "./pages/SprintReviews";
import Retrospectives from "./pages/Retrospectives";
import Meetings from "./pages/Meetings";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/planning" element={<SprintPlanning />} />
          <Route path="/standups" element={<DailyStandups />} />
          <Route path="/reviews" element={<SprintReviews />} />
          <Route path="/retrospectives" element={<Retrospectives />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
