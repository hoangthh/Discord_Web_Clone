"use client";

import { useAuth } from "@/hooks";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PUBLIC_ROUTES = ["/login", "/register", "/forgot"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { profile, isLoading } = useAuth();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (!isLoading && !profile?.id && !isPublicRoute) {
      setIsRedirecting(true);
      router.replace("/login");
    }
  }, [isLoading, profile, router, isPublicRoute]);

  if (isLoading || isRedirecting)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="all animate-spin transition" size={50} />
      </div>
    );

  return <>{children}</>;
}
