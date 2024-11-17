import { NextResponse } from "next/server";
import { auth } from "./app/auth";

export default async function middleware(req: Request) {
  const session = await auth();
  const isAuthPage = req.url.includes("/auth");

  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard/project", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
