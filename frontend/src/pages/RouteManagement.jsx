import { useState, useEffect } from 'react';

export default function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({ route_name: '', color_code: '#000000' });
  const [editingId, setEditingId] = useState(null);

  const fetchRoutes = async () => {
    const res = await fetch('http://localhost:3001/api/routes');
    setRoutes(await res.json());
  };

  useEffect(() => { fetchRoutes(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `http://localhost:3001/api/routes/${editingId}` : 'http://localhost:3001/api/routes';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ route_name: '', color_code: '#000000' });
    setEditingId(null);
    fetchRoutes();
  };

  const handleEdit = (route) => {
    setForm({ route_name: route.route_name, color_code: route.color_code });
    setEditingId(route.route_id);
  };

  const handleCancel = () => {
    setForm({ route_name: '', color_code: '#000000' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (confirm('ลบเส้นทางนี้?')) {
      await fetch(`http://localhost:3001/api/routes/${id}`, { method: 'DELETE' });
      fetchRoutes();
    }
  };

  return (
    <div>
      <form onSubmit={handleSave} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-2">ชื่อเส้นทาง</label>
          <input type="text" value={form.route_name} onChange={e => setForm({...form, route_name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" required placeholder="เช่น สาย 1" />
        </div>
        <div className="w-full md:w-32">
          <label className="block text-sm font-semibold text-gray-700 mb-2">สีประจำสาย</label>
          <input type="color" value={form.color_code} onChange={e => setForm({...form, color_code: e.target.value})} className="w-full h-11 border border-gray-300 rounded-lg cursor-pointer" />
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg">{editingId ? 'บันทึก' : '+ เพิ่มเส้นทาง'}</button>
          {editingId && <button type="button" onClick={handleCancel} className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2.5 px-6 rounded-lg">ยกเลิก</button>}
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm">ID</th>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm">ชื่อเส้นทาง</th>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm">สี</th>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {routes.map(r => (
              <tr key={r.route_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700">{r.route_id}</td>
                <td className="px-6 py-4 text-gray-900 font-medium">{r.route_name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: r.color_code }}></div>
                    <span className="text-sm text-gray-600">{r.color_code}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(r)} className="text-indigo-600 hover:text-indigo-900 mr-4 font-medium text-sm">แก้ไข</button>
                  <button onClick={() => handleDelete(r.route_id)} className="text-red-500 hover:text-red-700 font-medium text-sm">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}