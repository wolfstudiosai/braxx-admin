import { CommandBar } from "@/components/admin/CommandBar";
import { HorizontalNav } from "@/components/admin/HorizontalNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm">
        <CommandBar />
        <HorizontalNav />
      </header>
      <main className="px-3 sm:px-4 py-5 max-w-[1600px] mx-auto">{children}</main>
    </div>
  );
}
