// client/src/pages/opd/OPDPatientForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, FormInput, FormSelect, FormTextarea, SectionCard } from "../../components/UI";

const emptyForm = {
  name: "", age: "", gender: "", place: "", phone: "", fee: "",
  cash: "", upi: "", visitDate: new Date().toISOString().split("T")[0],
  notes: "", followUpDate: "", condition: "", followUpDesc: "",
};

export default function OPDPatientForm({ patients, setPatients, editPatient, onDone }) {
  const [form, setForm] = useState(editPatient || emptyForm);
  const navigate = useNavigate();

  const set = (field) => (val) => setForm(f => ({ ...f, [field]: val }));

  const cash = parseFloat(form.cash) || 0;
  const upi = parseFloat(form.upi) || 0;
  const total = cash + upi;

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = {
      ...form,
      id: editPatient ? editPatient.id : Date.now(),
      age: parseInt(form.age),
      fee: parseFloat(form.fee) || 0,
      cash, upi, total,
    };
    if (editPatient) {
      setPatients(ps => ps.map(p => p.id === editPatient.id ? entry : p));
    } else {
      setPatients(ps => [...ps, entry]);
    }
    if (onDone) onDone();
    else navigate("/opd/patients");
  };

  return (
    <div>
      <PageHeader
        title={editPatient ? "Edit Patient" : "Register OPD Patient"}
        subtitle="Outpatient consultation registration"
        action={
          <button
            onClick={() => onDone ? onDone() : navigate("/opd/patients")}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm transition-colors font-medium"
          >
            ← Back
          </button>
        }
      />
      <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl">
        <SectionCard title="Personal Details" icon="👤">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormInput label="Patient Name" value={form.name} onChange={set("name")} placeholder="Full name" required />
            <FormInput label="Age" type="number" value={form.age} onChange={set("age")} placeholder="Age in years" required />
            <FormSelect label="Gender" value={form.gender} onChange={set("gender")} options={["Male", "Female", "Other"]} required />
            <FormInput label="Place" value={form.place} onChange={set("place")} placeholder="City / Town" />
            <FormInput label="Phone Number" value={form.phone} onChange={set("phone")} placeholder="10-digit mobile" />
            <FormInput label="Consultation Fee (₹)" type="number" value={form.fee} onChange={set("fee")} placeholder="0.00" required />
          </div>
        </SectionCard>

        <SectionCard title="Payment Details" icon="💳">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput label="Cash Amount (₹)" type="number" value={form.cash} onChange={set("cash")} placeholder="0.00" />
            <FormInput label="UPI Amount (₹)" type="number" value={form.upi} onChange={set("upi")} placeholder="0.00" />
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Total Amount</label>
              <div className="bg-emerald-50 dark:bg-slate-800/50 border border-emerald-200 dark:border-emerald-500/30 rounded-xl px-4 py-2.5 text-emerald-700 dark:text-emerald-400 font-bold text-lg">
                ₹{total.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-2 flex-wrap">
            {cash > 0 && (
              <span className="text-xs px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                Cash: ₹{cash}
              </span>
            )}
            {upi > 0 && (
              <span className="text-xs px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20">
                UPI: ₹{upi}
              </span>
            )}
            {cash === 0 && upi === 0 && (
              <span className="text-xs text-slate-400 dark:text-slate-500">Enter cash and/or UPI amounts above</span>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Visit Details" icon="📋">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Visit Date" type="date" value={form.visitDate} onChange={set("visitDate")} />
            <FormInput label="Follow-Up Date" type="date" value={form.followUpDate} onChange={set("followUpDate")} />
            <FormSelect label="Condition" value={form.condition} onChange={set("condition")} options={["Stable", "Improving", "Chronic", "Mild", "Good", "Critical"]} />
            <div className="md:col-span-1">
              <FormTextarea label="Follow-Up Description" value={form.followUpDesc} onChange={set("followUpDesc")} placeholder="Follow-up instructions..." />
            </div>
            <div className="md:col-span-2">
              <FormTextarea label="Notes" value={form.notes} onChange={set("notes")} placeholder="Clinical notes..." />
            </div>
          </div>
        </SectionCard>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-semibold px-6 py-2.5 rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-teal-500/20 text-sm"
          >
            {editPatient ? "Update Patient" : "Register Patient"}
          </button>
          <button
            type="button"
            onClick={() => onDone ? onDone() : navigate("/opd/patients")}
            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium px-6 py-2.5 rounded-xl text-sm transition-colors border border-slate-200 dark:border-slate-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}