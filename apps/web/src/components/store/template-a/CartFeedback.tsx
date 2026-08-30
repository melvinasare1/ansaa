"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Check } from "lucide-react";

const CartFeedbackContext = createContext<{ notifyAdded: () => void } | null>(null);

export function useCartFeedback() {
  return useContext(CartFeedbackContext);
}

export function CartFeedbackProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const notifyAdded = useCallback(() => {
    setVisible(true);
    if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setVisible(false), 1800);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <CartFeedbackContext.Provider value={{ notifyAdded }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        {visible ? (
          <p className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white shadow-lg">
            <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
            Added to cart
          </p>
        ) : null}
      </div>
    </CartFeedbackContext.Provider>
  );
}
