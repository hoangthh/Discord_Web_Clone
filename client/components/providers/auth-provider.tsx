"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks";

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

  if (isLoading || isRedirecting) return <div>Loading...</div>;

  return <>{children}</>;
}
