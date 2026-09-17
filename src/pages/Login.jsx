import React, {
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [
    email,
    setEmail,
  ] = useState(
    "admin@pump.com",
  );
  const [
    password,
    setPassword,
  ] = useState(
    "admin123",
  );
  const [
    loading,
    setLoading,
  ] =
    useState(false);
  const [
    error,
    setError,
  ] =
    useState(null);

  const { login } =
    useAuth();
  const navigate =
    useNavigate();

  const handleSubmit =
    async (e) => {
      e.preventDefault();
      setLoading(
        true,
      );
      setError(
        null,
      );

      try {
        await login(
          email,
          password,
        );
        navigate(
          "/dashboard",
        );
      } catch (err) {
        setError(
          err
            .response
            ?.data
            ?.error ||
            "Login gagal. Periksa kembali email & password.",
        );
      } finally {
        setLoading(
          false,
        );
      }
    };

  return (
    <div className="min-h-screen brand-login-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="h-[180px] flex items-center justify-center">
            <img
              src="/brand/fortasindo-logo-horizontal.png"
              alt="Fortasindo"
              className="h-[256px] w-full object-contain"
            />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Pump
            Monitoring
            System
          </h1>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Masuk
            untuk
            mengelola
            &
            memantau
            kesehatan
            alat
            pompa
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2">
            <span>
              ⚠️
            </span>
            <span>
              {
                error
              }
            </span>
          </div>
        )}

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-5"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email
              *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-600 dark:text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={
                  email
                }
                onChange={(
                  e,
                ) =>
                  setEmail(
                    e
                      .target
                      .value,
                  )
                }
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Password
              *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-600 dark:text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={
                  password
                }
                onChange={(
                  e,
                ) =>
                  setPassword(
                    e
                      .target
                      .value,
                  )
                }
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={
              loading
            }
            className="w-full py-3 brand-gradient text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-cyan-600/25 hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              "Memproses..."
            ) : (
              <>
                <span>
                  Masuk
                  ke
                  System
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-600 dark:text-slate-500">
            Akun
            Default
            (Demo):{" "}
            <span className="text-cyan-600 dark:text-cyan-400 font-mono">
              admin@pump.com
            </span>{" "}
            /{" "}
            <span className="text-cyan-600 dark:text-cyan-400 font-mono">
              admin123
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
