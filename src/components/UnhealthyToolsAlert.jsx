import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  AlertTriangle,
  Wrench,
  ChevronRight,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { getRecommendedActions } from "../utils/recommendations";

export default function UnhealthyToolsAlert({
  pumps = [],
}) {
  const navigate =
    useNavigate();

  // Filter pumps with healthScore < 80 or having active issues in latest reading
  const unhealthyPumps =
    pumps.filter(
      (pump) => {
        const latestReading =
          pump.readings &&
          pump
            .readings[0];
        if (
          !latestReading
        )
          return false;
        const score =
          latestReading.healthScore;
        const issues =
          latestReading.issues ||
          [];
        return (
          (score !=
            null &&
            score <
              80) ||
          issues.length >
            0 ||
          latestReading.bepZone ===
            "danger"
        );
      },
    );

  if (
    unhealthyPumps.length ===
    0
  ) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4">
        <div className="p-3 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-emerald-500 dark:text-emerald-300">
            Seluruh
            Alat
            dalam
            Kondisi
            Optimal!
          </h3>
          <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
            Tidak
            terdeteksi
            adanya
            gangguan
            kavitasi,
            vibrasi
            tinggi,
            atau
            efisiensi
            rendah
            pada
            pompa
            aktif.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Alert Header Banner */}
      <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-rose-400 dark:text-rose-200">
              Perhatian:
              Terdeteksi{" "}
              {
                unhealthyPumps.length
              }{" "}
              Alat
              Perlu
              Perbaikan!
            </h2>
            <p className="text-xs text-rose-600/80 dark:text-rose-300/80 mt-0.5">
              Daftar
              pompa
              dengan
              skor
              kesehatan
              di
              bawah
              ambang
              batas
              aman
              (skor
              &lt;
              80)
              beserta
              rekomendasi
              perbaikannya.
            </p>
          </div>
        </div>
      </div>

      {/* Unhealthy Pumps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {unhealthyPumps.map(
          (
            pump,
          ) => {
            const latestReading =
              pump
                .readings[0];
            const score =
              latestReading.healthScore;
            const issues =
              latestReading.issues ||
              [];
            const recommendations =
              getRecommendedActions(
                issues,
                latestReading.bepZone,
                score,
              );

            const isCritical =
              score !=
                null &&
              score <
                60;

            return (
              <div
                key={
                  pump.id
                }
                className={`bg-white dark:bg-slate-900 border ${
                  isCritical
                    ? "border-rose-500/40 shadow-rose-500/5"
                    : "border-amber-500/40 shadow-amber-500/5"
                } rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4`}
              >
                {/* Pump Header Info */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                        <AlertTriangle
                          className={`w-4 h-4 ${isCritical ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400"}`}
                        />
                        {
                          pump.name
                        }
                      </h3>
                      {pump.project && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-cyan-600 dark:text-cyan-400 mt-1">
                          <Layers className="w-3 h-3" />
                          Proyek:{" "}
                          {
                            pump
                              .project
                              .name
                          }
                        </span>
                      )}
                    </div>

                    {/* Health Score Badge */}
                    <div
                      className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                        isCritical
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      }`}
                    >
                      Skor:{" "}
                      {
                        score
                      }{" "}
                      /
                      100
                    </div>
                  </div>

                  {/* Identified Issues */}
                  {issues.length >
                    0 && (
                    <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <p className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                        Masalah
                        Terdeteksi:
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
                            className="text-xs text-rose-500 dark:text-rose-300 flex items-start gap-1.5 leading-snug"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1 shrink-0" />
                            <span>
                              {
                                issue
                              }
                            </span>
                          </p>
                        ),
                      )}
                    </div>
                  )}

                  {/* Recommendations Section */}
                  <div className="mt-3.5 space-y-2">
                    <p className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <Wrench className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      Rekomendasi
                      Tindakan
                      Perbaikan:
                    </p>
                    {recommendations.map(
                      (
                        rec,
                        idx,
                      ) => (
                        <div
                          key={
                            idx
                          }
                          className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-cyan-500 dark:text-cyan-300">
                              {
                                rec.category
                              }
                            </span>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                                rec.priority ===
                                "Tinggi"
                                  ? "bg-rose-500/20 text-rose-500 dark:text-rose-300 border border-rose-500/30"
                                  : "bg-amber-500/20 text-amber-500 dark:text-amber-300 border border-amber-500/30"
                              }`}
                            >
                              Prioritas:{" "}
                              {
                                rec.priority
                              }
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                            {
                              rec.action
                            }
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Action Link Button */}
                <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-end">
                  <button
                    onClick={() =>
                      navigate(
                        `/pumps/${pump.id}`,
                      )
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors"
                  >
                    <span>
                      Buka
                      Full
                      Detail
                      &
                      Update
                      Alat
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}
