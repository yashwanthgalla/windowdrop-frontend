import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/ui/Navbar';
import { ToastContainer } from './components/ui/Toast';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useThemeStore } from './store/useThemeStore';
import { useAuthStore } from './store/useAuthStore';

export const App: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  const { initAuthListener } = useAuthStore();

  // Initialize 30-minute session recovery and auth listener
  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, [initAuthListener]);

  // Listen to OS prefers-color-scheme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const hasStored = localStorage.getItem('dropcode-theme');
      if (!hasStored) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme]);

  // Keep documentElement class synchronized with store
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7] transition-colors duration-200 flex flex-col font-sans">
        {/* Apple glass navbar */}
        <Navbar />

        {/* Global Toast System */}
        <ToastContainer />

        {/* Main Content Area - Full Page Width */}
        <div className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/plan" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
