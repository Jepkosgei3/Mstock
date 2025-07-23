import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-4 bg-gray-100 overflow-auto">
        <Dashboard />
      </main>
    </div>
  );
}
