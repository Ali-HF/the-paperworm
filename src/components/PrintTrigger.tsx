"use client";

import { useEffect } from "react";

export default function PrintTrigger() {
  useEffect(() => {
    // Slight delay to allow layouts/fonts to render before print dialog opens
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center mb-8 print:hidden">
      <button
        onClick={() => window.print()}
        className="px-5 py-2.5 bg-oxblood text-cream rounded-full text-xs font-bold shadow hover:bg-oxblood-dark transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
        style={{ fontFamily: "var(--font-stamp)" }}
      >
        PRINT RECEIPT
      </button>
    </div>
  );
}
