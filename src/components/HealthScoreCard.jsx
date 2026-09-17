import React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { getHealthStatus, noHealthStatus } from "../utils/healthStatus";

export default function HealthScoreCard({
  score,
  bepZone,
  issues = [],
}) {
  const getZoneLabel =
    (zone) => {
      switch (
        zone
      ) {
        case "optimal":
          return {
            label:
              "BEP Optimal (70% - 120%)",
            color:
              "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          };
        case "acceptable-low":
          return {
            label:
              "BEP Underflow (Rendah)",
            color:
              "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
          };
        case "acceptable-high":
          return {
            label:
              "BEP Overflow (Tinggi)",
            color:
              "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
          };
        case "danger":
          return {
            label:
              "Di Luar Zona Operasi",
            color:
              "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
          };
        default:
          return {
            label:
              "Belum Ada Data",
            color:
              "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700",
          };
      }
    };

  const healthStatus = getHealthStatus(score) || noHealthStatus;
  const zoneStyle =
    getZoneLabel(
      bepZone,
    );

  return (
    <div
      className={`p-4 rounded-xl border ${healthStatus.panelClass} transition-all`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Skor
          Kesehatan
          Alat
        </span>
        {score == null ? <ShieldAlert className="w-5 h-5 text-slate-400" /> : score >=
        80 ? (
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        ) : score >=
          60 ? (
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        ) : (
          <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span
          className={`text-3xl font-bold tracking-tight ${healthStatus.textClass}`}
        >
          {score !=
          null
            ? score
            : "--"}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          / 100
        </span>
      </div>

      <div className="mt-2">
        <span className={`inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-md border ${healthStatus.badgeClass}`}>
          {healthStatus.label}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span
          className={`text-[11px] font-medium px-2.5 py-1 rounded-md border ${zoneStyle.color}`}
        >
          {
            zoneStyle.label
          }
        </span>
      </div>

      {issues &&
        issues.length >
          0 && (
          <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1">
            <p className="text-[10px] uppercase font-semibold text-rose-600 dark:text-rose-400 tracking-wider">
              Potensi
              Masalah:
            </p>
            {issues.map(
              (
                issue,
                idx,
              ) => (
                <p
                  key={
                    idx
                  }
                  className="text-xs text-rose-500 dark:text-rose-300 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                  {
                    issue
                  }
                </p>
              ),
            )}
          </div>
        )}
    </div>
  );
}
