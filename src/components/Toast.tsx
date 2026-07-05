"use client";

import { useEffect, useState } from "react";
import { X, AlertTriangle, CheckCircle, Info, ShieldOff } from "lucide-react";

export type ToastType = "error" | "success" | "info" | "warning";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

let addToastFn: ((type: ToastType, message: string) => void) | null = null;

export function toast(type: ToastType, message: string) {
  addToastFn?.(type, message);
}

const ICONS: Record<ToastType, React.ReactNode> = {
  error: <ShieldOff className="h-5 w-5 text-error" />,
  success: <CheckCircle className="h-5 w-5 text-[#00D68F]" />,
  warning: <AlertTriangle className="h-5 w-5 text-[#FFB300]" />,
  info: <Info className="h-5 w-5 text-primary-container" />,
};

const BG: Record<ToastType, string> = {
  error: "border-error/30 bg-error/10",
  success: "border-[#00D68F]/30 bg-[#00D68F]/10",
  warning: "border-[#FFB300]/30 bg-[#FFB300]/10",
  info: "border-primary-container/30 bg-primary-container/10",
};

export function ToastContainer() {
  const [items, setItems] = useState<ToastItem[]>([]);
  let id = 0;

  useEffect(() => {
    addToastFn = (type: ToastType, message: string) => {
      const newId = ++id;
      setItems((prev) => [...prev, { id: newId, type, message }]);
      setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== newId));
      }, 4000);
    };
    return () => { addToastFn = null; };
  }, []);

  const remove = (toastId: number) => {
    setItems((prev) => prev.filter((t) => t.id !== toastId));
  };

  return (
    <div className="fixed bottom-24 left-1/2 z-[200] flex -translate-x-1/2 flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={`flex min-w-[300px] max-w-[90vw] items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-xl ${BG[item.type]} animate-in slide-in-from-bottom-4`}
          style={{ animation: "toastIn 0.3s ease-out" }}
        >
          {ICONS[item.type]}
          <p className="flex-1 text-sm font-medium text-on-surface">{item.message}</p>
          <button onClick={() => remove(item.id)} className="text-on-surface-variant/50 hover:text-on-surface">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <style>{`@keyframes toastIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}
