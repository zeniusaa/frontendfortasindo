import React, {
  useState,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Gauge,
  Plus,
  Search,
  ChevronRight,
  Layers,
} from "lucide-react";
import api from "../api/client";
import PumpFormModal from "../components/PumpFormModal";
import HealthScoreCard from "../components/HealthScoreCard";

export default function PumpsList() {
  const [
    pumps,
    setPumps,
  ] = useState([]);
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
    search,
    setSearch,
  ] = useState("");
  const [
    selectedProjectId,
    setSelectedProjectId,
  ] = useState("");
  const [
    isPumpModalOpen,
    setIsPumpModalOpen,
  ] =
    useState(false);

  const navigate =
    useNavigate();

  useEffect(() => {
    fetchPumps();
    fetchProjects();
  }, [
    selectedProjectId,
  ]);

  const fetchPumps =
    async () => {
      setLoading(
        true,
      );
      try {
        const url =
          selectedProjectId
            ? `/pumps?projectId=${selectedProjectId}`
            : "/pumps";
        const res =
          await api.get(
            url,
          );
        setPumps(
          res.data,
        );
      } catch (err) {
        console.error(
          "Fetch pumps error:",
          err,
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

  const filteredPumps =
    pumps.filter(
      (p) =>
        p.name
          .toLowerCase()
          .includes(
            search.toLowerCase(),
          ) ||
        (p.description &&
          p.description
            .toLowerCase()
            .includes(
              search.toLowerCase(),
            )),
    );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Daftar
            Semua
            Alat
            (Pompa)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola &
            pantau
            status
            spesifikasi
            seluruh
            pompa
            dalam
            sistem
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
            Baru
          </span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-600 dark:text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari nama atau deskripsi alat..."
            value={
              search
            }
            onChange={(
              e,
            ) =>
              setSearch(
                e
                  .target
                  .value,
              )
            }
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={
            selectedProjectId
          }
          onChange={(
            e,
          ) =>
            setSelectedProjectId(
              e
                .target
                .value,
            )
          }
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
        >
          <option value="">
            -- Semua
            Proyek
            --
          </option>
          {projects.map(
            (p) => (
              <option
                key={
                  p.id
                }
                value={
                  p.id
                }
              >
                {
                  p.name
                }
              </option>
            ),
          )}
        </select>
      </div>

      {/* Pumps Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
          Memuat
          data
          alat...
        </div>
      ) : filteredPumps.length ===
        0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
          <Gauge className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Tidak
            Ada Alat
            Ditemukan
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-500 mt-1 max-w-sm mx-auto mb-4">
            Coba
            ubah
            kata
            kunci
            pencarian
            atau
            filter
            proyek.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPumps.map(
            (
              pump,
            ) => {
              const latestReading =
                pump.readings &&
                pump
                  .readings[0];
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

                    {pump.project && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-md border border-cyan-500/20 mb-3">
                        <Layers className="w-3 h-3" />
                        {
                          pump
                            .project
                            .name
                        }
                      </span>
                    )}

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {pump.description ||
                        "Tidak ada deskripsi lokasi/alat."}
                    </p>
                  </div>

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
              );
            },
          )}
        </div>
      )}

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
        projects={
          projects
        }
        onSuccess={() =>
          fetchPumps()
        }
      />
    </div>
  );
}
