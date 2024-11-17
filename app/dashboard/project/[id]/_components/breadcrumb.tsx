"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbProps {
  items: {
    label: string;
    href: string;
  }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index !== 0 && <ChevronRight className="h-4 w-4 mx-2" />}
          <Link
            href={item.href}
            className={index === items.length - 1 ? "font-medium text-foreground" : "hover:text-foreground"}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </div>
  );
}
