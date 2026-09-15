import React, {
  useState,
} from "react";
import {
  X,
  Activity,
} from "lucide-react";
import api from "../api/client";

export default function ReadingFormModal({
  isOpen,
  onClose,
  pumpId,
  pumpName,
  onSuccess,
}) {
  const [
    formData,
    setFormData,
  ] = useState({
    flowRate: "",
    suctionPressure:
      "",
    dischargePressure:
      "",
    current: "",
    voltage: "380",
    vibration: "",
    temperature: "",
    rpm: "2900",
  });
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

  if (!isOpen)
    return null;

  const handleChange =
    (e) => {
      setFormData({
        ...formData,
        [e.target
          .name]:
          e.target
            .value,
      });
    };

  const handleSubmit =
    async (e) => {
      e.preventDefault();
      setLoading(
        true,
      );
      setError(
        null,
      );

      const payload =
        {
          flowRate:
            parseFloat(
              formData.flowRate,
            ),
          suctionPressure:
            parseFloat(
              formData.suctionPressure,
            ),
          dischargePressure:
            parseFloat(
              formData.dischargePressure,
            ),
          current:
            parseFloat(
              formData.current,
            ),
          voltage:
            parseFloat(
              formData.voltage,
            ),
          vibration:
            parseFloat(
              formData.vibration,
            ),
          temperature:
            parseFloat(
              formData.temperature,
            ),
          rpm: parseFloat(
            formData.rpm ||
              2900,
          ),
        };

      try {
        const res =
          await api.post(
            `/pumps/${pumpId}/readings`,
            payload,
          );
        onSuccess(
          res.data,
        );
        onClose();
      } catch (err) {
        setError(
          err
            .response
            ?.data
            ?.error ||
            "Gagal menyimpan pembacaan.",
        );
      } finally {
        setLoading(
          false,
        );
      }
    };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative my-8">
        <button
          onClick={
            onClose
          }
          className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Input
              Pembacaan
              Operasional
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pompa:{" "}
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
                {
                  pumpName
                }
              </span>
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-700 dark:text-slate-300 mb-1">
                Flow
                Rate
                Aktual
                (m³/h)
                *
              </label>
              <input
                type="number"
                step="0.1"
                name="flowRate"
                required
                placeholder="55.0"
                value={
                  formData.flowRate
                }
                onChange={
                  handleChange
                }
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-700 dark:text-slate-300 mb-1">
                Tekanan
                Suction
                (bar)
                *
              </label>
              <input
                type="number"
                step="0.01"
                name="suctionPressure"
                required
                placeholder="0.5"
                value={
                  formData.suctionPressure
                }
                onChange={
                  handleChange
                }
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-700 dark:text-slate-300 mb-1">
                Tekanan
                Discharge
                (bar)
                *
              </label>
              <input
                type="number"
                step="0.01"
                name="dischargePressure"
                required
                placeholder="3.2"
                value={
                  formData.dischargePressure
                }
                onChange={
                  handleChange
                }
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-700 dark:text-slate-300 mb-1">
                Arus
                Motor
                (Ampere)
                *
              </label>
              <input
                type="number"
                step="0.1"
                name="current"
                required
                placeholder="14.2"
                value={
                  formData.current
                }
                onChange={
                  handleChange
                }
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-700 dark:text-slate-300 mb-1">
                Tegangan
                (Volt)
                *
              </label>
              <input
                type="number"
                step="1"
                name="voltage"
                required
                placeholder="380"
                value={
                  formData.voltage
                }
                onChange={
                  handleChange
                }
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-700 dark:text-slate-300 mb-1">
                Vibrasi
                (mm/s
                RMS)
                *
              </label>
              <input
                type="number"
                step="0.1"
                name="vibration"
                required
                placeholder="2.5"
                value={
                  formData.vibration
                }
                onChange={
                  handleChange
                }
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-700 dark:text-slate-300 mb-1">
                Suhu
                Bearing
                (°C)
                *
              </label>
              <input
                type="number"
                step="0.1"
                name="temperature"
                required
                placeholder="65.0"
                value={
                  formData.temperature
                }
                onChange={
                  handleChange
                }
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-700 dark:text-slate-300 mb-1">
                Kecepatan
                (RPM)
              </label>
              <input
                type="number"
                step="1"
                name="rpm"
                placeholder="2900"
                value={
                  formData.rpm
                }
                onChange={
                  handleChange
                }
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={
                onClose
              }
              className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={
                loading
              }
              className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              {loading
                ? "Kalkulasi..."
                : "Kirim & Hitung Performa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
