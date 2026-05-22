import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HelmetProvider } from "react-helmet-async";
import "./i18n";

import { StartupTerminal } from "./components/StartupTerminal";
import { ExecutiveDashboard } from "./pages/ExecutiveDashboard";
import { PublicLayout } from "./components/PublicLayout";
import { LandingPage } from "./pages/LandingPage";
import { ServicesPage } from "./pages/ServicesPage";
import { ContactPage } from "./pages/ContactPage";

import { AboutPage } from "./pages/AboutPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsPage } from "./pages/TermsPage";
import { CareersPage } from "./pages/CareersPage";
import { BlogPage } from "./pages/BlogPage";

export default function App() {
  const { i18n } = useTranslation();
  const [authorized, setAuthorized] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [sessionKey, setSessionKey] = useState<string | null>(null);

  const handleAccessGranted = (key: string, role: string, name: string) => {
    setSessionKey(key);
    setUserRole(role);
    setUserName(name);
    setAuthorized(true);
  };

  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white dark:bg-[#0D0F12]">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="portfolio" element={<PortfolioPage />} />
              <Route path="projects" element={<PortfolioPage />} /> {/* Reusing for now */}
              <Route path="blog" element={<BlogPage />} />
              <Route path="careers" element={<CareersPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="privacy" element={<PrivacyPolicyPage />} />
              <Route path="terms" element={<TermsPage />} />
            </Route>
  
            {/* Terminal / Login */}
            <Route 
              path="/terminal" 
              element={
                authorized ? (
                  <Navigate to="/executive" replace />
                ) : (
                  <StartupTerminal onAccessGranted={handleAccessGranted} />
                )
              } 
            />
  
            {/* Protected Executive Routes */}
            <Route 
              path="/executive" 
              element={
                authorized ? (
                  <ExecutiveDashboard 
                    role={userRole || "CEO"} 
                    userName={userName || "Authorized Personnel"}
                    sessionKey={sessionKey || ""}
                    onLogout={() => {
                      setAuthorized(false);
                      setSessionKey(null);
                      setUserRole(null);
                      setUserName(null);
                    }} 
                  />
                ) : (
                  <Navigate to="/terminal" replace />
                )
              } 
            />
  
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}
