import React, {
  useState,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderKanban,
  Gauge,
  Activity,
  Plus,
  ArrowRight,
} from "lucide-react";
import api from "../api/client";
import ProjectFormModal from "../components/ProjectFormModal";
import UnhealthyToolsAlert from "../components/UnhealthyToolsAlert";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { useTheme } from "../context/ThemeContext";

export default function Dashboard() {
  const [
    projects,
    setProjects,
  ] = useState([]);
  const [
    pumps,
    setPumps,
  ] = useState([]);
  const [
    loading,
    setLoading,
  ] =
    useState(true);
  const [
    isProjectModalOpen,
    setIsProjectModalOpen,
  ] =
    useState(false);
  const navigate =
    useNavigate();
  const { theme } =
    useTheme();
  const isDark =
    theme ===
    "dark";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData =
    async () => {
      setLoading(
        true,
      );
      try {
        const [
          projRes,
          pumpRes,
        ] =
          await Promise.all(
            [
              api.get(
                "/projects",
              ),
              api.get(
                "/pumps",
              ),
            ],
          );
        setProjects(
          projRes.data,
        );
        setPumps(
          pumpRes.data,
        );
      } catch (err) {
        console.error(
          "Fetch dashboard data error:",
          err,
        );
      } finally {
        setLoading(
          false,
        );
      }
    };

  // Compute Overall Stats
  const totalProjects =
    projects.length;
  const totalPumps =
    pumps.length > 0
      ? pumps.length
      : projects.reduce(
          (
            acc,
            p,
          ) =>
            acc +
            (p.totalPumps ||
              0),
          0,
        );
  const projectsWithHealth =
    projects.filter(
      (p) =>
        p.avgHealthScore >
        0,
    );
  const globalAvgHealth =
    projectsWithHealth.length >
    0
      ? Math.round(
          (projectsWithHealth.reduce(
            (
              acc,
              p,
            ) =>
              acc +
              p.avgHealthScore,
            0,
          ) /
            projectsWithHealth.length) *
            10,
        ) / 10
      : 0;

  // Pie chart data for Health Category
  const optimalProjects =
    projects.filter(
      (p) =>
        p.avgHealthScore >=
        80,
    ).length;
  const warningProjects =
    projects.filter(
      (p) =>
        p.avgHealthScore >=
          60 &&
        p.avgHealthScore <
          80,
    ).length;
  const dangerProjects =
    projects.filter(
      (p) =>
        p.avgHealthScore <
          60 &&
        p.avgHealthScore >
          0,
    ).length;
  const noDataProjects =
    projects.filter(
      (p) =>
        p.avgHealthScore ===
        0,
    ).length;

  const pieData = [
    {
      name: "Kesehatan Optimal (≥80)",
      value:
        optimalProjects,
      color:
        "#10b981",
    },
    {
      name: "Perhatian (60-79)",
      value:
        warningProjects,
      color:
        "#f59e0b",
    },
    {
      name: "Kritis (<60)",
      value:
        dangerProjects,
      color:
        "#ef4444",
    },
    {
      name: "Belum Ada Data",
      value:
        noDataProjects,
      color:
        "#64748b",
    },
  ].filter(
    (item) =>
      item.value >
      0,
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Dashboard
            Monitoring
            Proyek
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ringkasan
            statistik,
            peringatan
            dini &
            rekomendasi
            perbaikan
            alat
          </p>
        </div>
        <button
          onClick={() =>
            setIsProjectModalOpen(
              true,
            )
          }
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-cyan-600/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>
            Tambah
            Proyek
            Baru
          </span>
        </button>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Total
              Proyek
              Digarap
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {
                totalProjects
              }
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-xl">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Total
              Alat
              (Pompa)
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {
                totalPumps
              }
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Rata-Rata
              Kesehatan
              Global
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {
                  globalAvgHealth
                }
              </p>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                /
                100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Unhealthy Tools Alert & Recommended Actions Section */}
      {!loading && (
        <UnhealthyToolsAlert
          pumps={
            pumps
          }
        />
      )}

      {/* Visual Diagram Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
          Distribusi
          Status
          Kesehatan
          Proyek
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Grafik
          diagram
          persentase
          kondisi
          proyek
          yang
          sedang
          berjalan
        </p>

        {pieData.length >
        0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
            <div className="h-56 w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={
                      pieData
                    }
                    cx="50%"
                    cy="50%"
                    innerRadius={
                      50
                    }
                    outerRadius={
                      80
                    }
                    paddingAngle={
                      4
                    }
                    dataKey="value"
                  >
                    {pieData.map(
                      (
                        entry,
                        index,
                      ) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.color
                          }
                        />
                      ),
                    )}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor:
                        isDark
                          ? "#0f172a"
                          : "#ffffff",
                      borderColor:
                        isDark
                          ? "#334155"
                          : "#e2e8f0",
                      borderRadius:
                        "0.5rem",
                      color:
                        isDark
                          ? "#f8fafc"
                          : "#0f172a",
                      fontSize:
                        "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {pieData.map(
                (
                  item,
                  idx,
                ) => (
                  <div
                    key={
                      idx
                    }
                    className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            item.color,
                        }}
                      />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {
                          item.name
                        }
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {
                        item.value
                      }{" "}
                      Proyek
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-slate-600 dark:text-slate-500 text-xs">
            Belum
            ada data
            proyek
            untuk
            ditampilkan
            di
            diagram.
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Daftar
              Proyek
              Digarap
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Klik
              card
              untuk
              membuka
              detail
              alat
              di
              dalam
              proyek
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
            Memuat
            data
            proyek...
          </div>
        ) : projects.length ===
          0 ? (
          <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
            <FolderKanban className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Belum
              ada
              proyek
              dibuat
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-500 mt-1 max-w-sm mx-auto mb-4">
              Buat
              proyek
              pertama
              Anda
              untuk
              mulai
              mengelompokkan
              dan
              memantau
              peralatan
              pompa.
            </p>
            <button
              onClick={() =>
                setIsProjectModalOpen(
                  true,
                )
              }
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-xs font-semibold hover:bg-cyan-500 transition-colors"
            >
              Tambah
              Proyek
              Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(
              (
                project,
              ) => (
                <div
                  key={
                    project.id
                  }
                  onClick={() =>
                    navigate(
                      `/projects/${project.id}`,
                    )
                  }
                  className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-cyan-500/5 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors text-base line-clamp-1">
                        {
                          project.name
                        }
                      </h3>
                      <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {project.description ||
                        "Tidak ada deskripsi singkat."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-600 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                        Jumlah
                        Alat
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {
                          project.totalPumps
                        }{" "}
                        Pompa
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-600 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                        Rata-Rata
                        Kesehatan
                      </span>
                      <span
                        className={`font-bold ${
                          project.avgHealthScore >=
                          80
                            ? "text-emerald-600 dark:text-emerald-400"
                            : project.avgHealthScore >=
                                60
                              ? "text-amber-600 dark:text-amber-400"
                              : project.avgHealthScore >
                                  0
                                ? "text-rose-600 dark:text-rose-400"
                                : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {project.avgHealthScore >
                        0
                          ? `${project.avgHealthScore} / 100`
                          : "Belum Ada Data"}
                      </span>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* Modal Form Tambah Proyek */}
      <ProjectFormModal
        isOpen={
          isProjectModalOpen
        }
        onClose={() =>
          setIsProjectModalOpen(
            false,
          )
        }
        onSuccess={() =>
          fetchDashboardData()
        }
      />
    </div>
  );
}
