import AdminLayoutShell from "@/components/admin/AdminLayoutShell";

export const metadata = {
  title: "Admin | Learning Czech",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
