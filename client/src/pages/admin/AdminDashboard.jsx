// client/src/pages/admin/AdminDashboard.jsx
// Combined overview for Admin — reuses the THREE stats endpoints that
// already exist (no new backend aggregation needed):
//   /opd/patients/stats       (opd.controller.js getStats)
//   /ipd/stats                (ipd.controller.js getStats — mounted flat under /api/ipd, unlike OPD's /patients/stats nesting)
//   /pharmacy/medicines/stats (medicine.controller.js getMedicineStats)
// requireModule already lets ADMIN role through regardless of assigned
// modules (see auth.middleware.js), so these calls work without any
// per-user module assignment.
import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { StatCard } from "../../components/UI";
import {
  Users, Activity, CalendarClock, AlertTriangle, IndianRupee,
  BedDouble, Wallet, Pill, PackageX, Clock, Loader2, Stethoscope,
} from "lucide-react";

export default function AdminDashboard() {
  const [opd, setOpd] = useState(null);
  const [ipd, setIpd] = useState(null);
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [opdData, ipdData, pharmacyData] = await Promise.all([
          api.get("/opd/patients/stats"),
          api.get("/ipd/stats"),
          api.get("/pharmacy/medicines/stats"),
        ]);
        if (cancelled) return;
        setOpd(opdData);
        setIpd(ipdData);
        setPharmacy(pharmacyData);
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load dashboard data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 text-sm font-medium">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl px-4 py-3 text-rose-600 dark:text-rose-400 text-sm font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* OPD */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Stethoscope className="w-4 h-4 text-teal-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">OPD Overview</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Patients Today" value={opd.seenToday} color="blue" />
          <StatCard icon={Activity} label="Total OPD Patients" value={opd.totalPatients} color="teal" />
          <StatCard icon={CalendarClock} label="Pending Follow-Ups" value={opd.pendingFollowUps} color="yellow" />
          <StatCard icon={AlertTriangle} label="Critical Patients" value={opd.criticalCount} color="red" />
          <StatCard icon={IndianRupee} label="Today's Revenue" value={`₹${opd.todayRevenue.toLocaleString()}`} color="green" />
          <StatCard icon={Wallet} label="Today — Cash" value={`₹${opd.todayCash.toLocaleString()}`} color="yellow" />
          <StatCard icon={Wallet} label="Today — UPI" value={`₹${opd.todayUpi.toLocaleString()}`} color="purple" />
          <StatCard icon={IndianRupee} label="Total Revenue (All Time)" value={`₹${opd.totalRevenue.toLocaleString()}`} color="cyan" />
        </div>
      </section>

      {/* IPD */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <BedDouble className="w-4 h-4 text-violet-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">IPD Overview</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={BedDouble} label="Currently Admitted" value={ipd.activeCount} color="blue" />
          <StatCard icon={Activity} label="Total Admitted (Ever)" value={ipd.totalAdmittedEver} color="teal" />
          <StatCard icon={Users} label="Discharged" value={ipd.dischargedCount} color="purple" />
          <StatCard icon={AlertTriangle} label="Pending Balance" value={`₹${ipd.totalBalance.toLocaleString()}`} color="red" />
          <StatCard icon={IndianRupee} label="Total Deposits" value={`₹${ipd.totalDeposits.toLocaleString()}`} color="green" />
          <StatCard icon={Wallet} label="Total Cash" value={`₹${ipd.totalCash.toLocaleString()}`} color="yellow" />
          <StatCard icon={Wallet} label="Total UPI" value={`₹${ipd.totalUpi.toLocaleString()}`} color="cyan" />
        </div>
      </section>

      {/* Pharmacy */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Pill className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Pharmacy Overview</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Pill} label="Total Medicines" value={pharmacy.totalMedicines} color="blue" />
          <StatCard icon={IndianRupee} label="Inventory Value (Selling)" value={`₹${pharmacy.totalSellingValue.toLocaleString()}`} color="green" />
          <StatCard icon={IndianRupee} label="Potential Profit" value={`₹${pharmacy.potentialProfit.toLocaleString()}`} color="teal" />
          <StatCard icon={PackageX} label="Out of Stock" value={pharmacy.outOfStockCount} color="red" />
          <StatCard icon={AlertTriangle} label="Low Stock" value={pharmacy.lowStockCount} color="yellow" />
          <StatCard icon={Clock} label="Expiring Soon (30d)" value={pharmacy.expiringSoonCount} color="purple" />
          <StatCard icon={Clock} label="Already Expired" value={pharmacy.expiredCount} color="red" />
        </div>
      </section>

      <p className="text-xs text-slate-400 dark:text-slate-500">
        Pharmacy inventory values use per-unit price (purchase/selling price ÷ units per pack) — see the `unitsPerPack`
        field on each medicine. Values will be approximate for any medicine still on the default pack size until
        someone sets its real pack size in Pharmacy &gt; All Medicines.
      </p>
    </div>
  );
}