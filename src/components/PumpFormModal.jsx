import React, {
  useState,
  useEffect,
} from "react";
import {
  X,
  Wrench,
} from "lucide-react";
import api from "../api/client";

const detailFieldNames = [
  "pumpType", "pumpTagNumber", "pumpModelSerialNumber", "pumpManufacturer",
  "connectionType", "capacity", "serviceFluids", "rpm", "yearInstalled",
  "driver", "driverManufacturer", "driverTagNumber", "driverModelSerialNumber",
  "driverFrameSize", "driverPower", "driverVoltage", "driverAmpere", "driverYearInstalled",
];

const detailGroups = [
  {
    title: "Detail Pompa",
    fields: [
      ["pumpType", "Pump Type"], ["pumpTagNumber", "Tag Number"],
      ["pumpModelSerialNumber", "Model / Serial Number"], ["pumpManufacturer", "Merek / Manufacture"],
      ["connectionType", "Connection Type"], ["capacity", "Capacity"],
      ["serviceFluids", "Service Fluids"], ["rpm", "RPM", "number"],
      ["yearInstalled", "Year Installed", "number"],
    ],
  },
  {
    title: "Detail Driver",
    fields: [
      ["driver", "Driver"], ["driverManufacturer", "Merek / Manufacture"],
      ["driverTagNumber", "Tag Number"], ["driverModelSerialNumber", "Model / Serial Number"],
      ["driverFrameSize", "Frame Size"], ["driverPower", "Power (kW)", "number"],
      ["driverVoltage", "Volt (V)", "number"], ["driverAmpere", "Ampere (A)", "number"],
      ["driverYearInstalled", "Year Installed", "number"],
    ],
  },
];

const emptyDetailFields = Object.fromEntries(detailFieldNames.map((field) => [field, ""]));

