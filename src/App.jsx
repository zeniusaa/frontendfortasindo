import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";
import PumpsList from "./pages/PumpsList";
import ProjectsList from "./pages/ProjectsList";
import PumpDetail from "./pages/PumpDetail";

// Protected Layout with Left Sidebar
function ProtectedLayout() {
  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Memuat
        aplikasi...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Navbar / Navigation Sidebar on the Left */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <Routes>
          <Route
            path="/dashboard"
            element={
              <Dashboard />
            }
          />
          <Route
            path="/projects"
            element={
              <ProjectsList />
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProjectDetail />
            }
          />
          <Route
            path="/pumps"
            element={
              <PumpsList />
            }
          />
          <Route
            path="/pumps/:id"
            element={
              <PumpDetail />
            }
          />
          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={
                <Login />
              }
            />
            <Route
              path="/*"
              element={
                <ProtectedLayout />
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
