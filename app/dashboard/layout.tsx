'use client';

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { ProjectSidebar } from "./project/[id]/_components/project-sidebar";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const projectIdMatch = pathname?.match(/^\/dashboard\/project\/(.+)$/);
  const isProjectPage = !!projectIdMatch;

  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        <Suspense fallback={null}>
          {isProjectPage && projectIdMatch?.[1] ? (
            <ProjectSidebar projectId={projectIdMatch[1]} />
          ) : (
            <Sidebar />
          )}
        </Suspense>
        <main className="flex-1 pl-64 pt-14 pb-14">
          <div className="container max-w-screen-2xl p-6">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
