export function Footer() {
  return (
    <footer className="fixed bottom-0 z-50 w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex flex-1 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2024 System Order Support. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
