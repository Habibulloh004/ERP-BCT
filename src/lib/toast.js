"use client";

import React from "react";
import { toast } from "sonner";
import { Check, XCircle, AlertTriangle, Loader2 } from "lucide-react";

const COLORS = {
  success: { box: "bg-emerald-500", border: "border-emerald-100" },
  error:   { box: "bg-red-500",     border: "border-red-100" },
  warning: { box: "bg-amber-500",   border: "border-amber-100" },
  loading: { box: "bg-sky-500",     border: "border-sky-100" },
};

function BaseToast({ variant = "success", title, description }) {
  const c = COLORS[variant] || COLORS.success;

  const Icon =
    variant === "success" ? Check :
    variant === "error"   ? XCircle :
    variant === "warning" ? AlertTriangle :
    Loader2;

  return (
    <div
      className={`
        w-[350px]   /* ✅ kenglikni fiks qildik */
        min-w-[350px] 
        max-w-[350px] 
        rounded-b-xl border ${c.border} bg-white p-4 shadow-lg
      `}
    >
      <div className="flex items-start">
        {/* chap icon box */}
        <div className={`mr-3 h-12 w-12 flex items-center justify-center rounded-xl ${c.box}`}>
          <Icon className={`h-6 w-6 text-white ${variant === "loading" ? "animate-spin" : ""}`} />
        </div>

        {/* matn */}
        <div className="flex-1">
          <div className="text-[18px] font-semibold text-gray-900">
            {title || ""}
          </div>
          {description && (
            <div className="mt-1 text-[15px] text-gray-600 leading-snug">
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// helpers
export function toastSuccess(p = {}) {
  return toast.custom(() => <BaseToast variant="success" {...p} />, {
    duration: p.duration ?? 3000,
    closeButton: true,
  });
}

export function toastError(p = {}) {
  return toast.custom(() => <BaseToast variant="error" {...p} />, {
    duration: p.duration ?? 3500,
    closeButton: true,
  });
}

export function toastWarning(p = {}) {
  return toast.custom(() => <BaseToast variant="warning" {...p} />, {
    duration: p.duration ?? 3000,
    closeButton: true,
  });
}

export function toastLoading(p = {}) {
  return toast.custom(() => <BaseToast variant="loading" {...p} />, {
    duration: Infinity,
    closeButton: false,
  });
}
