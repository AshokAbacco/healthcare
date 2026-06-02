// client/src/pages/ipd/IPDPatientForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, FormInput, FormSelect, FormTextarea, SectionCard } from "../../components/UI";

const emptyPeriod = { days: "", rate: "", amount: 0 };

const defaultForm = {
  name: "", age: "", gender: "", phone: "", aadhar: "",
  admissionDate: new Date().toISOString().split("T")[0],
  admissionTime: new Date().toTimeString().slice(0, 5),
  deposit: "", cash: "", upi: "",
  stayPeriods: [{ ...emptyPeriod }],
  oil: "0", protein: "0", syrup: "0",
  expectedDays: "", dischargeDate: "", dischargeTime: "",
  notes: "", status: "Admitted",
};

export default function IPDPatientForm({ patients, setPatients, editPatient, onDone }) {
  const [form, setForm] = useState(editPatient || defaultForm);
  const navigate = useNavigate();

  const set = (field) => (val) => setForm(f => ({ ...f, [field]: val }));

  const cash = parseFloat(form.cash) || 0;
  const upi = parseFloat(form.upi) || 0;
  const totalPaid = cash + upi;

  const updatePeriod = (i, field, val) => {
    const periods = [...form.stayPeriods];
    periods[i] = { ...periods[i], [field]: val };
    periods[i].amount = (parseFloat(periods[i].days) || 0) * (parseFloat(periods[i].rate) || 0);
    setForm(f => ({ ...f, stayPeriods: periods }));
  };

  const addPeriod = () => setForm(f => ({ ...f, stayPeriods: [...f.stayPeriods, { ...emptyPeriod }] }));
  const removePeriod = (i) => setForm(f => ({ ...f, stayPeriods: f.stayPeriods.filter((_, idx) => idx !== i) }));

  const totalStay = form.stayPeriods.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
  const balance = totalStay - totalPaid;

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = {
      ...form,
      id: editPatient ? editPatient.id : Date.now(),
      age: parseInt(form.age),
      deposit: parseFloat(form.deposit) || 0,
      cash, upi, totalPaid, totalStay, balance: Math.max(0, balance),
      oil: parseInt(form.oil) || 0,
      protein: parseInt(form.protein) || 0,
      syrup: parseInt(form.syrup) || 0,
      documents: editPatient?.documents || [],
    };
    if (editPatient) {
      setPatients(ps => ps.map(p => p.id === editPatient.id ? entry : p));
    } else {
      setPatients(ps => [...ps, entry]);
    }
    if (onDone) onDone();
    else navigate("/ipd/patients");
  };

  return (
    <div>
      <PageHeader
        title={editPatient ? "Edit Patient" : "Admit Patient"}
        subtitle="Inpatient admission form"
        action={
          <button
            onClick={() => onDone ? onDone() : navigate("/ipd/patients")}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm font-medium transition-colors"
          >
            ← Back
          </button>
        }
      />
      <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl">
        <SectionCard title="Personal Details" icon="👤">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormInput label="Patient Name" value={form.name} onChange={set("name")} placeholder="Full name" required />
            <FormInput label="Age" type="number" value={form.age} onChange={set("age")} placeholder="Age" required />
            <FormSelect label="Gender" value={form.gender} onChange={set("gender")} options={["Male", "Female", "Other"]} required />
            <FormInput label="Phone Number" value={form.phone} onChange={set("phone")} placeholder="Mobile number" />
            <FormInput label="Aadhar Number" value={form.aadhar} onChange={set("aadhar")} placeholder="XXXX-XXXX-XXXX" />
            <FormSelect label="Status" value={form.status} onChange={set("status")} options={["Admitted", "Discharged"]} />
          </div>
        </SectionCard>

        <SectionCard title="Admission Details" icon="🛏️">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormInput label="Admission Date" type="date" value={form.admissionDate} onChange={set("admissionDate")} />
            <FormInput label="Admission Time" type="time" value={form.admissionTime} onChange={set("admissionTime")} />
            <FormInput label="Expected Stay (Days)" type="number" value={form.expectedDays} onChange={set("expectedDays")} placeholder="Days" />
            <FormInput label="Discharge Date" type="date" value={form.dischargeDate} onChange={set("dischargeDate")} />
            <FormInput label="Discharge Time" type="time" value={form.dischargeTime} onChange={set("dischargeTime")} />
          </div>
        </SectionCard>

        <SectionCard title="Payment Details" icon="💳">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <FormInput label="Deposit Amount (₹)" type="number" value={form.deposit} onChange={set("deposit")} placeholder="0.00" />
            <FormInput label="Cash Amount (₹)" type="number" value={form.cash} onChange={set("cash")} placeholder="0.00" />
            <FormInput label="UPI Amount (₹)" type="number" value={form.upi} onChange={set("upi")} placeholder="0.00" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-amber-50 dark:bg-slate-800/50 border border-amber-200 dark:border-amber-500/20 rounded-xl p-3 text-center">
              <div className="text-amber-600 dark:text-amber-400 font-bold text-lg">₹{cash.toLocaleString()}</div>
              <div className="text-xs text-slate-500 dark:text-slate-500">Cash</div>
            </div>
            <div className="bg-violet-50 dark:bg-slate-800/50 border border-violet-200 dark:border-violet-500/20 rounded-xl p-3 text-center">
              <div className="text-violet-600 dark:text-violet-400 font-bold text-lg">₹{upi.toLocaleString()}</div>
              <div className="text-xs text-slate-500 dark:text-slate-500">UPI</div>
            </div>
            <div className="bg-emerald-50 dark:bg-slate-800/50 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-3 text-center">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">₹{totalPaid.toLocaleString()}</div>
              <div className="text-xs text-slate-500 dark:text-slate-500">Total Paid</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Stay Charges" icon="📊">
          <div className="space-y-3 mb-4">
            {form.stayPeriods.map((period, i) => (
              <div key={i} className="grid grid-cols-4 gap-3 items-end p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-transparent">
                <FormInput label={`Period ${i + 1} — Days`} type="number" value={period.days} onChange={v => updatePeriod(i, "days", v)} placeholder="Days" />
                <FormInput label="Rate/Day (₹)" type="number" value={period.rate} onChange={v => updatePeriod(i, "rate", v)} placeholder="Rate" />
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Amount</label>
                  <div className="bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-emerald-500/20 rounded-xl px-4 py-2.5 text-emerald-700 dark:text-emerald-400 font-bold">
                    ₹{(period.amount || 0).toLocaleString()}
                  </div>
                </div>
                {form.stayPeriods.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePeriod(i)}
                    className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-sm pb-2.5 transition-colors"
                  >
                    ✕ Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={addPeriod}
              className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 text-sm font-medium transition-colors"
            >
              + Add Period
            </button>
            <div className="text-right">
              <div className="text-slate-400 dark:text-slate-500 text-xs">Total Stay Charge</div>
              <div className="text-slate-800 dark:text-white font-bold text-xl">₹{totalStay.toLocaleString()}</div>
              {balance > 0 && <div className="text-red-500 dark:text-red-400 text-xs">Balance: ₹{balance.toLocaleString()}</div>}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Admission Items" icon="🧴">
          <div className="grid grid-cols-3 gap-4">
            <FormInput label="Oil (Units)" type="number" value={form.oil} onChange={set("oil")} placeholder="0" />
            <FormInput label="Protein (Units)" type="number" value={form.protein} onChange={set("protein")} placeholder="0" />
            <FormInput label="Syrup (Units)" type="number" value={form.syrup} onChange={set("syrup")} placeholder="0" />
          </div>
        </SectionCard>

        <SectionCard title="Notes" icon="📝">
          <FormTextarea label="Clinical Notes" value={form.notes} onChange={set("notes")} placeholder="Additional notes..." />
        </SectionCard>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-gradient-to-r from-violet-500 to-purple-400 text-white font-semibold px-6 py-2.5 rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-violet-500/20 text-sm"
          >
            {editPatient ? "Update Patient" : "Admit Patient"}
          </button>
          <button
            type="button"
            onClick={() => onDone ? onDone() : navigate("/ipd/patients")}
            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium px-6 py-2.5 rounded-xl text-sm transition-colors border border-slate-200 dark:border-slate-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}