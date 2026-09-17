import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background-dark">
      <AdminSidebar />
      <div className="flex-1 min-w-0 px-5 sm:px-8 lg:px-10 py-8 sm:py-10">{children}</div>
    </div>
  );
}
