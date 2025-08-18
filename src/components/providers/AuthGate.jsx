"use client";

import LoginDialog from "@/app/dashboard/_components/LoginDialog";
import { Loader2 } from "lucide-react";
import { useAuth } from "./AuthProvider";

export default function AuthGate({ children }) {
  const { isChecking, isAuthenticated ,tokens} = useAuth();
  console.log(tokens)
  if (isChecking) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span className="text-sm opacity-80">Loading…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          <span className="text-sm opacity-80">Checking account…</span>
        </div>
        <LoginDialog />
      </>
    );
  }

  return <>{children}</>;
}
