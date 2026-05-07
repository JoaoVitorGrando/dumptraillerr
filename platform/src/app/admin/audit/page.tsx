import { prisma } from "@/lib/prisma";

export const metadata = { title: "Audit Log — Admin FAGU" };

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const ACTION_COLORS: Record<string, string> = {
  "booking.status": "bg-blue-50 text-blue-700 border-blue-200",
  "trailer.status": "bg-amber-50 text-amber-700 border-amber-200",
  "availability.block": "bg-purple-50 text-purple-700 border-purple-200",
  "user.approve": "bg-green-50 text-green-700 border-green-200",
  "user.suspend": "bg-red-50 text-red-600 border-red-200",
  "user.reactivate": "bg-green-50 text-green-700 border-green-200",
};

function getActionColor(action: string) {
  const prefix = Object.keys(ACTION_COLORS).find((k) => action.startsWith(k));
  return prefix ? ACTION_COLORS[prefix] : "bg-gray-100 text-gray-600 border-gray-200";
}

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const limit = 50;
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        action: true,
        entity: true,
        entityId: true,
        payload: true,
        createdAt: true,
        actor: { select: { email: true } },
        booking: { select: { id: true } },
      },
    }),
    prisma.auditLog.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Audit Log</h1>
        <p className="text-brand-gray mt-1 text-sm">{total} entries · Page {page} of {totalPages || 1}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {logs.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-brand-gray">No audit entries yet.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {logs.map((log) => (
              <div key={log.id} className="px-5 py-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                    <span className="text-xs text-brand-gray">
                      {log.entity} {log.entityId ? `#${log.entityId.slice(-8)}` : ""}
                    </span>
                  </div>
                  <p className="text-xs text-brand-gray">
                    by <strong className="text-brand-dark">{log.actor.email}</strong>
                    {log.booking && (
                      <span className="ml-2">· booking #{log.booking.id.slice(-8)}</span>
                    )}
                  </p>
                  {log.payload && (
                    <pre className="mt-1 text-[11px] text-brand-gray bg-gray-50 rounded px-2 py-1 overflow-x-auto">
                      {JSON.stringify(log.payload, null, 2)}
                    </pre>
                  )}
                </div>
                <p className="text-xs text-brand-gray shrink-0">{formatDate(log.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {page > 1 && (
            <a href={`/admin/audit?page=${page - 1}`} className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50">
              ← Previous
            </a>
          )}
          <span className="px-3 py-1.5 text-xs text-brand-gray">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <a href={`/admin/audit?page=${page + 1}`} className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50">
              Next →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
