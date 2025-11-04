"use client";

import { LogoutButton } from "@/components/logout-button";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-semibold">Admin Panel</h1>
            <nav className="flex items-center gap-4">
              <Link 
                href="/admin/posts" 
                className="text-sm hover:underline underline-offset-4"
              >
                Posts
              </Link>
              <Link 
                href="/" 
                className="text-sm hover:underline underline-offset-4"
                target="_blank"
              >
                View Site
              </Link>
            </nav>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Admin Content */}
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        {children}
      </main>
    </div>
  );
}


