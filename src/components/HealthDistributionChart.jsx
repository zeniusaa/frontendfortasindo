import React from "react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "../context/ThemeContext";
import { getHealthDistribution } from "../utils/healthStatus";

export default function HealthDistributionChart({ pumps = [], title = "Distribusi Status Kesehatan" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const data = getHealthDistribution(pumps.map((pump) => pump.readings?.[0]?.healthScore));
  const tooltipStyle = { backgroundColor: isDark ? "#0f172a" : "#ffffff", borderColor: isDark ? "#334155" : "#e2e8f0", borderRadius: "0.5rem", fontSize: "12px" };

  if (!data.length) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Berdasarkan health score pembacaan terakhir setiap pompa.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center mt-4">
        <div className="h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" cx="50%" cy="54%" innerRadius={55} outerRadius={88} startAngle={90} endAngle={-270} stroke="none">
                {data.map((item) => <Cell key={`${item.key}-depth`} fill={item.darkColor} />)}
              </Pie>
              <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={88} paddingAngle={3} startAngle={90} endAngle={-270} stroke="none">
                {data.map((item) => <Cell key={item.key} fill={item.color} />)}
              </Pie>
              <Tooltip formatter={(value) => [`${value} unit`, "Jumlah"]} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-1">
            <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{pumps.length}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Pompa</span>
          </div>
        </div>
        <div className="space-y-2">
          {data.map((item) => <div key={item.key} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300"><i className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />{item.label}</span>
            <strong className="text-slate-900 dark:text-slate-100">{item.value} unit</strong>
          </div>)}
        </div>
      </div>
      <div className="h-52 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 8, left: -24, bottom: 0 }}>
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: isDark ? "#94a3b8" : "#64748b" }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: isDark ? "#94a3b8" : "#64748b" }} tickLine={false} axisLine={false} />
            <Tooltip formatter={(value) => [`${value} unit`, "Jumlah"]} contentStyle={tooltipStyle} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>{data.map((item) => <Cell key={`${item.key}-bar`} fill={item.color} />)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
