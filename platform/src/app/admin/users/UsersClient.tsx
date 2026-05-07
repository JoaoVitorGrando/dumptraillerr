"use client";

import { useState, useTransition } from "react";

type UserRole = "CUSTOMER" | "OWNER" | "DRIVER" | "ADMIN";
type UserStatus = "PENDING" | "ACTIVE" | "SUSPENDED";

interface UserItem {
  id: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  ownerProfile: { id: string; companyName: string | null; approvedAt: string | null } | null;
  driverProfile: { id: string; licenseNumber: string | null; approvedAt: string | null } | null;
  customerProfile: { id: string } | null;
}

type Filter = "all" | "pending" | "CUSTOMER" | "OWNER" | "DRIVER";

const ROLE_COLORS: Record<UserRole, string> = {
  CUSTOMER: "bg-blue-50 text-blue-700 border-blue-200",
  OWNER: "bg-purple-50 text-purple-700 border-purple-200",
  DRIVER: "bg-orange-50 text-orange-700 border-orange-200",
  ADMIN: "bg-gray-100 text-gray-600 border-gray-200",
};

const STATUS_COLORS: Record<UserStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  ACTIVE: "bg-green-50 text-green-700 border-green-200",
  SUSPENDED: "bg-red-50 text-red-600 border-red-200",
};

function isPendingApproval(u: UserItem) {
  if (u.status === "PENDING") return true;
  if (u.ownerProfile && !u.ownerProfile.approvedAt) return true;
  if (u.driverProfile && !u.driverProfile.approvedAt) return true;
  return false;
}

export default function UsersClient({ initialUsers }: { initialUsers: UserItem[] }) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [filter, setFilter] = useState<Filter>("all");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    if (filter === "pending") return isPendingApproval(u);
    if (filter !== "all") return u.role === filter;
    return true;
  });

  const pendingCount = users.filter(isPendingApproval).length;

  function doAction(id: string, action: "approve" | "suspend" | "reactivate") {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setError(data.error ?? "Failed to update");
        return;
      }
      const newStatus = action === "suspend" ? "SUSPENDED" : "ACTIVE";
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                status: newStatus as UserStatus,
                ownerProfile: u.ownerProfile
                  ? { ...u.ownerProfile, approvedAt: action === "approve" ? new Date().toISOString() : u.ownerProfile.approvedAt }
                  : null,
                driverProfile: u.driverProfile
                  ? { ...u.driverProfile, approvedAt: action === "approve" ? new Date().toISOString() : u.driverProfile.approvedAt }
                  : null,
              }
            : u
        )
      );
    });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Users</h1>
        <p className="text-brand-gray mt-1 text-sm">
          {users.length} total · {pendingCount} pending approval
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", "pending", "CUSTOMER", "OWNER", "DRIVER"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
              filter === f
                ? "bg-brand-dark text-white border-brand-dark"
                : "bg-white text-brand-gray border-gray-200 hover:border-gray-300"
            }`}
          >
            {f === "pending" ? `⏳ Pending (${pendingCount})` : f.toLowerCase()}
          </button>
        ))}
      </div>

      <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${isPending ? "opacity-70" : ""}`}>
        {filtered.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-brand-gray">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-wider">User</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-wider hidden sm:table-cell">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-wider hidden md:table-cell">Joined</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-dark font-bold text-xs shrink-0">
                          {u.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-brand-dark">
                            {u.ownerProfile?.companyName ?? u.email.split("@")[0]}
                          </p>
                          <p className="text-xs text-brand-gray">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${ROLE_COLORS[u.role]}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[u.status]}`}>
                          {u.status}
                        </span>
                        {(u.ownerProfile && !u.ownerProfile.approvedAt) && (
                          <span className="text-xs text-amber-600 font-semibold">profile pending</span>
                        )}
                        {(u.driverProfile && !u.driverProfile.approvedAt) && (
                          <span className="text-xs text-amber-600 font-semibold">profile pending</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-brand-gray hidden md:table-cell">
                      {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2 justify-end">
                        {(isPendingApproval(u) || u.status === "SUSPENDED") && (
                          <button
                            type="button"
                            onClick={() => doAction(u.id, u.status === "SUSPENDED" ? "reactivate" : "approve")}
                            disabled={isPending}
                            className="text-xs font-semibold text-green-700 border border-green-200 rounded-lg px-3 py-1 hover:bg-green-50 transition-colors disabled:opacity-50"
                          >
                            {u.status === "SUSPENDED" ? "Reactivate" : "Approve"}
                          </button>
                        )}
                        {u.status === "ACTIVE" && (
                          <button
                            type="button"
                            onClick={() => doAction(u.id, "suspend")}
                            disabled={isPending}
                            className="text-xs font-semibold text-red-600 border border-red-200 rounded-lg px-3 py-1 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
