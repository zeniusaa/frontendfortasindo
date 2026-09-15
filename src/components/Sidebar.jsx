import React from "react";
import {
  NavLink,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Gauge,
  LogOut,
  Activity,
  User,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar() {
  const {
    user,
    logout,
  } = useAuth();
  const {
    theme,
    toggleTheme,
  } = useTheme();
  const navigate =
    useNavigate();

  const handleLogout =
    () => {
      logout();
      navigate(
        "/login",
      );
    };

  const navItems = [
    {
      to: "/dashboard",
      label:
        "Dashboard Utama",
      icon: LayoutDashboard,
    },
    {
      to: "/projects",
      label:
        "Daftar Proyek",
      icon: FolderKanban,
    },
    {
      to: "/pumps",
      label:
        "Semua Alat (Pump)",
      icon: Gauge,
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-30 transition-colors duration-200">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20 text-white">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-slate-100 tracking-wide leading-tight">
                PUMP
                HEALTH
              </h1>
              <p className="text-xs text-cyan-500 font-medium">
                Smart
                Monitoring
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5">
          <p className="px-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Navigasi
            Utama
          </p>
          {navItems.map(
            (
              item,
            ) => {
              const Icon =
                item.icon;
              return (
                <NavLink
                  key={
                    item.to
                  }
                  to={
                    item.to
                  }
                  className={({
                    isActive,
                  }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>
                    {
                      item.label
                    }
                  </span>
                </NavLink>
              );
            },
          )}
        </nav>
      </div>

      {/* Bottom Control Section (Theme Toggle + User Info + Logout) */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        {/* Theme Mode Toggle Button */}
        <button
          onClick={
            toggleTheme
          }
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:border-cyan-500/40 transition-all"
        >
          <div className="flex items-center gap-2">
            {theme ===
            "dark" ? (
              <Moon className="w-4 h-4 text-cyan-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            <span>
              {theme ===
              "dark"
                ? "Mode Gelap"
                : "Mode Terang"}
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold uppercase">
            {theme}
          </span>
        </button>

        {/* User Profile Card */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <User className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {user?.name ||
                  "Engineer"}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize truncate">
                {user?.role ||
                  "User"}
              </p>
            </div>
          </div>
          <button
            onClick={
              handleLogout
            }
            title="Keluar / Logout"
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
