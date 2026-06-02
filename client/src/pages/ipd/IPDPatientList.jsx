// client/src/pages/ipd/IPDPatientList.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, SearchBar, TableCard, Th, Td, ActionBtn, DeleteModal, EmptyState, Pagination, StatusBadge } from "../../components/UI";
import IPDPatientForm from "./IPDPatientForm";
import IPDPatientDetails from "./IPDPatientDetails";

const PER_PAGE = 7;

export default function IPDPatientList({ patients, setPatients, readOnly = false }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const navigate = useNavigate();

  const filtered = patients.filter(p => {
    const matchName = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchName && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = (id) => {
    setPatients(ps => ps.filter(p => p.id !== id));
    setDeleteId(null);
  };

  if (editing) return <IPDPatientForm patients={patients} setPatients={setPatients} editPatient={editing} onDone={() => setEditing(null)} />;
  if (viewing) return <IPDPatientDetails patient={viewing} setPatients={setPatients} onBack={() => setViewing(null)} readOnly={readOnly} />;

  return (
    <div>
      <PageHeader
        title="IPD Patients"
        subtitle={`${filtered.length} records`}
        action={
          !readOnly && (
            <button
              onClick={() => navigate("/ipd/admit")}
              className="bg-gradient-to-r from-violet-500 to-purple-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-violet-500/20"
            >
              + Admit Patient
            </button>
          )
        }
      />

      <div className="flex flex-wrap gap-3 mb-4">
        <SearchBar value={search} onChange={s => { setSearch(s); setPage(1); }} placeholder="Search patient..." />
        <div className="flex gap-2">
          {["", "Admitted", "Discharged"].map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors border ${
                statusFilter === s
                  ? "bg-violet-50 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-500/30"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              {s || "All Status"}
            </button>
          ))}
        </div>
      </div>

      <TableCard>
        <thead>
          <tr>
            <Th>Patient</Th><Th>Admission Date</Th><Th>Time</Th>
            <Th>Deposit</Th><Th>Cash</Th><Th>UPI</Th><Th>Total Paid</Th>
            <Th>Balance</Th><Th>Status</Th>{!readOnly && <Th>Actions</Th>}
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr><td colSpan={10}><EmptyState icon="🔍" message="No patients found" /></td></tr>
          ) : paginated.map(p => (
            <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <Td>
                <button onClick={() => setViewing(p)} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                    p.status === "Admitted"
                      ? "bg-violet-50 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-transparent"
                      : "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-transparent"
                  }`}>
                    {p.name[0]}
                  </div>
                  <span className="text-slate-800 dark:text-white font-medium">{p.name}</span>
                </button>
              </Td>
              <Td>{p.admissionDate}</Td>
              <Td>{p.admissionTime}</Td>
              <Td><span className="text-blue-600 dark:text-blue-400">₹{p.deposit?.toLocaleString()}</span></Td>
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
              <Td><span className="text-emerald-600 dark:text-emerald-400 font-medium">₹{p.totalPaid?.toLocaleString()}</span></Td>
              <Td>
                {p.balance > 0
                  ? <span className="text-red-500 dark:text-red-400 font-medium">₹{p.balance?.toLocaleString()}</span>
                  : <span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">Cleared</span>}
              </Td>
              <Td><StatusBadge status={p.status} /></Td>
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