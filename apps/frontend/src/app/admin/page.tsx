"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminGuard } from "@/components/admin-guard";

const AdminPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to posts page as the main admin view
    router.replace("/admin/posts");
  }, [router]);

  return (
    <AdminGuard>
      <div className="text-center py-10">Redirecting to admin posts...</div>
    </AdminGuard>
  );
};

export default AdminPage;


