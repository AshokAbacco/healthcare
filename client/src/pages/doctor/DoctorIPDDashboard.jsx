// client/src/pages/doctor/DoctorIPDDashboard.jsx
import IPDPatientList from "../ipd/IPDPatientList";

export function DoctorIPDDashboard({ patients }) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl w-fit text-xs text-amber-700 dark:text-amber-400">
        👁️ Read-only view — Doctor cannot add, edit, or delete records
      </div>
      <IPDPatientList patients={patients} setPatients={() => {}} readOnly />
    </div>
  );
}