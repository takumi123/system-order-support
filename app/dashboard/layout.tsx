import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        <Sidebar />
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
