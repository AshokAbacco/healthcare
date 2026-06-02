// client/src/components/UI.jsx

// ── Stat Card ──────────────────────────────────────────────
export function StatCard({ label, value, icon, color = "blue", sub }) {
  const colorMap = {
    blue:   "from-blue-50 to-blue-100/50 dark:from-blue-500/20 dark:to-blue-600/10 border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400",
    green:  "from-emerald-50 to-emerald-100/50 dark:from-emerald-500/20 dark:to-emerald-600/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    yellow: "from-amber-50 to-amber-100/50 dark:from-amber-500/20 dark:to-amber-600/10 border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400",
    purple: "from-violet-50 to-violet-100/50 dark:from-violet-500/20 dark:to-violet-600/10 border-violet-200 dark:border-violet-500/20 text-violet-600 dark:text-violet-400",
    red:    "from-red-50 to-red-100/50 dark:from-red-500/20 dark:to-red-600/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400",
    cyan:   "from-cyan-50 to-cyan-100/50 dark:from-cyan-500/20 dark:to-cyan-600/10 border-cyan-200 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400",
    teal:   "from-teal-50 to-teal-100/50 dark:from-teal-500/20 dark:to-teal-600/10 border-teal-200 dark:border-teal-500/20 text-teal-600 dark:text-teal-400",
  };
  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-2xl p-5 flex items-center gap-4 transition-colors duration-300`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <div className="text-2xl font-bold text-slate-800 dark:text-white">{value}</div>
        <div className="text-slate-600 dark:text-slate-400 text-sm">{label}</div>
        {sub && <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

// ── Status Badge ───────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    Admitted:   "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
    Discharged: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
    Active:     "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
    Stable:     "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
    Improving:  "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
    Chronic:    "bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
    Mild:       "bg-yellow-50 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20",
    Good:       "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
    Critical:   "bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${map[status] || "bg-slate-100 dark:bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-500/20"}`}>
      {status}
    </span>
  );
}

// ── Delete Confirmation Modal ──────────────────────────────
export function DeleteModal({ onConfirm, onCancel, name }) {
  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="text-4xl text-center mb-3">🗑️</div>
        <h3 className="text-slate-800 dark:text-white font-bold text-lg text-center mb-2">Delete Patient</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-6">
          Are you sure you want to delete{" "}
          <span className="text-slate-800 dark:text-white font-semibold">{name}</span>?{" "}
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium text-sm border border-slate-200 dark:border-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors font-medium text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────
export function EmptyState({ icon = "📭", message = "No records found" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="text-slate-400 dark:text-slate-500 text-sm">{message}</p>
    </div>
  );
}

// ── Pagination ─────────────────────────────────────────────
export function Pagination({ current, total, onPageChange }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-colors"
      >
        ← Prev
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors border ${
            p === current
              ? "bg-teal-500 dark:bg-teal-500 text-white border-teal-500"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current === total}
        className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-colors"
      >
        Next →
      </button>
    </div>
  );
}

// ── Search Bar ─────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500 dark:focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 text-sm w-64 transition-colors"
      />
    </div>
  );
}

// ── Page Header ────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h1>
        {subtitle && <p className="text-slate-500 dark:text-slate-500 text-sm mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Table Container ────────────────────────────────────────
export function TableCard({ children }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {children}
        </table>
      </div>
    </div>
  );
}

export function Th({ children }) {
  return (
    <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 whitespace-nowrap">
      {children}
    </th>
  );
}

export function Td({ children, className = "" }) {
  return (
    <td className={`px-4 py-3.5 text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800/50 ${className}`}>
      {children}
    </td>
  );
}

// ── Form Input ─────────────────────────────────────────────
export function FormInput({ label, type = "text", value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500 dark:focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 text-sm transition-colors"
      />
    </div>
  );
}

export function FormSelect({ label, value, onChange, options, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white focus:outline-none focus:border-teal-500 dark:focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 text-sm transition-colors"
      >
        <option value="">Select...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function FormTextarea({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500 dark:focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 text-sm transition-colors resize-none"
      />
    </div>
  );
}

// ── Section Card ───────────────────────────────────────────
export function SectionCard({ title, children, icon }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-none transition-colors duration-300">
      {title && (
        <h3 className="text-slate-800 dark:text-white font-semibold mb-4 flex items-center gap-2 text-sm">
          {icon && <span>{icon}</span>}
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

// ── Action Button ──────────────────────────────────────────
export function ActionBtn({ onClick, type = "view", disabled }) {
  const styles = {
    view:   "text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10",
    edit:   "text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10",
    delete: "text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10",
  };
  const icons = { view: "👁", edit: "✏️", delete: "🗑️" };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded-lg transition-colors border border-transparent ${styles[type]} disabled:opacity-40`}
      title={type}
    >
      <span className="text-xs">{icons[type]}</span>
    </button>
  );
}