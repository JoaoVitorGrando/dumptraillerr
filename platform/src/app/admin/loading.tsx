export default function AdminLoading() {
  return (
    <div className="space-y-4 sm:space-y-5 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`kpi-primary-${i}`} className="h-24 rounded-xl border border-gray-200 bg-white/70" />
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`kpi-secondary-${i}`} className="h-24 rounded-xl border border-gray-200 bg-white/70" />
        ))}
      </div>

      <div className="h-16 rounded-xl border border-gray-200 bg-white/70" />
      <div className="h-16 rounded-xl border border-gray-200 bg-white/70" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-72 rounded-xl border border-gray-200 bg-white/70" />
        <div className="h-72 rounded-xl border border-gray-200 bg-white/70" />
      </div>
    </div>
  );
}
