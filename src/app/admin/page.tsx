"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, ShieldCheck, Crown, UserCog, Pen } from "lucide-react";
import { TopAppBar } from "@/components/TopAppBar";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/lib/auth-client";
import { toast } from "@/components/Toast";

type ManagedUser = {
  id: string;
  username: string | null;
  label: string;
  plan: string;
  createdAt: number;
};

const PLANS = [
  { value: "weekly" as const, label: "Premium Mingguan (7 hari)", price: "Rp 5.000" },
  { value: "monthly" as const, label: "Premium Bulanan (30 hari)", price: "Rp 15.000" },
  { value: "lifetime" as const, label: "Premium Lifetime (Selamanya)", price: "Rp 50.000" },
];

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [label, setLabel] = useState("");
  const [plan, setPlan] = useState<"weekly" | "monthly" | "lifetime">("monthly");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const isAdmin = user?.role === "admin";

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) return;
      setUsers(await res.json());
    } catch {}
  }, []);

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin, fetchUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Username dan password harus diisi");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.set("username", username.trim().toLowerCase());
    formData.set("password", password);
    formData.set("label", label.trim() || username.trim());
    formData.set("plan", plan);

    const res = await fetch("/api/admin/create-user", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (!res.ok) {
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        setError(data.error || "Gagal membuat user");
      } catch {
        setError(text || "Gagal membuat user");
      }
      return;
    }

    const data = await res.json();
    if (data.error) {
      setError(data.error);
      return;
    }

    setUsername("");
    setPassword("");
    setLabel("");
    fetchUsers();
  };

  const startEdit = (u: ManagedUser) => {
    setEditingUser(u);
    setEditUsername(u.username ?? "");
    setEditLabel(u.label);
    setEditPassword("");
    setEditError("");
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editUsername.trim()) {
      setEditError("Username tidak boleh kosong");
      return;
    }

    setEditLoading(true);
    setEditError("");

    const body: Record<string, any> = { id: editingUser.id };

    const newUsername = editUsername.trim().toLowerCase();
    if (newUsername !== editingUser.username) {
      body.username = newUsername;
    }

    const newLabel = editLabel.trim() || newUsername;
    if (newLabel !== editingUser.label) {
      body.label = newLabel;
    }

    if (editPassword) {
      body.password = editPassword;
    }

    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setEditLoading(false);

    if (!res.ok) {
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        setEditError(data.error || "Gagal menyimpan perubahan");
      } catch {
        setEditError(text || "Gagal menyimpan perubahan");
      }
      return;
    }

    const data = await res.json();
    if (data.error) {
      setEditError(data.error);
      return;
    }

    setEditingUser(null);
    fetchUsers();

    if (editPassword) {
      toast("success", `Password ${newUsername} berhasil diubah`);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchUsers();
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
            disabled={loading}
            className="mt-4 flex h-10 items-center gap-2 rounded-lg bg-primary-container px-5 text-sm font-semibold text-on-primary-container transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          >
            <Crown className="h-4 w-4" />
            {loading ? "Menyimpan..." : "Tambah User"}
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
                    <tr key={u.id} className="border-b border-outline-variant/10 text-on-surface">
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
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEdit(u)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant/50 transition-colors hover:bg-primary-container/20 hover:text-primary-container"
                          >
                            <Pen className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant/50 transition-colors hover:bg-red-500/20 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-xl border border-outline-variant bg-surface-container-high shadow-xl">
            <form onSubmit={handleEdit} className="p-5">
              <h3 className="mb-4 text-sm font-semibold text-on-surface">Edit User</h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-on-surface-variant">Username</label>
                  <input
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="h-10 w-full rounded-lg border border-outline-variant/50 bg-surface px-3 text-sm text-on-surface outline-none transition-colors focus:border-primary-container"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-on-surface-variant">Label</label>
                  <input
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="h-10 w-full rounded-lg border border-outline-variant/50 bg-surface px-3 text-sm text-on-surface outline-none transition-colors focus:border-primary-container"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-on-surface-variant">
                    Password <span className="text-on-surface-variant/50">(biarkan kosong jika tidak diubah)</span>
                  </label>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Kosongkan jika tidak diubah"
                    className="h-10 w-full rounded-lg border border-outline-variant/50 bg-surface px-3 text-sm text-on-surface outline-none transition-colors focus:border-primary-container"
                  />
                </div>
              </div>
              {editError && <p className="mt-2 text-xs text-red-400">{editError}</p>}
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex h-10 flex-1 items-center justify-center rounded-lg border border-outline-variant/50 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-higher"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex h-10 flex-1 items-center justify-center rounded-lg bg-primary-container text-sm font-semibold text-on-primary-container transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                >
                  {editLoading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
