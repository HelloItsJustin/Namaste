import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useWorkerStore } from './store/useStore';
import SplashScreen from './components/ui/SplashScreen';

// Worker Pages
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import CredentialsPage from './pages/CredentialsPage';
import ZKProofPage from './pages/ZKProofPage';
import WalletPage from './pages/WalletPage';
import VouchingPage from './pages/VouchingPage';
import SettingsPage from './pages/SettingsPage';

// Lender Pages
import LenderDashboard from './pages/lender/LenderDashboard';
import LenderVerifyPage from './pages/lender/LenderVerifyPage';
import LenderReportsPage from './pages/lender/LenderReportsPage';

// Admin Pages
import AdminWorkersPage from './pages/admin/AdminWorkersPage';
import AdminContractsPage from './pages/admin/AdminContractsPage';
import AdminTrustScorePage from './pages/admin/AdminTrustScorePage';

function App() {
  const { isOnboarded } = useWorkerStore();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <Routes>
        {/* Public / Onboarding */}
        <Route 
          path="/onboarding" 
          element={!isOnboarded ? <OnboardingPage /> : <Navigate to="/dashboard" />} 
        />

        {/* Worker Routes */}
        <Route 
          path="/dashboard" 
          element={isOnboarded ? <DashboardPage /> : <Navigate to="/onboarding" />} 
        />
        <Route 
          path="/credentials" 
          element={isOnboarded ? <CredentialsPage /> : <Navigate to="/onboarding" />} 
        />
        <Route 
          path="/zkproof" 
          element={isOnboarded ? <ZKProofPage /> : <Navigate to="/onboarding" />} 
        />
        <Route 
          path="/wallet" 
          element={isOnboarded ? <WalletPage /> : <Navigate to="/onboarding" />} 
        />
        <Route 
          path="/vouching" 
          element={isOnboarded ? <VouchingPage /> : <Navigate to="/onboarding" />} 
        />
        <Route 
          path="/settings" 
          element={isOnboarded ? <SettingsPage /> : <Navigate to="/onboarding" />} 
        />

        {/* Lender Routes */}
        <Route path="/lender/dashboard" element={<LenderDashboard />} />
        <Route path="/lender/verify" element={<LenderVerifyPage />} />
        <Route path="/lender/reports" element={<LenderReportsPage />} />

        {/* Admin Routes */}
        <Route path="/admin/workers" element={<AdminWorkersPage />} />
        <Route path="/admin/contracts" element={<AdminContractsPage />} />
        <Route path="/admin/trustscore" element={<AdminTrustScorePage />} />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to={isOnboarded ? "/dashboard" : "/onboarding"} />} />
      </Routes>
    </Router>
  );
}

export default App;
