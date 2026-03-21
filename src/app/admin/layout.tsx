import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin | Learning Czech",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-0px)] -mx-4 sm:-mx-6 lg:-mx-8 -my-8">
      <AdminSidebar />
      <div className="flex-1 bg-slate-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
      </div>
    </div>
  );
}