export default function PumpFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialData = null,
  defaultProjectId = null,
  projects = [],
  onToggleActive = null,
}) {
  const [
    formData,
    setFormData,
  ] = useState({
    name: "",
    description: "",
    projectId:
      defaultProjectId
        ? String(
            defaultProjectId,
          )
        : "",
    ratedFlow: "",
    ratedHead: "",
    ratedPower: "",
    efficiency: "",
    npshRequired:
      "",
    powerFactor:
      "0.85",
    ...emptyDetailFields,
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

  useEffect(() => {
    if (
      initialData
    ) {
      setFormData({
        name:
          initialData.name ||
          "",
        description:
          initialData.description ||
          "",
        projectId:
          initialData.projectId
            ? String(
                initialData.projectId,
              )
            : "",
        ratedFlow:
          String(
            initialData.ratedFlow ||
              "",
          ),
        ratedHead:
          String(
            initialData.ratedHead ||
              "",
          ),
        ratedPower:
          String(
            initialData.ratedPower ||
              "",
          ),
        efficiency:
          String(
            initialData.efficiency ||
              "",
          ),
        npshRequired:
          String(
            initialData.npshRequired ||
              "",
          ),
        powerFactor:
          String(
            initialData.powerFactor ||
              "0.85",
          ),
        ...Object.fromEntries(detailFieldNames.map((field) => [
          field,
          initialData[field] == null ? "" : String(initialData[field]),
        ])),
      });
    } else {
      setFormData({
        name: "",
        description:
          "",
        projectId:
          defaultProjectId
            ? String(
                defaultProjectId,
              )
            : "",
        ratedFlow:
          "",
        ratedHead:
          "",
        ratedPower:
          "",
        efficiency:
          "",
        npshRequired:
          "",
        powerFactor:
          "0.85",
        ...emptyDetailFields,
      });
    }
  }, [
    initialData,
    defaultProjectId,
    isOpen,
  ]);

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
          name: formData.name,
          description:
            formData.description,
          projectId:
            formData.projectId
              ? parseInt(
                  formData.projectId,
                )
              : null,
          ratedFlow:
            parseFloat(
              formData.ratedFlow,
            ),
          ratedHead:
            parseFloat(
              formData.ratedHead,
            ),
          ratedPower:
            parseFloat(
              formData.ratedPower,
            ),
          efficiency:
            parseFloat(
              formData.efficiency,
            ),
          npshRequired:
            parseFloat(
              formData.npshRequired,
            ),
          powerFactor:
            parseFloat(
              formData.powerFactor ||
                0.85,
            ),
          ...Object.fromEntries(detailFieldNames.map((field) => [field, formData[field]])),
        };

      try {
        let res;
        if (
          initialData
        ) {
          res =
            await api.put(
              `/pumps/${initialData.id}`,
              payload,
            );
        } else {
          res =
            await api.post(
              "/pumps",
              payload,
            );
        }
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
            "Gagal menyimpan data alat.",
        );
      } finally {
        setLoading(
          false,
        );
      }
    };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl p-6 shadow-2xl relative my-8">
        <button
          onClick={
            onClose
          }
          className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-xl">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {initialData
                ? "Edit / Update Spesifikasi Alat"
                : "Tambah Alat (Pompa) Baru"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Masukkan
              spesifikasi
              nameplate
              pabrik
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nama
              Alat /
              Pompa
              *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Contoh: Pompa Sirkulasi Utama A1"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Pilih
              Proyek
              (Opsional)
            </label>
            <select
              name="projectId"
              value={
                formData.projectId
              }
              onChange={
                handleChange
              }
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="">
                --
                Tanpa
                Proyek
                (Umum)
                --
              </option>
              {projects.map(
                (
                  p,
                ) => (
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Deskripsi
              &
              Lokasi
              Alat
            </label>
            <textarea
              name="description"
              rows="2"
              placeholder="Detail lokasi spesifik, fungsi alat, atau catatan teknis..."
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {detailGroups.map((group) => (
            <div key={group.title} className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
              <p className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-3">
                {group.title}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {group.fields.map(([name, label, type = "text"]) => (
                  <div key={name}>
                    <label className="block text-xs text-slate-700 dark:text-slate-300 mb-1">{label}</label>
                    <input
                      type={type}
                      step={type === "number" ? "any" : undefined}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Technical Nameplate Rating Section */}
          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
            <p className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-3">
              Spesifikasi
              Rating
              Pabrik
              (Nameplate)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-700 dark:text-slate-300 mb-1">
                  Rated
                  Flow
                  (m³/h)
                  *
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="ratedFlow"
                  required
                  placeholder="60.0"
                  value={
                    formData.ratedFlow
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 dark:text-slate-300 mb-1">
                  Rated
                  Head
                  (m)
                  *
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="ratedHead"
                  required
                  placeholder="25.0"
                  value={
                    formData.ratedHead
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 dark:text-slate-300 mb-1">
                  Rated
                  Power
                  (kW)
                  *
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="ratedPower"
                  required
                  placeholder="7.5"
                  value={
                    formData.ratedPower
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 dark:text-slate-300 mb-1">
                  Efisiensi
                  Pabrik
                  (%)
                  *
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="efficiency"
                  required
                  placeholder="78.0"
                  value={
                    formData.efficiency
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 dark:text-slate-300 mb-1">
                  NPSHr
                  Bawaan
                  (m)
                  *
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="npshRequired"
                  required
                  placeholder="3.5"
                  value={
                    formData.npshRequired
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 dark:text-slate-300 mb-1">
                  Power
                  Factor
                  (3-Phase)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="powerFactor"
                  placeholder="0.85"
                  value={
                    formData.powerFactor
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            {initialData && onToggleActive ? (
              <button
                type="button"
                onClick={onToggleActive}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors ${initialData.isActive ? "text-rose-700 border-rose-200 hover:bg-rose-50 dark:text-rose-300 dark:border-rose-900 dark:hover:bg-rose-950/30" : "text-emerald-700 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-300 dark:border-emerald-900 dark:hover:bg-emerald-950/30"}`}
              >
                {initialData.isActive ? "Nonaktifkan Pompa" : "Aktifkan Pompa"}
              </button>
            ) : <span />}
            <div className="flex items-center gap-3">
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
              className="px-5 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors shadow-lg shadow-cyan-600/20 disabled:opacity-50"
            >
              {loading
                ? "Menyimpan..."
                : initialData
                  ? "Update Spesifikasi"
                  : "Simpan Alat"}
            </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
