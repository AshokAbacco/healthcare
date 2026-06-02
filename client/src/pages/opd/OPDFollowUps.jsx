//client\src\pages\opd\OPDFollowUps.jsx
import { useState } from "react";
import { PageHeader, SearchBar, StatusBadge, EmptyState } from "../../components/UI";

export default function OPDFollowUps({ patients }) {
  const [search, setSearch] = useState("");

  const withFollowUp = patients.filter(p =>
    p.followUpDate && p.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate));

  const today = new Date().toISOString().split("T")[0];
  const upcoming = withFollowUp.filter(p => p.followUpDate >= today);
  const past = withFollowUp.filter(p => p.followUpDate < today);

  const Card = ({ p }) => {
    const isToday = p.followUpDate === today;
    const isPast = p.followUpDate < today;
    return (
      <div className={`bg-slate-900 border rounded-2xl p-4 flex gap-4 transition-all ${isToday ? "border-amber-500/40" : isPast ? "border-slate-800/50 opacity-70" : "border-slate-800"}`}>
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            {p.name[0]}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-semibold text-sm">{p.name}</span>
            <StatusBadge status={p.condition} />
            {isToday && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium border border-amber-500/30">Today</span>}
          </div>
          <div className="text-slate-500 text-xs mb-2">📅 {p.followUpDate} · 📞 {p.phone} · 🏙️ {p.place}</div>
          {p.followUpDesc && <p className="text-slate-400 text-xs leading-relaxed">{p.followUpDesc}</p>}
        </div>
      </div>
    );
  };

  return (
    <div>
      <PageHeader title="Follow-Up Reminders" subtitle="Scheduled patient follow-ups" />
      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search patient..." />
      </div>

      {upcoming.length === 0 && past.length === 0 && <EmptyState icon="📅" message="No follow-ups scheduled" />}

      {upcoming.length > 0 && (
        <div className="mb-6">
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>Upcoming ({upcoming.length})
          </h3>
          <div className="space-y-3">
            {upcoming.map(p => <Card key={p.id} p={p} />)}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h3 className="text-slate-500 font-semibold text-sm mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-600"></span>Past ({past.length})
          </h3>
          <div className="space-y-3">
            {past.map(p => <Card key={p.id} p={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
