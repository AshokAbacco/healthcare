// client/src/pages/doctor/DoctorOPDDashboard.jsx
import OPDPatientList from "../opd/OPDPatientList";
import OPDFollowUps from "../opd/OPDFollowUps";
import { useState } from "react";

export function DoctorOPDDashboard({ patients }) {
  const [tab, setTab] = useState("patients");

  return (
    <div>
      <div className="flex items-center gap-1 mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1 w-fit shadow-sm dark:shadow-none transition-colors duration-300">
        {[
          { key: "patients", label: "👥 Patients" },
          { key: "followups", label: "📅 Follow-Ups" },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t.key
                ? "bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl w-fit text-xs text-amber-700 dark:text-amber-400">
        👁️ Read-only view — Doctor cannot add, edit, or delete records
      </div>

      {tab === "patients" && <OPDPatientList patients={patients} setPatients={() => {}} readOnly />}
      {tab === "followups" && <OPDFollowUps patients={patients} />}
    </div>
  );
}