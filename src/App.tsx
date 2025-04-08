
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import SprintPlanning from "./pages/SprintPlanning";
import DailyStandups from "./pages/DailyStandups";
import SprintReviews from "./pages/SprintReviews";
import Retrospectives from "./pages/Retrospectives";
import Meetings from "./pages/Meetings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/planning" element={<ProtectedRoute><SprintPlanning /></ProtectedRoute>} />
            <Route path="/standups" element={<ProtectedRoute><DailyStandups /></ProtectedRoute>} />
            <Route path="/reviews" element={<ProtectedRoute><SprintReviews /></ProtectedRoute>} />
            <Route path="/retrospectives" element={<ProtectedRoute><Retrospectives /></ProtectedRoute>} />
            <Route path="/meetings" element={<ProtectedRoute><Meetings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
