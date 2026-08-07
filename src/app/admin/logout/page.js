"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../../../services/authService";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      await authService.logout();
      router.replace("/");
    };
    performLogout();
  }, [router]);

  return null; // ✅ no UI rendered
}