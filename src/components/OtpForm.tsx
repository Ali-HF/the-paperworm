"use client";

import { useActionState, useRef, useState, useEffect } from "react";
import { verifyCodeAction } from "@/app/actions/auth-actions";

export default function OtpForm({ email }: { email: string }) {
  const [state, formAction, isPending] = useActionState(verifyCodeAction, undefined);
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const combinedCode = digits.join("");

  // Auto-focus the first input on load
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, val: string) => {
    const sanitizedVal = val.replace(/[^0-9]/g, "");
    if (!sanitizedVal) {
      const newDigits = [...digits];
      newDigits[index] = "";
      setDigits(newDigits);
      return;
    }

    const newDigits = [...digits];
    // Fill digits from the pasted text if they type/paste multiple numbers
    if (sanitizedVal.length > 1) {
      const splitDigits = sanitizedVal.slice(0, 6 - index).split("");
      for (let i = 0; i < splitDigits.length; i++) {
        newDigits[index + i] = splitDigits[i];
      }
      setDigits(newDigits);
      const nextFocusIndex = Math.min(5, index + splitDigits.length);
      inputRefs.current[nextFocusIndex]?.focus();
      return;
    }

    newDigits[index] = sanitizedVal;
    setDigits(newDigits);

    // Auto-focus next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Current is empty, focus and clear the previous input
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      }
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (pastedData) {
      const newDigits = [...digits];
      const chars = pastedData.split("");
      for (let i = 0; i < chars.length; i++) {
        newDigits[i] = chars[i];
      }
      setDigits(newDigits);
      const focusIdx = Math.min(5, chars.length - 1);
      inputRefs.current[focusIdx]?.focus();
    }
  };

  return (
    <form action={formAction} className="space-y-6 w-full">
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="code" value={combinedCode} />

      <div className="flex justify-between gap-2 max-w-xs mx-auto">
        {digits.map((digit, idx) => (
          <input
            key={idx}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6} // allow larger paste size handled by handleChange
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={idx === 0 ? handlePaste : undefined}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            className="w-12 h-12 text-center text-xl font-bold rounded-lg border border-ink/20 bg-cream text-ink focus:border-oxblood focus:ring-1 focus:ring-oxblood focus:outline-none transition-colors"
          />
        ))}
      </div>

      {state?.error && <p className="text-sm text-oxblood text-center font-medium">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending || combinedCode.length !== 6}
        className="w-full px-5 py-2.5 rounded-full bg-oxblood text-cream hover:bg-oxblood-dark
                   transition-colors text-sm disabled:opacity-60 cursor-pointer font-semibold shadow-sm"
        style={{ fontFamily: "var(--font-stamp)" }}
      >
        {isPending ? "VERIFYING CODE…" : "VERIFY CODE"}
      </button>
    </form>
  );
}
