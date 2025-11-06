// HECH QAYERGA "use client" YO'Q
import { cookies } from "next/headers";
import DashboardHeader from "./_components/DashboardHeader";
import { AuthProvider } from "@/components/providers/AuthProvider";
import AuthGate from "@/components/providers/AuthGate";

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const initialUserData = cookieStore.get("userData")?.value || null;

  return (
    <>
      <DashboardHeader />
      <AuthProvider initialUserData={initialUserData} cookieName="userData">
        <div className="pt-20 min-h-[60vh]">
          <AuthGate>
            {children}
          </AuthGate>
        </div>
      </AuthProvider>
    </>
  );
}
