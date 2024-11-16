import { UserButton } from "@/components/layout/user-button";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold">System Order Support</h2>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
