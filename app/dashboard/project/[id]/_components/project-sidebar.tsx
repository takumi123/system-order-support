"use client";

import { cn } from "@/lib/utils";
import { FileText, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProjectSidebarProps {
  projectId: string;
}

export function ProjectSidebar({ projectId }: ProjectSidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "概要",
      icon: Settings,
      href: `/dashboard/project/${projectId}`,
      active: pathname === `/dashboard/project/${projectId}`,
    },
    {
      label: "要件定義",
      icon: FileText,
      href: `/dashboard/project/${projectId}/requirements`,
      active: pathname === `/dashboard/project/${projectId}/requirements`,
    },
  ];

  return (
    <div className="space-y-4 flex flex-col h-full text-primary bg-secondary">
      <div className="p-3 flex flex-1 justify-center">
        <div className="space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                route.active && "bg-primary/10"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3")} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
