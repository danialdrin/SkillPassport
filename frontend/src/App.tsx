import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { SpaceProvider } from './context/SpaceContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { SearchPage } from './pages/Search';
import { ResourceDetail } from './pages/ResourceDetail';
import { QuizPage } from './pages/Quiz';
import { InterviewPage } from './pages/Interview';
import { SkillGraphPage } from './pages/SkillGraph';
import { PassportPage } from './pages/Passport';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 mins
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SpaceProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Workspace Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/search"
                  element={
                    <ProtectedRoute>
                      <SearchPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resources/:id"
                  element={
                    <ProtectedRoute>
                      <ResourceDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz/:resourceId"
                  element={
                    <ProtectedRoute>
                      <QuizPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/interview/:resourceId"
                  element={
                    <ProtectedRoute>
                      <InterviewPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/skill-graph"
                  element={
                    <ProtectedRoute>
                      <SkillGraphPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/passport"
                  element={
                    <ProtectedRoute>
                      <PassportPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </SpaceProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
