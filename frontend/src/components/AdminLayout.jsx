import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  // สร้างรายการเมนูพร้อม Path ของ URL
  const menus = [
    { path: '/', name: 'ตารางเดินรถ', icon: '⏰' },
    { path: '/buses', name: 'รถบัส', icon: '🚌' },
    { path: '/routes', name: 'เส้นทาง', icon: '🛣️' },
    { path: '/stops', name: 'จุดจอด', icon: '🚏' },
    { path: '/route-stops', name: 'จัดเส้นทาง', icon: '📍' },
    { path: '/staff', name: 'พนักงาน', icon: '👥' },
    { path: '/issues', name: 'แจ้งปัญหา', icon: '⚠️' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      
      {/* Sidebar ด้านซ้าย */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-extrabold tracking-wide text-blue-400">PSU <span className="text-white">Transit</span></h1>
          <p className="text-xs text-slate-400 mt-1">Admin Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menus.map(menu => (
            <NavLink
              key={menu.path}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`
              }
            >
              <span className="text-lg">{menu.icon}</span>
              <span className="font-medium text-sm">{menu.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700 text-xs text-slate-500 text-center">
          &copy; 2026 PSU Bus System
        </div>
      </aside>

      {/* Main Content ด้านขวา */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Outlet คือจุดที่ Router จะเอา Component ของแต่ละหน้ามาสอดไส้ตรงนี้ */}
          <Outlet /> 
        </div>
      </main>
      
    </div>
  );
}