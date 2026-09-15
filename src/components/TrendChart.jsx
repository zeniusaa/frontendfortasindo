import React, {
  useState,
} from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { useTheme } from "../context/ThemeContext";

export default function TrendChart({
  readings = [],
}) {
  const [
    metric,
    setMetric,
  ] = useState(
    "healthScore",
  );
  const { theme } =
    useTheme();
  const isDark =
    theme ===
    "dark";
  const gridColor =
    isDark
      ? "#1e293b"
      : "#e2e8f0";
  const axisColor =
    isDark
      ? "#64748b"
      : "#94a3b8";
  const tooltipStyle =
    {
      backgroundColor:
        isDark
          ? "#0f172a"
          : "#ffffff",
      borderColor:
        isDark
          ? "#334155"
          : "#e2e8f0",
      color: isDark
        ? "#f8fafc"
        : "#0f172a",
    };

  if (
    !readings ||
    readings.length ===
      0
  ) {
    return (
      <div className="h-64 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-500 text-sm">
        Belum ada
        histori
        pembacaan
        operasional.
      </div>
    );
  }

  // Format data for Recharts (reverse to show chronological order left-to-right)
  const chartData =
    [...readings]
      .reverse()
      .map((r) => ({
        time: new Date(
          r.createdAt,
        ).toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute:
              "2-digit",
          },
        ),
        date: new Date(
          r.createdAt,
        ).toLocaleDateString(
          [],
          {
            month:
              "short",
            day: "numeric",
          },
        ),
        healthScore:
          r.healthScore,
        flowRate:
          r.flowRate,
        efficiency:
          r.efficiency,
        vibration:
          r.vibration,
        temperature:
          r.temperature,
      }));

  const metricsConfig =
    {
      healthScore: {
        label:
          "Health Score (0-100)",
        color:
          "#06b6d4",
        unit: "",
      },
      flowRate: {
        label:
          "Flow Rate (m³/h)",
        color:
          "#3b82f6",
        unit: " m³/h",
      },
      efficiency: {
        label:
          "Efisiensi (%)",
        color:
          "#10b981",
        unit: "%",
      },
      vibration: {
        label:
          "Vibrasi (mm/s)",
        color:
          "#f59e0b",
        unit: " mm/s",
      },
      temperature: {
        label:
          "Suhu (°C)",
        color:
          "#ef4444",
        unit: " °C",
      },
    };

  const activeConfig =
    metricsConfig[
      metric
    ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Grafik
            Tren
            Operasional
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Histori
            50
            pembacaan
            terakhir
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(
            metricsConfig,
          ).map(
            (
              key,
            ) => (
              <button
                key={
                  key
                }
                onClick={() =>
                  setMetric(
                    key,
                  )
                }
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  metric ===
                  key
                    ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/40"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                {key ===
                "healthScore"
                  ? "Health Score"
                  : key ===
                      "flowRate"
                    ? "Flow"
                    : key ===
                        "efficiency"
                      ? "Efisiensi"
                      : key ===
                          "vibration"
                        ? "Vibrasi"
                        : "Suhu"}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={
              chartData
            }
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={
                gridColor
              }
            />
            <XAxis
              dataKey="date"
              stroke={
                axisColor
              }
              fontSize={
                11
              }
              tickLine={
                false
              }
            />
            <YAxis
              stroke={
                axisColor
              }
              fontSize={
                11
              }
              tickLine={
                false
              }
            />
            <Tooltip
              contentStyle={{
                ...tooltipStyle,
                borderRadius:
                  "0.5rem",
                fontSize:
                  "12px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={
                metric
              }
              name={
                activeConfig.label
              }
              stroke={
                activeConfig.color
              }
              strokeWidth={
                2
              }
              dot={{
                r: 3,
                fill: activeConfig.color,
              }}
              activeDot={{
                r: 5,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
