// client/src/pages/ipd/IPDDashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ipdPatients as initialData } from "../../data/dummyData";
import { StatCard, PageHeader, StatusBadge } from "../../components/UI";

export default function IPDDashboard() {
  const [patients] = useState(initialData);
  const navigate = useNavigate();

  const admitted = patients.filter(p => p.status === "Admitted");
  const discharged = patients.filter(p => p.status === "Discharged");
  const totalBalance = admitted.reduce((s, p) => s + (p.balance || 0), 0);

  return (
    <div>
      <PageHeader
        title="IPD Dashboard"
        subtitle="Inpatient Department Overview"
        action={
          <button
            onClick={() => navigate("/ipd/admit")}
            className="bg-gradient-to-r from-violet-500 to-purple-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-violet-500/20"
          >
            + Admit Patient
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Admitted" value={patients.length} icon="🛏️" color="purple" />
        <StatCard label="Active Patients" value={admitted.length} icon="💊" color="blue" sub="Currently admitted" />
        <StatCard label="Discharged" value={discharged.length} icon="✅" color="green" sub="Successfully treated" />
        <StatCard label="Pending Balance" value={`₹${totalBalance.toLocaleString()}`} icon="⚠️" color="red" sub="From active patients" />
      </div>

      {/* Active patients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Admitted patients list */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-slate-800 dark:text-white font-semibold text-sm">Active Patients</h3>
            <button
              onClick={() => navigate("/ipd/patients")}
              className="text-violet-600 dark:text-violet-400 text-xs hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
            >
              View All →
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {admitted.map(p => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="w-9 h-9 rounded-full bg-violet-50 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-sm border border-violet-100 dark:border-transparent">
                  {p.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-800 dark:text-white text-sm font-medium truncate">{p.name}</div>
                  <div className="text-slate-400 dark:text-slate-500 text-xs">Admitted: {p.admissionDate}</div>
                </div>
                <div className="text-right">
                  <div className="text-red-500 dark:text-red-400 text-xs font-medium">₹{p.balance}</div>
                  <div className="text-slate-400 dark:text-slate-600 text-xs">pending</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats breakdown */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-none transition-colors duration-300">
            <h3 className="text-slate-800 dark:text-white font-semibold text-sm mb-4">Revenue Overview</h3>
            <div className="space-y-2">
              {[
                { label: "Total Deposits Collected", val: `₹${patients.reduce((s, p) => s + p.deposit, 0).toLocaleString()}`, color: "text-emerald-600 dark:text-emerald-400" },
                { label: "Total Cash", val: `₹${patients.reduce((s, p) => s + p.cash, 0).toLocaleString()}`, color: "text-amber-600 dark:text-amber-400" },
                { label: "Total UPI", val: `₹${patients.reduce((s, p) => s + p.upi, 0).toLocaleString()}`, color: "text-violet-600 dark:text-violet-400" },
                { label: "Total Pending", val: `₹${totalBalance.toLocaleString()}`, color: "text-red-500 dark:text-red-400" },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">{item.label}</span>
                  <span className={`font-bold text-sm ${item.color}`}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-none transition-colors duration-300">
            <h3 className="text-slate-800 dark:text-white font-semibold text-sm mb-3">Recent Discharges</h3>
            <div className="space-y-2">
              {discharged.slice(0, 4).map(p => (
                <div key={p.id} className="flex items-center gap-3 py-1.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-100 dark:border-transparent">
                    {p.name[0]}
                  </div>
                  <div>
                    <div className="text-slate-800 dark:text-white text-xs font-medium">{p.name}</div>
                    <div className="text-slate-400 dark:text-slate-500 text-xs">Discharged: {p.dischargeDate}</div>
                  </div>
                  <div className="ml-auto">
                    <StatusBadge status="Discharged" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}