export default function Sidebar() {
  return (
    <aside className="w-64 bg-white p-4 shadow-md">
      <h2 className="text-xl font-bold mb-4">Market Dashboard</h2>
      <nav>
        <ul className="space-y-2">
          <li><a className="block text-gray-700 hover:text-blue-600" href="#">Dashboard</a></li>
          {/* Extend for routing if needed */}
        </ul>
      </nav>
    </aside>
  );
}
