// client/src/pages/admin/AdminProfile.jsx
// Admin's own profile page — same restrained style as the shared
// pages/profile/Profile.jsx (plain white cards, one soft accent color, no
// gradient banners or colored icon chips), just with admin-specific content.
// Lives at its own route (/admin/profile), separate from the shared
// /profile used by Doctor/Receptionist/Pharmacy.
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Mail, Phone, ShieldCheck, Layers, KeyRound, Loader2, Eye, EyeOff, CheckCircle2,
} from "lucide-react";

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api`;

function getToken() {
  return localStorage.getItem("hms_token");
}

export default function AdminProfile() {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      return setError("Please fill in all password fields.");
    }
    if (newPassword.length < 6) {
      return setError("New password must be at least 6 characters.");
    }
    if (newPassword !== confirmPassword) {
      return setError("New password and confirmation do not match.");
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Could not update password.");
      } else {
        setSuccess("Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile overview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-sm">
            {user.username?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white truncate">{user.username}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Administrator</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoRow icon={Mail} label="Email" value={user.email} />
          <InfoRow icon={Phone} label="Phone" value={user.phone} />
          <InfoRow icon={ShieldCheck} label="Role" value="Admin" />
          <InfoRow icon={Layers} label="Access" value="All modules (OPD, IPD, Pharmacy)" />
        </div>
      </div>

      {/* Change password */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <KeyRound className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Change Password</h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={showCurrent}
            setShow={setShowCurrent}
            autoComplete="current-password"
          />
          <PasswordField
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            show={showNew}
            setShow={setShowNew}
            autoComplete="new-password"
          />
          <PasswordField
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirm}
            setShow={setShowConfirm}
            autoComplete="new-password"
          />

          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl px-4 py-3 text-rose-600 dark:text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-teal-50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30 rounded-xl px-4 py-3 text-teal-700 dark:text-teal-400 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5" /> {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 font-bold text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-xl active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
      <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, setShow, autoComplete }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className="w-full bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 pr-11 text-slate-800 dark:text-slate-100 placeholder-slate-400/70 dark:placeholder-slate-600 focus:outline-none focus:border-teal-500 dark:focus:border-teal-500 focus:bg-white dark:focus:bg-slate-950 focus:shadow-[0_0_0_4px_rgba(20,184,166,0.1)] dark:focus:shadow-[0_0_0_4px_rgba(20,184,166,0.05)] transition-all duration-200 text-sm"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}