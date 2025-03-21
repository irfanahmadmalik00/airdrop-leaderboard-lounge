
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { Suspense, lazy } from "react";
import Navbar from "@/components/Navbar";

// Lazy load pages to improve performance
const Index = lazy(() => import("./pages/Index"));
const Airdrops = lazy(() => import("./pages/Airdrops"));
const AirdropRanking = lazy(() => import("./pages/AirdropRanking"));
const Videos = lazy(() => import("./pages/Videos"));
const Testnets = lazy(() => import("./pages/Testnets"));
const Tools = lazy(() => import("./pages/Tools"));
const Login = lazy(() => import("./pages/Login"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Create a new QueryClient instance for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingSpinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-crypto-black">
    <Loader2 className="h-12 w-12 text-crypto-green animate-spin mb-4" />
    <p className="text-gray-400 animate-pulse">Loading iShowCrypto...</p>
  </div>
);

// Wrap component with Suspense for lazy loading
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <>
      <Navbar />
      <div className="pt-16 min-h-screen bg-crypto-black">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<SuspenseWrapper><Index /></SuspenseWrapper>} />
          <Route path="/airdrops" element={<SuspenseWrapper><Airdrops /></SuspenseWrapper>} />
          <Route path="/airdrops-ranking" element={<SuspenseWrapper><AirdropRanking /></SuspenseWrapper>} />
          <Route path="/videos" element={<SuspenseWrapper><Videos /></SuspenseWrapper>} />
          <Route path="/about" element={<SuspenseWrapper><AboutUs /></SuspenseWrapper>} />
          <Route path="/how-it-works" element={<SuspenseWrapper><HowItWorks /></SuspenseWrapper>} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <SuspenseWrapper><Login /></SuspenseWrapper>} />
          
          {/* Protected routes */}
          <Route path="/testnets" element={
            <SuspenseWrapper>
              <AuthenticatedRoute>
                <Testnets />
              </AuthenticatedRoute>
            </SuspenseWrapper>
          } />
          <Route path="/tools" element={
            <SuspenseWrapper>
              <AuthenticatedRoute>
                <Tools />
              </AuthenticatedRoute>
            </SuspenseWrapper>
          } />
          <Route path="/dashboard" element={
            <SuspenseWrapper>
              <AuthenticatedRoute>
                <UserDashboard />
              </AuthenticatedRoute>
            </SuspenseWrapper>
          } />
          <Route path="/admin" element={
            <SuspenseWrapper>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </SuspenseWrapper>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<SuspenseWrapper><NotFound /></SuspenseWrapper>} />
        </Routes>
      </div>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <AppRoutes />
            <Toaster />
            <Sonner position="top-right" />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
