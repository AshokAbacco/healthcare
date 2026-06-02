// client/src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menuConfig = {
  "receptionist-OPD": [
    { label: "Dashboard", icon: "📊", to: "/opd-dashboard" },
    { label: "Register Patient", icon: "➕", to: "/opd/register" },
    { label: "All Patients", icon: "👥", to: "/opd/patients" },
    { label: "Follow-Ups", icon: "📅", to: "/opd/followups" },
  ],
  "receptionist-IPD": [
    { label: "Dashboard", icon: "📊", to: "/ipd-dashboard" },
    { label: "Admit Patient", icon: "🛏️", to: "/ipd/admit" },
    { label: "All Patients", icon: "👥", to: "/ipd/patients" },
  ],
  "doctor-OPD": [
    { label: "OPD Patients", icon: "👥", to: "/doctor/opd" },
    { label: "Follow-Ups", icon: "📅", to: "/doctor/opd/followups" },
  ],
  "doctor-IPD": [
    { label: "IPD Patients", icon: "🛏️", to: "/doctor/ipd" },
  ],
};

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const key = user ? `${user.role}-${user.module}` : "";
  const links = menuConfig[key] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-30 shadow-sm dark:shadow-none`}>
      
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200 dark:border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/30">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        {!collapsed && (
          <div>
            <div className="text-slate-800 dark:text-white font-bold text-sm leading-tight">MediCore</div>
            <div className="text-teal-600 dark:text-teal-400 text-xs font-medium">HMS</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={collapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
          </svg>
        </button>
      </div>

      {/* Module Badge */}
      {!collapsed && user && (
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/50">
          <div className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 ${
            user.module === "OPD"
              ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
              : "bg-violet-50 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20"
          }`}>
            <span>{user.module === "OPD" ? "🏥" : "🛏️"}</span>
            {user.module} Module
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm font-medium ${
                isActive
                  ? "bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-transparent"
              }`
            }
          >
            <span className="text-base flex-shrink-0">{link.icon}</span>
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800">
        {!collapsed && user && (
          <div className="flex items-center gap-2.5 px-3 py-2 mb-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.username[0].toUpperCase()}
            </div>
            <div>
              <div className="text-slate-800 dark:text-white text-xs font-semibold capitalize">{user.username}</div>
              <div className="text-slate-500 dark:text-slate-500 text-xs capitalize">{user.role}</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all text-sm font-medium border border-transparent hover:border-red-100 dark:hover:border-red-500/20"
        >
          <span className="text-base flex-shrink-0">🚪</span>
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}