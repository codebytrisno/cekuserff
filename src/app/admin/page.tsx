"use client";

import { useState } from "react";
import { Plus, Trash2, ShieldCheck, Crown, UserCog } from "lucide-react";
import { TopAppBar } from "@/components/TopAppBar";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/lib/auth";
import { useAdminStore, type ManagedUser } from "@/lib/adminStore";

const PLANS = [
  { value: "weekly" as const, label: "Premium Mingguan (7 hari)", price: "Rp 5.000" },
  { value: "monthly" as const, label: "Premium Bulanan (30 hari)", price: "Rp 15.000" },
  { value: "lifetime" as const, label: "Premium Lifetime (Selamanya)", price: "Rp 50.000" },
];

export default function AdminPage() {
  const { user } = useAuth();
  const { users, addUser, removeUser } = useAdminStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [label, setLabel] = useState("");
  const [plan, setPlan] = useState<"weekly" | "monthly" | "lifetime">("monthly");
  const [error, setError] = useState("");

  const isAdmin = user?.username === "codebytrisno";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Username dan password harus diisi");
      return;
    }

    const newUser: ManagedUser = {
      username: username.trim().toLowerCase(),
      password,
      label: label.trim() || username.trim(),
      plan,
      createdAt: Date.now(),
    };

    const ok = addUser(newUser);
    if (!ok) {
      setError("Username sudah ada");
      return;
    }

    setUsername("");
    setPassword("");
    setLabel("");
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <TopAppBar title="Admin" />
        <main className="mx-auto max-w-container-max px-4 pt-20 text-center">
          <div className="flex flex-col items-center gap-4 py-20">
            <UserCog className="h-16 w-16 text-on-surface-variant/30" />
            <p className="text-on-surface-variant/50">Akses ditolak. Hanya admin yang bisa mengakses halaman ini.</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopAppBar title="Admin Panel" />

      <main className="mx-auto max-w-container-max space-y-8 px-4 pt-20">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container/20">
            <UserCog className="h-8 w-8 text-primary-container" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface">Kelola User Premium</h1>
          <p className="mt-2 text-sm text-on-surface-variant/80">
            Tambah atau hapus user yang bisa login dan mendapatkan akses premium
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-xl border border-outline-variant/50 bg-surface-container/50 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-on-surface">
            <Plus className="h-4 w-4 text-primary-container" />
            Tambah User Baru
          </h2>
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-on-surface-variant">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="h-10 w-full rounded-lg border border-outline-variant/50 bg-surface px-3 text-sm text-on-surface outline-none transition-colors focus:border-primary-container"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-on-surface-variant">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="h-10 w-full rounded-lg border border-outline-variant/50 bg-surface px-3 text-sm text-on-surface outline-none transition-colors focus:border-primary-container"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-on-surface-variant">Label (opsional)</label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Nama tampilan"
                className="h-10 w-full rounded-lg border border-outline-variant/50 bg-surface px-3 text-sm text-on-surface outline-none transition-colors focus:border-primary-container"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-on-surface-variant">Paket</label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as typeof plan)}
                className="h-10 w-full rounded-lg border border-outline-variant/50 bg-surface px-3 text-sm text-on-surface outline-none transition-colors focus:border-primary-container"
              >
                {PLANS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>
          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            className="mt-4 flex h-10 items-center gap-2 rounded-lg bg-primary-container px-5 text-sm font-semibold text-on-primary-container transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <Crown className="h-4 w-4" />
            Tambah User
          </button>
        </form>

        {/* User list */}
        <section className="rounded-xl border border-outline-variant/50 bg-surface-container/50 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-on-surface">
            <ShieldCheck className="h-4 w-4 text-primary-container" />
            Daftar User ({users.length})
          </h2>

          {users.length === 0 ? (
            <p className="py-8 text-center text-sm text-on-surface-variant/50">Belum ada user. Tambah user baru di atas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-xs text-on-surface-variant">
                    <th className="pb-2 font-medium">Username</th>
                    <th className="pb-2 font-medium">Label</th>
                    <th className="pb-2 font-medium">Paket</th>
                    <th className="pb-2 font-medium">Dibuat</th>
                    <th className="pb-2 font-medium w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.username} className="border-b border-outline-variant/10 text-on-surface">
                      <td className="py-3 font-medium">{u.username}</td>
                      <td className="py-3 text-on-surface-variant">{u.label}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          u.plan === "lifetime" ? "bg-[#00D68F]/20 text-[#00D68F]" :
                          u.plan === "monthly" ? "bg-primary-container/20 text-primary-container" :
                          "bg-[#FFB300]/20 text-[#FFB300]"
                        }`}>
                          {PLANS.find((p) => p.value === u.plan)?.label.split(" (")[0] ?? u.plan}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-on-surface-variant/50">
                        {new Date(u.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => removeUser(u.username)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant/50 transition-colors hover:bg-red-500/20 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
