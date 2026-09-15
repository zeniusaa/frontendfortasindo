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
  Edit3,
  Activity,
  Gauge,
  Wrench,
  ShieldAlert,
  Calendar,
  Info,
  Layers,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import api from "../api/client";
import HealthScoreCard from "../components/HealthScoreCard";
import TrendChart from "../components/TrendChart";
import PumpFormModal from "../components/PumpFormModal";
import ReadingFormModal from "../components/ReadingFormModal";
import { getRecommendedActions } from "../utils/recommendations";

export default function PumpDetail() {
  const { id } =
    useParams();
  const navigate =
    useNavigate();

  const [
    pump,
    setPump,
  ] =
    useState(null);
  const [
    projects,
    setProjects,
  ] = useState([]);
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
    isEditModalOpen,
    setIsEditModalOpen,
  ] =
    useState(false);
  const [
    isReadingModalOpen,
    setIsReadingModalOpen,
  ] =
    useState(false);

  useEffect(() => {
    fetchPumpData();
    fetchProjects();
  }, [id]);

  const fetchPumpData =
    async () => {
      try {
        const res =
          await api.get(
            `/pumps/${id}`,
          );
        setPump(
          res.data,
        );
      } catch (err) {
        console.error(
          "Fetch pump error:",
          err,
        );
        setError(
          "Gagal memuat detail pompa.",
        );
      } finally {
        setLoading(
          false,
        );
      }
    };

  const fetchProjects =
    async () => {
      try {
        const res =
          await api.get(
            "/projects",
          );
        setProjects(
          res.data,
        );
      } catch (err) {
        console.error(
          "Fetch projects error:",
          err,
        );
      }
    };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
        Memuat
        detail
        alat...
      </div>
    );
  }

  if (
    error ||
    !pump
  ) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="text-rose-600 dark:text-rose-400 text-sm">
          {error ||
            "Alat tidak ditemukan."}
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

  const latestReading =
    pump.readings &&
    pump
      .readings[0];
  const issues =
    latestReading?.issues ||
    [];
  const bepZone =
    latestReading?.bepZone ||
    "";
  const healthScore =
    latestReading?.healthScore ??
    100;
  const recommendations =
    getRecommendedActions(
      issues,
      bepZone,
      healthScore,
    );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Back Button & Header */}
      <div>
        <button
          onClick={() =>
            pump.projectId
              ? navigate(
                  `/projects/${pump.projectId}`,
                )
              : navigate(
                  "/dashboard",
                )
          }
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            Kembali
            ke
            Proyek
          </span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {
                  pump.name
                }
              </h1>
              {pump.project && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 rounded-md">
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-2xl">
              {pump.description ||
                "Tidak ada deskripsi detail alat."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setIsEditModalOpen(
                  true,
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>
                Update
                Data
                Alat
              </span>
            </button>

            <button
              onClick={() =>
                setIsReadingModalOpen(
                  true,
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Activity className="w-4 h-4" />
              <span>
                Input
                Pembacaan
                Baru
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Full Description & Specifications */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Spesifikasi
              Rating
              Pabrik
              (Nameplate)
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">
                  Rated
                  Flow
                  Rate
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {
                    pump.ratedFlow
                  }{" "}
                  m³/h
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">
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
              <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">
                  Rated
                  Power
                  Motor
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {
                    pump.ratedPower
                  }{" "}
                  kW
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">
                  Efisiensi
                  Pabrik
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {
                    pump.efficiency
                  }
                  %
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">
                  NPSH
                  Required
                  (NPSHr)
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {
                    pump.npshRequired
                  }{" "}
                  m
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 dark:text-slate-400">
                  Power
                  Factor
                  (cos
                  φ)
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {
                    pump.powerFactor
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Health Score Summary Card */}
          <HealthScoreCard
            score={
              latestReading?.healthScore
            }
            bepZone={
              latestReading?.bepZone
            }
            issues={
              latestReading?.issues
            }
          />
        </div>

        {/* Right Column: Trend Chart, Latest Reading & Maintenance Advice */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trend Chart */}
          <TrendChart
            readings={
              pump.readings
            }
          />

          {/* Fault Diagnosis & Actionable Repairs Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Wrench className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Diagnosis
              Kesalahan
              &
              Rekomendasi
              Perbaikan
              Alat
            </h3>

            {/* Identified Faults */}
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Indikasi
                Kesalahan
                &
                Kerusakan
                Terdeteksi:
              </p>
              {issues.length >
              0 ? (
                <div className="space-y-2">
                  {issues.map(
                    (
                      issue,
                      idx,
                    ) => (
                      <div
                        key={
                          idx
                        }
                        className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-300 text-xs rounded-xl flex items-start gap-2.5"
                      >
                        <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                        <span>
                          {
                            issue
                          }
                        </span>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    Tidak
                    terdeteksi
                    kesalahan
                    atau
                    masalah
                    kritis
                    pada
                    pembacaan
                    saat
                    ini.
                  </span>
                </div>
              )}
            </div>

            {/* Recommended Actionable Repairs */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
              <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-2.5">
                Langkah
                &
                Panduan
                Tindakan
                Perbaikan:
              </p>
              <div className="space-y-3">
                {recommendations.map(
                  (
                    rec,
                    idx,
                  ) => (
                    <div
                      key={
                        idx
                      }
                      className="p-3.5 bg-cyan-950/30 border border-cyan-500/20 rounded-xl space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-cyan-500 dark:text-cyan-300">
                          {
                            rec.category
                          }
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
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
          </div>

          {/* Latest Reading Snapshot */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Snapshot
                Pembacaan
                Terakhir
              </span>
              {latestReading && (
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-normal">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(
                    latestReading.createdAt,
                  ).toLocaleString(
                    "id-ID",
                  )}
                </span>
              )}
            </h3>

            {latestReading ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-slate-50/60 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    Flow
                    Rate
                    Aktual
                  </span>
                  <span className="font-bold text-sm text-cyan-600 dark:text-cyan-400">
                    {
                      latestReading.flowRate
                    }{" "}
                    m³/h
                  </span>
                </div>
                <div className="p-3 bg-slate-50/60 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    Tekanan
                    Suction/Discharge
                  </span>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    {
                      latestReading.suctionPressure
                    }{" "}
                    /{" "}
                    {
                      latestReading.dischargePressure
                    }{" "}
                    bar
                  </span>
                </div>
                <div className="p-3 bg-slate-50/60 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    Efisiensi
                    Hitung
                  </span>
                  <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    {
                      latestReading.efficiency
                    }
                    %
                  </span>
                </div>
                <div className="p-3 bg-slate-50/60 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    Vibrasi
                    &
                    Suhu
                  </span>
                  <span className="font-bold text-sm text-amber-600 dark:text-amber-400">
                    {
                      latestReading.vibration
                    }{" "}
                    mm/s
                    |{" "}
                    {
                      latestReading.temperature
                    }
                    °C
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-600 dark:text-slate-500 text-xs">
                Belum
                ada
                pembacaan
                operasional.
                Klik
                tombol
                "Input
                Pembacaan
                Baru"
                untuk
                memasukkan
                data
                pertama.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Pump Modal */}
      <PumpFormModal
        isOpen={
          isEditModalOpen
        }
        onClose={() =>
          setIsEditModalOpen(
            false,
          )
        }
        initialData={
          pump
        }
        projects={
          projects
        }
        onSuccess={() =>
          fetchPumpData()
        }
      />

      {/* Input Reading Modal */}
      <ReadingFormModal
        isOpen={
          isReadingModalOpen
        }
        onClose={() =>
          setIsReadingModalOpen(
            false,
          )
        }
        pumpId={
          pump.id
        }
        pumpName={
          pump.name
        }
        onSuccess={() =>
          fetchPumpData()
        }
      />
    </div>
  );
}
