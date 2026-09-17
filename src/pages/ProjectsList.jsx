import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, FolderKanban, MapPin, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import ProjectFormModal from "../components/ProjectFormModal";
import { getHealthStatus, noHealthStatus } from "../utils/healthStatus";

function HealthBadge({ score }) {
  const health = getHealthStatus(score) || noHealthStatus;
  return <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-semibold ${health.badgeClass}`}><i className={`h-1.5 w-1.5 rounded-full ${health.dotClass}`} />{health.label}</span>;
}

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [pumps, setPumps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const fetchData = async () => { setLoading(true); try { const [projectResponse, pumpResponse] = await Promise.all([api.get("/projects"), api.get("/pumps")]); setProjects(projectResponse.data); setPumps(pumpResponse.data); } catch (error) { console.error("Fetch projects error:", error); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, []);
  const pumpsByProject = useMemo(() => pumps.reduce((groups, pump) => { if (pump.projectId) (groups[pump.projectId] ||= []).push(pump); return groups; }, {}), [pumps]);

  return <div className="mx-auto max-w-7xl space-y-8 p-8">
    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-6 dark:border-slate-800/80 md:flex-row md:items-center"><div><h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Daftar Proyek</h1><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Kesehatan proyek dan setiap alat memakai lima warna status yang sama.</p></div><button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 self-start rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-cyan-600/20 hover:bg-cyan-500 md:self-auto"><Plus className="h-4 w-4" />Tambah Proyek</button></div>
    {loading ? <div className="py-12 text-center text-sm text-slate-500">Memuat data proyek...</div> : projects.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900"><FolderKanban className="mx-auto mb-3 h-12 w-12 text-slate-400" /><p className="text-sm text-slate-600 dark:text-slate-400">Belum ada proyek dibuat.</p></div> : <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">{projects.map((project) => {
      const projectPumps = pumpsByProject[project.id] || [];
      const projectHealth = project.healthDataCount ? getHealthStatus(project.avgHealthScore) : null;
      const panelHealth = projectHealth || noHealthStatus;
      return <section key={project.id} className={`overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-slate-900 ${panelHealth.panelClass}`}>
        <button onClick={() => navigate(`/projects/${project.id}`)} className="flex w-full items-start justify-between gap-3 p-6 pb-4 text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/30"><div><div className="mb-2 flex flex-wrap items-center gap-2"><h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{project.name}</h2><HealthBadge score={project.healthDataCount ? project.avgHealthScore : null} /></div><p className="text-xs text-slate-500 dark:text-slate-400">{project.description || "Tidak ada deskripsi proyek."}</p>{project.location && <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-slate-500"><MapPin className="h-3 w-3" />{project.location}</p>}</div><ArrowRight className={`h-4 w-4 shrink-0 ${panelHealth.textClass}`} /></button>
        <div className="grid grid-cols-2 border-y border-slate-200/80 text-xs dark:border-slate-800/80"><div className="p-3.5"><span className="block text-slate-500">Alat</span><strong className="text-slate-800 dark:text-slate-100">{project.totalPumps} unit</strong></div><div className="border-l border-slate-200/80 p-3.5 dark:border-slate-800/80"><span className="block text-slate-500">Rata-rata kesehatan</span><strong className={panelHealth.textClass}>{project.healthDataCount ? `${project.avgHealthScore} / 100` : "Belum ada data"}</strong></div></div>
        <div className="p-4"><p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">Kondisi setiap alat</p>{projectPumps.length === 0 ? <p className="text-xs text-slate-500">Belum ada alat pada proyek ini.</p> : <div className="space-y-1.5">{projectPumps.map((pump) => { const reading = pump.readings?.[0]; const health = getHealthStatus(reading?.healthScore) || noHealthStatus; return <button key={pump.id} onClick={() => navigate(`/pumps/${pump.id}`)} className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left hover:brightness-95 dark:hover:brightness-125 ${health.panelClass}`}><i className={`h-2 w-2 shrink-0 rounded-full ${health.dotClass}`} /><span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700 dark:text-slate-200">{pump.name}</span><HealthBadge score={reading?.healthScore} /><span className={`w-9 text-right text-xs font-bold ${health.textClass}`}>{reading?.healthScore ?? "—"}</span></button>; })}</div>}</div>
      </section>;
    })}</div>}
    <ProjectFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchData} />
  </div>;
}
