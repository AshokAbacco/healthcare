// client/src/pages/opd/OPDPatientDetails.jsx
import { SectionCard, StatusBadge } from "../../components/UI";

export default function OPDPatientDetails({ patient: p, onBack }) {
  if (!p) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors text-sm font-medium">
          ← Back
        </button>
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
        <h1 className="text-slate-800 dark:text-white font-bold text-xl">{p.name}</h1>
        <StatusBadge status={p.condition || "Stable"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl">
        <SectionCard title="Personal Information" icon="👤">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "Name", val: p.name },
              { label: "Age", val: `${p.age} years` },
              { label: "Gender", val: p.gender },
              { label: "Place", val: p.place },
              { label: "Phone", val: p.phone },
              { label: "Visit Date", val: p.visitDate },
            ].map(item => (
              <div key={item.label}>
                <div className="text-slate-400 dark:text-slate-500 text-xs mb-0.5">{item.label}</div>
                <div className="text-slate-800 dark:text-white font-medium">{item.val || "—"}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Payment Information" icon="💳">
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-3 text-center">
                <div className="text-amber-600 dark:text-amber-400 font-bold text-lg">₹{p.cash}</div>
                <div className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Cash</div>
              </div>
              <div className="bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 rounded-xl p-3 text-center">
                <div className="text-violet-600 dark:text-violet-400 font-bold text-lg">₹{p.upi}</div>
                <div className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">UPI</div>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-3 text-center">
                <div className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">₹{p.total}</div>
                <div className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Total</div>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-transparent">
              <div className="text-slate-400 dark:text-slate-500 text-xs mb-1">Consultation Fee</div>
              <div className="text-slate-800 dark:text-white font-bold text-xl">₹{p.fee}</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Follow-Up Information" icon="📅">
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-slate-400 dark:text-slate-500 text-xs mb-0.5">Follow-Up Date</div>
              <div className="text-slate-800 dark:text-white font-medium">{p.followUpDate || "Not scheduled"}</div>
            </div>
            <div>
              <div className="text-slate-400 dark:text-slate-500 text-xs mb-0.5">Condition</div>
              <StatusBadge status={p.condition || "Stable"} />
            </div>
            {p.followUpDesc && (
              <div>
                <div className="text-slate-400 dark:text-slate-500 text-xs mb-0.5">Follow-Up Notes</div>
                <div className="text-slate-600 dark:text-slate-300">{p.followUpDesc}</div>
              </div>
            )}
          </div>
        </SectionCard>

        {p.notes && (
          <SectionCard title="Clinical Notes" icon="📋">
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{p.notes}</p>
          </SectionCard>
        )}
      </div>
    </div>
  );
}