import React, {
  useState,
} from "react";
import {
  NavLink,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Gauge,
  LogOut,
  User,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar() {
  const [
    isCollapsed,
    setIsCollapsed,
  ] = useState(
    () =>
      localStorage.getItem(
        "sidebar-collapsed",
      ) === "true",
  );
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

  const toggleSidebar =
    () => {
      setIsCollapsed(
        (
          current,
        ) => {
          localStorage.setItem(
            "sidebar-collapsed",
            String(
              !current,
            ),
          );
          return !current;
        },
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
    <aside
      className={`${isCollapsed ? "w-20" : "w-64"} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-30 transition-[width,colors] duration-300 ease-in-out`}
    >
      <div>
        {/* Brand Header */}
        <div
          className={`${isCollapsed ? "p-5" : "p-4"} border-b border-slate-200 dark:border-slate-800`}
        >
          <button
            onClick={
              toggleSidebar
            }
            title={
              isCollapsed
                ? "Buka navbar"
                : "Tutup navbar"
            }
            aria-label={
              isCollapsed
                ? "Buka navbar"
                : "Tutup navbar"
            }
            className="block w-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            <img
              src={
                isCollapsed
                  ? "/brand/fortasindo-mark.png"
                  : "/brand/fortasindo-logo-horizontal.png"
              }
              alt="Fortasindo"
              className={
                isCollapsed
                  ? "mx-auto h-12 w-12 object-contain"
                  : "h-24 w-full object-contain opacity-100"
              }
            />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav
          className={`${isCollapsed ? "p-3 mt-2" : "p-4"} space-y-1.5`}
        >
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Navigasi
              Utama
            </p>
          )}
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
                  title={
                    isCollapsed
                      ? item.label
                      : undefined
                  }
                  className={({
                    isActive,
                  }) =>
                    `flex items-center ${isCollapsed ? "justify-center px-2.5" : "gap-3 px-3.5"} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {!isCollapsed && (
                    <span>
                      {
                        item.label
                      }
                    </span>
                  )}
                </NavLink>
              );
            },
          )}
        </nav>
      </div>

      {/* Bottom Control Section (Theme Toggle + User Info + Logout) */}
      <div
        className={`${isCollapsed ? "p-3" : "p-4"} border-t border-slate-200 dark:border-slate-800 space-y-3`}
      >
        {/* Theme Mode Toggle Button */}
        <button
          onClick={
            toggleTheme
          }
          title={
            isCollapsed
              ? theme ===
                "dark"
                ? "Mode Gelap"
                : "Mode Terang"
              : undefined
          }
          className={`w-full flex items-center ${isCollapsed ? "justify-center px-2" : "justify-between px-3.5"} py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:border-cyan-500/40 transition-all`}
        >
          <div className="flex items-center gap-2">
            {theme ===
            "dark" ? (
              <Moon className="w-4 h-4 text-cyan-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            {!isCollapsed && (
              <span>
                {theme ===
                "dark"
                  ? "Mode Gelap"
                  : "Mode Terang"}
              </span>
            )}
          </div>
          {!isCollapsed && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold uppercase">
              {
                theme
              }
            </span>
          )}
        </button>

        {/* User Profile Card */}
        <div
          className={`flex items-center ${isCollapsed ? "justify-center p-1" : "justify-between p-2.5"} rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <User className="w-4 h-4" />
            </div>
            {!isCollapsed && (
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
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={
                handleLogout
              }
              title="Keluar / Logout"
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
