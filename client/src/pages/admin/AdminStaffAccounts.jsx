// client/src/pages/admin/AdminStaffAccounts.jsx
// Manages User records (Doctor/Receptionist/Pharmacy/Admin) — these are
// LOGIN accounts. For non-login staff (nurses, ward staff, etc.), see
// AdminEmployeeDirectory.jsx instead — a deliberately separate model.
import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import {
  UserPlus, Loader2, Pencil, KeyRound, Power, X, Check, ShieldCheck,
} from "lucide-react";

const ROLES = ["ADMIN", "DOCTOR", "RECEPTIONIST", "PHARMACY"];
const MODULES = ["OPD", "IPD", "PHARMACY"];

const ROLE_COLORS = {
  ADMIN: "bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20",
  DOCTOR: "bg-violet-50 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-500/20",
  RECEPTIONIST: "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
  PHARMACY: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
};

const emptyCreateForm = {
  fullName: "", email: "", phone: "", password: "", role: "RECEPTIONIST", modules: [],
};

export default function AdminStaffAccounts() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const [resettingId, setResettingId] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const { users: data } = await api.get("/admin/users");
      setUsers(data);
    } catch (err) {
      setError(err.message || "Could not load staff accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleCreateModule = (m) => {
    setCreateForm((f) => ({
      ...f,
      modules: f.modules.includes(m) ? f.modules.filter((x) => x !== m) : [...f.modules, m],
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(""); setInfo("");
    if (!createForm.fullName || !createForm.email || !createForm.phone || !createForm.password) {
      return setError("Full name, email, phone, and password are all required.");
    }
    setSaving(true);
    try {
      await api.post("/admin/users", createForm);
      setInfo(`${createForm.fullName} added successfully.`);
      setCreateForm(emptyCreateForm);
      setShowCreate(false);
      fetchUsers();
    } catch (err) {
      setError(err.message || "Could not create staff account.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (u) => {
    setEditingId(u.id);
    setEditForm({ fullName: u.fullName, email: u.email, phone: u.phone, role: u.role, modules: u.modules || [] });
  };

  const toggleEditModule = (m) => {
    setEditForm((f) => ({
      ...f,
      modules: f.modules.includes(m) ? f.modules.filter((x) => x !== m) : [...f.modules, m],
    }));
  };

  const saveEdit = async (id) => {
    setError(""); setInfo("");
    setSaving(true);
    try {
      await api.put(`/admin/users/${id}`, editForm);
      setInfo("Account updated.");
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      setError(err.message || "Could not update account.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (u) => {
    setError(""); setInfo("");
    try {
      await api.put(`/admin/users/${u.id}`, { isActive: !u.isActive });
      setInfo(`${u.fullName} ${u.isActive ? "deactivated" : "reactivated"}.`);
      fetchUsers();
    } catch (err) {
      setError(err.message || "Could not update status.");
    }
  };

  const submitReset = async (id) => {
    if (!newPassword || newPassword.length < 6) {
      return setError("New password must be at least 6 characters.");
    }
    setError(""); setInfo("");
    setSaving(true);
    try {
      await api.put(`/admin/users/${id}/reset-password`, { newPassword });
      setInfo("Password reset. Share the new password with the staff member securely.");
      setResettingId(null);
      setNewPassword("");
    } catch (err) {
      setError(err.message || "Could not reset password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Staff Accounts</h3>
          <span className="text-xs text-slate-400 dark:text-slate-500">({users.length})</span>
        </div>
        <button
          onClick={() => setShowCreate((s) => !s)}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-teal-500/20"
        >
          <UserPlus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl px-4 py-3 text-rose-600 dark:text-rose-400 text-sm font-medium">
          {error}
        </div>
      )}
      {info && !error && (
        <div className="bg-teal-50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30 rounded-xl px-4 py-3 text-teal-700 dark:text-teal-400 text-sm font-medium">
          {info}
        </div>
      )}

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" value={createForm.fullName} onChange={(v) => setCreateForm(f => ({ ...f, fullName: v }))} />
            <Field label="Email" type="email" value={createForm.email} onChange={(v) => setCreateForm(f => ({ ...f, email: v }))} />
            <Field label="Phone" value={createForm.phone} onChange={(v) => setCreateForm(f => ({ ...f, phone: v }))} placeholder="10-digit mobile" />
            <Field label="Temporary Password" type="password" value={createForm.password} onChange={(v) => setCreateForm(f => ({ ...f, password: v }))} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Role</label>
            <select
              value={createForm.role}
              onChange={(e) => setCreateForm(f => ({ ...f, role: e.target.value }))}
              className="w-full sm:w-64 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-teal-500"
            >
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          {createForm.role !== "ADMIN" && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Modules</label>
              <div className="flex gap-2 flex-wrap">
                {MODULES.map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => toggleCreateModule(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      createForm.modules.includes(m)
                        ? "bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-500/20"
                        : "text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 text-sm font-semibold px-4 py-2.5 rounded-xl disabled:opacity-50">
              {saving ? "Creating..." : "Create Account"}
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="text-sm text-slate-500 dark:text-slate-400 px-4 py-2.5">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 text-sm font-medium">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading staff accounts...
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50">
                  {["Name", "Contact", "Role", "Modules", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-slate-100 dark:border-slate-800/50">
                    {editingId === u.id ? (
                      <td colSpan={6} className="px-5 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <Field label="Full Name" value={editForm.fullName} onChange={(v) => setEditForm(f => ({ ...f, fullName: v }))} />
                          <Field label="Email" value={editForm.email} onChange={(v) => setEditForm(f => ({ ...f, email: v }))} />
                          <Field label="Phone" value={editForm.phone} onChange={(v) => setEditForm(f => ({ ...f, phone: v }))} />
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Role</label>
                            <select
                              value={editForm.role}
                              onChange={(e) => setEditForm(f => ({ ...f, role: e.target.value }))}
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-teal-500"
                            >
                              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                          </div>
                        </div>
                        {editForm.role !== "ADMIN" && (
                          <div className="mb-3">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Modules</label>
                            <div className="flex gap-2 flex-wrap">
                              {MODULES.map((m) => (
                                <button
                                  type="button"
                                  key={m}
                                  onClick={() => toggleEditModule(m)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                                    editForm.modules.includes(m)
                                      ? "bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-500/20"
                                      : "text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                                  }`}
                                >
                                  {m}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(u.id)} disabled={saving} className="flex items-center gap-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 text-xs font-semibold px-3 py-2 rounded-lg disabled:opacity-50">
                            <Check className="w-3.5 h-3.5" /> Save
                          </button>
                          <button onClick={() => setEditingId(null)} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 px-3 py-2">
                            <X className="w-3.5 h-3.5" /> Cancel
                          </button>
                        </div>
                      </td>
                    ) : resettingId === u.id ? (
                      <td colSpan={6} className="px-5 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password (min 6 chars)"
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-teal-500"
                          />
                          <button onClick={() => submitReset(u.id)} disabled={saving} className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 text-xs font-semibold px-3 py-2 rounded-lg disabled:opacity-50">
                            Reset Password
                          </button>
                          <button onClick={() => { setResettingId(null); setNewPassword(""); }} className="text-xs text-slate-500 dark:text-slate-400 px-3 py-2">
                            Cancel
                          </button>
                        </div>
                      </td>
                    ) : (
                      <>
                        <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-white">{u.fullName}</td>
                        <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                          <div>{u.email}</div>
                          <div className="text-xs">{u.phone}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${ROLE_COLORS[u.role]}`}>{u.role}</span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">{(u.modules || []).join(", ") || "—"}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                            u.isActive
                              ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                          }`}>
                            {u.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex gap-1">
                            <IconBtn title="Edit" onClick={() => startEdit(u)}><Pencil className="w-3.5 h-3.5" /></IconBtn>
                            <IconBtn title="Reset Password" onClick={() => { setResettingId(u.id); setNewPassword(""); }}><KeyRound className="w-3.5 h-3.5" /></IconBtn>
                            <IconBtn title={u.isActive ? "Deactivate" : "Activate"} onClick={() => toggleActive(u)}><Power className="w-3.5 h-3.5" /></IconBtn>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-teal-500"
      />
    </div>
  );
}

function IconBtn({ children, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      {children}
    </button>
  );
}