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
  error: <ShieldOff className="h-5 w-5 text-accent" />,
  success: <CheckCircle className="h-5 w-5 text-secondary" />,
  warning: <AlertTriangle className="h-5 w-5 text-tertiary" />,
  info: <Info className="h-5 w-5 text-quinary" />,
};

const BG: Record<ToastType, string> = {
  error: "border-accent bg-accent/10",
  success: "border-secondary bg-secondary/10",
  warning: "border-tertiary bg-tertiary/10",
  info: "border-quinary bg-quinary/10",
};

const SHADOW: Record<ToastType, string> = {
  error: "shadow-[4px_4px_0_#FF3AF2]",
  success: "shadow-[4px_4px_0_#00F5D4]",
  warning: "shadow-[4px_4px_0_#FFE600]",
  info: "shadow-[4px_4px_0_#7B2FFF]",
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
    <div className="fixed bottom-24 left-1/2 z-[200] flex -translate-x-1/2 flex-col gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className={`flex min-w-[320px] max-w-[90vw] items-center gap-3 border-4 rounded-2xl px-4 py-3 backdrop-blur-xl ${BG[item.type]} ${SHADOW[item.type]}`}
          style={{ animation: "toastIn 0.3s ease-out" }}
        >
          {ICONS[item.type]}
          <p className="flex-1 text-sm font-bold text-foreground">{item.message}</p>
          <button onClick={() => remove(item.id)} className="text-white/40 hover:text-accent transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
