import { auth } from "./app/auth"

export default auth

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/.*|api/auth/.*).*)",
  ],
}
