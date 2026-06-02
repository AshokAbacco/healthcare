// client/src/pages/opd/OPDDashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { opdPatients as initialData } from "../../data/dummyData";
import { StatCard, PageHeader } from "../../components/UI";

export default function OPDDashboard() {
  const [patients] = useState(initialData);
  const navigate = useNavigate();

  const today = patients.filter(p => p.visitDate === "2025-01-15");
  const totalFee = today.reduce((s, p) => s + p.fee, 0);
  const totalCash = today.reduce((s, p) => s + p.cash, 0);
  const totalUPI = today.reduce((s, p) => s + p.upi, 0);

  const recentPatients = [...patients].reverse().slice(0, 5);

  return (
    <div>
      <PageHeader
        title="OPD Dashboard"
        subtitle="Outpatient Department Overview"
        action={
          <button
            onClick={() => navigate("/opd/register")}
            className="bg-gradient-to-r from-teal-500 to-cyan-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-teal-500/20"
          >
            + Register Patient
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Patients Today" value={today.length} icon="👥" color="blue" sub="Jan 15, 2025" />
        <StatCard label="Consultation Collection" value={`₹${totalFee.toLocaleString()}`} icon="💊" color="green" sub="Today's fees" />
        <StatCard label="Cash Collection" value={`₹${totalCash.toLocaleString()}`} icon="💵" color="yellow" sub="Cash payments" />
        <StatCard label="UPI Collection" value={`₹${totalUPI.toLocaleString()}`} icon="📱" color="purple" sub="UPI payments" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Payment split */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-none transition-colors duration-300">
          <h3 className="text-slate-800 dark:text-white font-semibold text-sm mb-4">Payment Split (Today)</h3>
          <div className="space-y-3">
            {[
              { label: "Cash", amount: totalCash, total: totalFee, color: "bg-amber-400" },
              { label: "UPI", amount: totalUPI, total: totalFee, color: "bg-violet-400" },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
                  <span className="text-slate-800 dark:text-white font-medium">₹{item.amount.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-700`}
                    style={{ width: item.total ? `${(item.amount / item.total) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All-time stats */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-none transition-colors duration-300">
          <h3 className="text-slate-800 dark:text-white font-semibold text-sm mb-4">All Time Stats</h3>
          <div className="space-y-2">
            {[
              { label: "Total Patients", val: patients.length, color: "text-blue-600 dark:text-blue-400" },
              { label: "Total Revenue", val: `₹${patients.reduce((s, p) => s + p.total, 0).toLocaleString()}`, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Total Cash", val: `₹${patients.reduce((s, p) => s + p.cash, 0).toLocaleString()}`, color: "text-amber-600 dark:text-amber-400" },
              { label: "Total UPI", val: `₹${patients.reduce((s, p) => s + p.upi, 0).toLocaleString()}`, color: "text-violet-600 dark:text-violet-400" },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-sm">{item.label}</span>
                <span className={`font-bold text-sm ${item.color}`}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Follow-ups due */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-none transition-colors duration-300">
          <h3 className="text-slate-800 dark:text-white font-semibold text-sm mb-4">Upcoming Follow-Ups</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {patients.filter(p => p.followUpDate).slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center gap-3 py-1.5">
                <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {p.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-800 dark:text-white text-xs font-medium truncate">{p.name}</div>
                  <div className="text-slate-400 dark:text-slate-500 text-xs">{p.followUpDate}</div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                  {p.condition}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent patients */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-slate-800 dark:text-white font-semibold text-sm">Recent Patients</h3>
          <button
            onClick={() => navigate("/opd/patients")}
            className="text-teal-600 dark:text-teal-400 text-xs hover:text-teal-700 dark:hover:text-teal-300 transition-colors font-medium"
          >
            View All →
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50">
              {["Patient", "Age", "Phone", "Fee", "Payment", "Visit Date"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentPatients.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors border-t border-slate-100 dark:border-slate-800/50">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-gradient-to-br dark:from-teal-500/30 dark:to-cyan-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 text-xs font-bold border border-teal-100 dark:border-transparent">
                      {p.name[0]}
                    </div>
                    <span className="text-slate-800 dark:text-white font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{p.age}y</td>
                <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{p.phone}</td>
                <td className="px-5 py-3.5 text-emerald-600 dark:text-emerald-400 font-medium">₹{p.fee}</td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1">
                    {p.cash > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-transparent">
                        Cash
                      </span>
                    )}
                    {p.upi > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-transparent">
                        UPI
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{p.visitDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}