
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";

// Page imports
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NewRequestPage from "./pages/NewRequestPage";
import RequestsPage from "./pages/RequestsPage";
import ResourceMapPage from "./pages/NGO/ResourceMapPage";
import DashboardPage from "./pages/NGO/DashboardPage";
import DisasterDetectionPage from "./pages/DisasterDetectionPage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/requests/new" element={<NewRequestPage />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/ngo/map" element={<ResourceMapPage />} />
            <Route path="/ngo/dashboard" element={<DashboardPage />} />
            <Route path="/disasters" element={<DisasterDetectionPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
