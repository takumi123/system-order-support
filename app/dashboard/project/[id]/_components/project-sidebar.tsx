"use client";

import { cn } from "@/lib/utils";
import {
  FileText,
  Settings,
  Layout,
  Calendar,
  Users,
  FileCheck,
  GitPullRequest,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ProjectSidebar() {
  const pathname = usePathname();
  const { id: projectId } = useParams();

  console.log('Project ID:', projectId);

  const routes = [
    {
      label: "概要",
      icon: Settings,
      href: `/dashboard/project/${projectId}`,
      active: pathname === `/dashboard/project/${projectId}`,
    },
    {
      label: "プロジェクト計画",
      icon: Calendar,
      subroutes: [
        {
          label: "スケジュール",
          href: `/dashboard/project/${projectId}/planning/schedule`,
          active:
            pathname ===
            `/dashboard/project/${projectId}/planning/schedule`,
        },
        {
          label: "予算",
          href: `/dashboard/project/${projectId}/planning/budget`,
          active:
            pathname ===
            `/dashboard/project/${projectId}/planning/budget`,
        },
      ],
    },
    {
      label: "要件定義",
      icon: FileText,
      subroutes: [
        {
          label: "機能一覧",
          href: `/dashboard/project/${projectId}/requirements/functions`,
          active:
            pathname ===
            `/dashboard/project/${projectId}/requirements/functions`,
        },
        {
          label: "画面一覧",
          href: `/dashboard/project/${projectId}/requirements/screens`,
          active:
            pathname ===
            `/dashboard/project/${projectId}/requirements/screens`,
        },
        {
          label: "ユースケース",
          href: `/dashboard/project/${projectId}/requirements/usecases`,
          active:
            pathname ===
            `/dashboard/project/${projectId}/requirements/usecases`,
        },
        {
          label: "画面フロー",
          href: `/dashboard/project/${projectId}/requirements/screenflow`,
          active:
            pathname ===
            `/dashboard/project/${projectId}/requirements/screenflow`,
        },
      ],
    },
    {
      label: "開発企業選定",
      icon: Users,
      subroutes: [
        {
          label: "RFP",
          href: `/dashboard/project/${projectId}/vendor/rfp`,
          active: pathname === `/dashboard/project/${projectId}/vendor/rfp`,
        },
        {
          label: "提案書評価",
          href: `/dashboard/project/${projectId}/vendor/evaluation`,
          active:
            pathname ===
            `/dashboard/project/${projectId}/vendor/evaluation`,
        },
      ],
    },
    {
      label: "開発プロセス管理",
      icon: GitPullRequest,
      href: `/dashboard/project/${projectId}/development`,
      active: pathname === `/dashboard/project/${projectId}/development`,
    },
    {
      label: "UAT",
      icon: FileCheck,
      href: `/dashboard/project/${projectId}/uat`,
      active: pathname === `/dashboard/project/${projectId}/uat`,
    },
    {
      label: "ワイヤーフレーム",
      icon: Layout,
      href: `/dashboard/project/${projectId}/wireframes`,
      active: pathname === `/dashboard/project/${projectId}/wireframes`,
    },
  ];

  console.log('Current pathname:', pathname);
  routes.forEach(route => {
    console.log('Route href:', route.href);
    if (route.subroutes) {
      route.subroutes.forEach(subroute => {
        console.log('Subroute href:', subroute.href);
      });
    }
  });

  return (
    <div className="space-y-4 flex flex-col h-full text-primary bg-secondary">
      <div className="p-3 flex flex-1 justify-center">
        <div className="space-y-2 w-full">
          {routes.map((route) => (
            <div key={route.label}>
              {route.subroutes ? (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                >
                  <AccordionItem
                    value={route.label}
                    className="border-none"
                  >
                    <AccordionTrigger className="p-3 text-sm hover:bg-primary/10 rounded-lg">
                      <div className="flex items-center">
                        <route.icon className="h-5 w-5 mr-3" />
                        {route.label}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {route.subroutes.map((subroute) => (
                        <Link
                          key={subroute.href}
                          href={subroute.href}
                          className={cn(
                            "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition pl-11",
                            subroute.active && "bg-primary/10"
                          )}
                        >
                          {subroute.label}
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <Link
                  href={route.href}
                  className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                    route.active && "bg-primary/10"
                  )}
                >
                  <div className="flex items-center flex-1">
                    <route.icon className="h-5 w-5 mr-3" />
                    {route.label}
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
