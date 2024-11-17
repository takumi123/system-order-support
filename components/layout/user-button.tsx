"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserButton() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 overflow-hidden focus:ring-2 focus:ring-brand focus:ring-offset-2 focus-visible:outline-none">
        <Avatar className="h-8 w-8">
          <AvatarImage src={session.user.image || ""} />
          <AvatarFallback>
            {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">
          {session.user.name || session.user.email}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => signOut()}>
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
