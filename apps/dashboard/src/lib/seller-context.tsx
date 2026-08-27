"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { createClient } from "@ansaa/shared/supabase/client";
import type { Seller, SellerUser } from "@ansaa/shared/types";

export type SellerAuthStatus = "loading" | "unauthenticated" | "authenticated";

export type { SellerUser };

type SellerContextValue = {
  status: SellerAuthStatus;
  user: SellerUser | null;
  seller: Seller | null;
  sellerError: string | null;
  signOut: () => Promise<void>;
};

const SellerContext = createContext<SellerContextValue | null>(null);

export function SellerProvider({
  children,
  user,
  seller,
  sellerError,
}: {
  children: React.ReactNode;
  user: SellerUser;
  seller: Seller | null;
  sellerError: string | null;
}) {
  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({
      status: "authenticated" as const,
      user,
      seller,
      sellerError,
      signOut,
    }),
    [user, seller, sellerError, signOut]
  );

  return <SellerContext.Provider value={value}>{children}</SellerContext.Provider>;
}

export function useSeller() {
  const ctx = useContext(SellerContext);
  if (!ctx) {
    throw new Error("useSeller must be used within SellerProvider");
  }
  return ctx;
}
