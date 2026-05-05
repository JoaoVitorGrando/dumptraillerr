"use client";

import { useState } from "react";
import { DEMO_USERS, statusColor, statusLabel, type DemoUser } from "@/data/demo";

type Filter = "all" | "pending" | "owner" | "driver" | "customer";

export default function AdminUsersPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [users, setUsers] = useState<DemoUser[]>(DEMO_USERS);

  const filtered = users.filter((u) => {
    if (filter === "pending") return u.approvalStatus === "pending";
    if (filter !== "all") return u.role === filter;
    return true;
  });

  function approve(id: string) {
    // TODO: PATCH Supabase — update user metadata + profiles table
    setUsers((prev) =>
      prev.map((u) => u.id === id ? { ...u, approvalStatus: "approved" } : u)
    );
  }

  function reject(id: string) {
    setUsers((prev) =>
      prev.map((u) => u.id === id ? { ...u, approvalStatus: "rejected" } : u)
    );
  }

  const pendingCount = users.filter((u) => u.approvalStatus === "pending").length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Users</h1>
        <p className="text-brand-gray mt-1 text-sm">
          {users.length} total · {pendingCount} pending approval
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", "pending", "customer", "owner", "driver"] as Filter[]).map((f) => (
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
            {f === "pending" ? `⏳ Pending (${pendingCount})` : f}
          </button>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-wider hidden sm:table-cell">
                  Role
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-wider hidden md:table-cell">
                  Joined
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-dark font-bold text-xs shrink-0">
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-brand-dark">{u.name}</p>
                        <p className="text-xs text-brand-gray">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColor(u.role)}`}>
                      {statusLabel(u.role)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColor(u.approvalStatus)}`}>
                      {statusLabel(u.approvalStatus)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-brand-gray hidden md:table-cell">
                    {u.createdAt}
                  </td>
                  <td className="px-5 py-3.5">
                    {u.approvalStatus === "pending" && (
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => approve(u.id)}
                          className="text-xs font-semibold text-green-700 border border-green-200 rounded-lg px-3 py-1 hover:bg-green-50 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => reject(u.id)}
                          className="text-xs font-semibold text-red-600 border border-red-200 rounded-lg px-3 py-1 hover:bg-red-50 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
