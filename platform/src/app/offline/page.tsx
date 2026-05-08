export default function OfflinePage() {
  return (
    <main className="flex-1">
      <section className="container-page py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange">
            Offline Mode
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-brand-dark">
            You are offline right now
          </h1>
          <p className="mt-3 text-sm text-brand-gray">
            Check your connection and try again. Already visited pages may still be available from
            cache.
          </p>
        </div>
      </section>
    </main>
  );
}
