import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/spinner";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Findings from "./pages/Findings";
import Policies from "./pages/Policies";
import Evidence from "./pages/Evidence";
import IntegrationsDetailed from "./pages/IntegrationsDetailed";
import Documentation from "./pages/Documentation";
import NotFound from "./pages/NotFound";
import HeroSection from "./components/HeroSection";

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Toaster />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <HeroSection />} />
        <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" replace />} />
        <Route path="/findings" element={user ? <Findings /> : <Navigate to="/auth" replace />} />
        <Route path="/policies" element={user ? <Policies /> : <Navigate to="/auth" replace />} />
        <Route path="/evidence" element={user ? <Evidence /> : <Navigate to="/auth" replace />} />
        <Route path="/integrations" element={user ? <IntegrationsDetailed /> : <Navigate to="/auth" replace />} />
        <Route path="/documentation" element={user ? <Documentation /> : <Navigate to="/auth" replace />} />
        
        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  );
};

export default App;