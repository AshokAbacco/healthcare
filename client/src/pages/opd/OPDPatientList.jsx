// client/src/pages/opd/OPDPatientList.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, SearchBar, TableCard, Th, Td, ActionBtn, DeleteModal, EmptyState, Pagination, StatusBadge } from "../../components/UI";
import OPDPatientForm from "./OPDPatientForm";
import OPDPatientDetails from "./OPDPatientDetails";

const PER_PAGE = 7;

export default function OPDPatients({ patients, setPatients, readOnly = false }) {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const navigate = useNavigate();

  const filtered = patients.filter(p => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchDate = !dateFilter || p.visitDate === dateFilter;
    return matchName && matchDate;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = (id) => {
    setPatients(ps => ps.filter(p => p.id !== id));
    setDeleteId(null);
  };

  if (editing) return <OPDPatientForm patients={patients} setPatients={setPatients} editPatient={editing} onDone={() => setEditing(null)} />;
  if (viewing) return <OPDPatientDetails patient={viewing} onBack={() => setViewing(null)} />;

  return (
    <div>
      <PageHeader
        title="OPD Patients"
        subtitle={`${filtered.length} records`}
        action={
          !readOnly && (
            <button
              onClick={() => navigate("/opd/register")}
              className="bg-gradient-to-r from-teal-500 to-cyan-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-teal-500/20"
            >
              + Register Patient
            </button>
          )
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <SearchBar value={search} onChange={s => { setSearch(s); setPage(1); }} placeholder="Search patient..." />
        <div className="relative">
          <input
            type="date"
            value={dateFilter}
            onChange={e => { setDateFilter(e.target.value); setPage(1); }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-teal-500 dark:focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-colors"
          />
        </div>
        {dateFilter && (
          <button
            onClick={() => setDateFilter("")}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-white dark:bg-slate-800 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
          >
            Clear Date ✕
          </button>
        )}
      </div>

      <TableCard>
        <thead>
          <tr>
            <Th>Patient</Th><Th>Age</Th><Th>Phone</Th><Th>Place</Th>
            <Th>Fee</Th><Th>Cash</Th><Th>UPI</Th><Th>Total</Th>
            <Th>Visit Date</Th>{!readOnly && <Th>Actions</Th>}
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr><td colSpan={10}><EmptyState icon="🔍" message="No patients found" /></td></tr>
          ) : paginated.map(p => (
            <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <Td>
                <button onClick={() => setViewing(p)} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs font-bold border border-teal-100 dark:border-transparent">
                    {p.name[0]}
                  </div>
                  <span className="text-slate-800 dark:text-white font-medium">{p.name}</span>
                </button>
              </Td>
              <Td>{p.age}y</Td>
              <Td>{p.phone}</Td>
              <Td>{p.place}</Td>
              <Td><span className="text-emerald-600 dark:text-emerald-400 font-medium">₹{p.fee}</span></Td>
              <Td>
                {p.cash > 0
                  ? <span className="text-amber-600 dark:text-amber-400">₹{p.cash}</span>
                  : <span className="text-slate-300 dark:text-slate-600">—</span>}
              </Td>
              <Td>
                {p.upi > 0
                  ? <span className="text-violet-600 dark:text-violet-400">₹{p.upi}</span>
                  : <span className="text-slate-300 dark:text-slate-600">—</span>}
              </Td>
              <Td><span className="text-slate-800 dark:text-white font-bold">₹{p.total}</span></Td>
              <Td>{p.visitDate}</Td>
              {!readOnly && (
                <Td>
                  <div className="flex gap-1">
                    <ActionBtn type="view" onClick={() => setViewing(p)} />
                    <ActionBtn type="edit" onClick={() => setEditing(p)} />
                    <ActionBtn type="delete" onClick={() => setDeleteId(p.id)} />
                  </div>
                </Td>
              )}
            </tr>
          ))}
        </tbody>
      </TableCard>

      <Pagination current={page} total={totalPages} onPageChange={setPage} />

      {deleteId && (
        <DeleteModal
          name={patients.find(p => p.id === deleteId)?.name}
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}