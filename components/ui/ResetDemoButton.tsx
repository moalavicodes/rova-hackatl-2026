"use client";

// Restores the seeded demo state for every view (D-005), so the README demo path can be rerun.

import { resetDemo } from "@/lib/data/store";

export function ResetDemoButton() {
  return (
    <button
      type="button"
      onClick={resetDemo}
      className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
    >
      Reset demo
    </button>
  );
}
