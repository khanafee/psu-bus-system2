import { useState, useEffect } from 'react';

export default function BusStopManagement() {
  const [stops, setStops] = useState([]);
  const [form, setForm] = useState({ stop_name: '', latitude: '', longitude: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchStops = async () => {
    const res = await fetch('http://localhost:3001/api/bus-stops');
    setStops(await res.json());
  };

  useEffect(() => { fetchStops(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `http://localhost:3001/api/bus-stops/${editingId}` : 'http://localhost:3001/api/bus-stops';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    handleCancel();
    fetchStops();
  };

  const handleEdit = (stop) => {
    setForm({ stop_name: stop.stop_name, latitude: stop.latitude || '', longitude: stop.longitude || '' });
    setEditingId(stop.stop_id);
  };

  const handleCancel = () => {
    setForm({ stop_name: '', latitude: '', longitude: '' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (confirm('ลบจุดจอดนี้?')) {
      await fetch(`http://localhost:3001/api/bus-stops/${id}`, { method: 'DELETE' });
      fetchStops();
    }
  };

  return (
    <div>
      <form onSubmit={handleSave} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-2">ชื่อจุดจอด</label>
          <input type="text" value={form.stop_name} onChange={e => setForm({...form, stop_name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" required placeholder="เช่น ป้ายหน้าตึกฟักทอง" />
        </div>
        <div className="w-full md:w-1/4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">ละติจูด (Latitude)</label>
          <input type="number" step="any" value={form.latitude} onChange={e => setForm({...form, latitude: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" placeholder="7.00..." />
        </div>
        <div className="w-full md:w-1/4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">ลองจิจูด (Longitude)</label>
          <input type="number" step="any" value={form.longitude} onChange={e => setForm({...form, longitude: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" placeholder="100.50..." />
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg">{editingId ? 'บันทึก' : '+ เพิ่มจุดจอด'}</button>
          {editingId && <button type="button" onClick={handleCancel} className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2.5 px-6 rounded-lg">ยกเลิก</button>}
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm">ID</th>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm">ชื่อจุดจอด</th>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm">พิกัด (Lat, Lng)</th>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stops.map(s => (
              <tr key={s.stop_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700">{s.stop_id}</td>
                <td className="px-6 py-4 text-gray-900 font-medium">{s.stop_name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{s.latitude && s.longitude ? `${s.latitude}, ${s.longitude}` : '-'}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(s)} className="text-indigo-600 hover:text-indigo-900 mr-4 font-medium text-sm">แก้ไข</button>
                  <button onClick={() => handleDelete(s.stop_id)} className="text-red-500 hover:text-red-700 font-medium text-sm">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}