import React, {
  useState,
  useEffect,
} from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Gauge,
  Activity,
  MapPin,
  Wrench,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import api from "../api/client";
import PumpFormModal from "../components/PumpFormModal";
import HealthScoreCard from "../components/HealthScoreCard";
import HealthDistributionChart from "../components/HealthDistributionChart";
import { getHealthStatus, noHealthStatus } from "../utils/healthStatus";

export default function ProjectDetail() {
  const { id } =
    useParams();
  const navigate =
    useNavigate();

  const [
    project,
    setProject,
  ] =
    useState(null);
  const [
    loading,
    setLoading,
  ] =
    useState(true);
  const [
    error,
    setError,
  ] =
    useState(null);
  const [
    isPumpModalOpen,
    setIsPumpModalOpen,
  ] =
    useState(false);

  useEffect(() => {
    fetchProjectDetail();
  }, [id]);

  const fetchProjectDetail =
    async () => {
      try {
        const res =
          await api.get(
            `/projects/${id}`,
          );
        setProject(
          res.data,
        );
      } catch (err) {
        console.error(
          "Fetch project detail error:",
          err,
        );
        setError(
          "Gagal memuat detail proyek.",
        );
      } finally {
        setLoading(
          false,
        );
      }
    };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
        Memuat
        detail
        proyek...
      </div>
    );
  }

  if (
    error ||
    !project
  ) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="text-rose-600 dark:text-rose-400 text-sm">
          {error ||
            "Proyek tidak ditemukan."}
        </div>
        <button
          onClick={() =>
            navigate(
              "/dashboard",
            )
          }
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          Kembali ke
          Dashboard
        </button>
      </div>
    );
  }

  const projectPumps = project.pumps || [];
  const pumpsWithReading = projectPumps.filter((pump) => pump.readings?.[0]);
  const criticalPumps = pumpsWithReading.filter((pump) => getHealthStatus(pump.readings[0].healthScore)?.key === "critical").length;
  const healthyPumps = pumpsWithReading.filter((pump) => ["excellent", "good"].includes(getHealthStatus(pump.readings[0].healthScore)?.key)).length;
  const projectHealth = project.stats.healthDataCount ? getHealthStatus(project.stats.avgHealthScore) : noHealthStatus;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Back Button & Header */}
      <div>
        <button
          onClick={() =>
            navigate(
              "/dashboard",
            )
          }
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            Kembali
            ke
            Dashboard
            Utama
          </span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {
                  project.name
                }
              </h1>
              {project.location && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md border border-slate-300 dark:border-slate-700">
                  <MapPin className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                  {
                    project.location
                  }
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-2xl">
              {project.description ||
                "Tidak ada deskripsi singkat proyek."}
            </p>
          </div>

          <button
            onClick={() =>
              setIsPumpModalOpen(
                true,
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-600/20 transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>
              Tambah
              Alat
              (Pompa)
              Baru
            </span>
          </button>
        </div>
      </div>

      {/* Project Statistics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-xl">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Total
              Alat
              Terpasang
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {
                project
                  .stats
                  .totalPumps
              }{" "}
              Unit
            </p>
          </div>
        </div>

        <div className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 flex items-center gap-4 shadow-sm ${projectHealth.panelClass}`}>
          <div className={`p-3.5 rounded-xl border ${projectHealth.badgeClass}`}>
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Rata-Rata
              Kesehatan
              Alat
            </p>
            <div className="flex items-baseline gap-2">
              <p className={`text-2xl font-bold ${projectHealth.textClass}`}>
                {
                  project
                    .stats
                    .healthDataCount ? project.stats.avgHealthScore : "—"
                }
              </p>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                /
                100
              </span>
            </div>
            <span className={`inline-flex mt-1 text-[10px] font-semibold px-2 py-0.5 rounded border ${projectHealth.badgeClass}`}>{projectHealth.label}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Status
              Operasional
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {
                project
                  .stats
                  .activePumps
              }{" "}
              Aktif
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Excellent & Good</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{healthyPumps} <span className="text-xs text-slate-500 font-medium">Unit</span></p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Critical</p>
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{criticalPumps} <span className="text-xs text-slate-500 font-medium">Unit</span></p>
          </div>
        </div>
      </div>

      <HealthDistributionChart pumps={projectPumps} title="Analisis Status Kesehatan Proyek" />

      {/* Pumps List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Daftar
              Peralatan
              (Pompa)
              Proyek
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Klik
              alat
              untuk
              melihat
              rincian
              spesifikasi
              &
              histori
              pembacaan
            </p>
          </div>
        </div>

        {project
          .pumps
          .length ===
        0 ? (
          <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
            <Gauge className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Belum
              Ada
              Alat
              di
              Proyek
              Ini
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-500 mt-1 max-w-sm mx-auto mb-4">
              Tambahkan
              pompa/alat
              pertama
              untuk
              proyek
              ini
              dengan
              mengklik
              tombol
              di
              bawah.
            </p>
            <button
              onClick={() =>
                setIsPumpModalOpen(
                  true,
                )
              }
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-xs font-semibold hover:bg-cyan-500 transition-colors"
            >
              Tambah
              Alat
              Baru
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.pumps.map(
              (
                pump,
              ) => {
                const latestReading =
                  pump.readings &&
                  pump
                    .readings[0];
                const score =
                  latestReading?.healthScore;
                const bepZone =
                  latestReading?.bepZone;

                return (
                  <div
                    key={
                      pump.id
                    }
                    onClick={() =>
                      navigate(
                        `/pumps/${pump.id}`,
                      )
                    }
                    className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 transition-all duration-200 cursor-pointer shadow-sm flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors text-base line-clamp-1">
                          {
                            pump.name
                          }
                        </h3>
                        <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {pump.description ||
                          "Tidak ada deskripsi lokasi/alat."}
                      </p>

                      {/* Specifications badges */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/60 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 mb-4">
                        <div>
                          <span className="text-[10px] text-slate-600 dark:text-slate-500 block">
                            Rated
                            Flow
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {
                              pump.ratedFlow
                            }{" "}
                            m³/h
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-600 dark:text-slate-500 block">
                            Rated
                            Head
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {
                              pump.ratedHead
                            }{" "}
                            m
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-600 dark:text-slate-500 block">
                            Rated
                            Power
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {
                              pump.ratedPower
                            }{" "}
                            kW
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-600 dark:text-slate-500 block">
                            Efisiensi
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {
                              pump.efficiency
                            }
                            %
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Health score summary card */}
                    <HealthScoreCard
                      score={
                        score
                      }
                      bepZone={
                        bepZone
                      }
                      issues={
                        latestReading?.issues
                      }
                    />
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>

      {/* Modal Form Tambah Alat */}
      <PumpFormModal
        isOpen={
          isPumpModalOpen
        }
        onClose={() =>
          setIsPumpModalOpen(
            false,
          )
        }
        defaultProjectId={
          project.id
        }
        projects={[
          project,
        ]}
        onSuccess={() =>
          fetchProjectDetail()
        }
      />
    </div>
  );
}
