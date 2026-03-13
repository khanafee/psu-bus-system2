import { useState, useEffect } from 'react';
import { MapPinned } from 'lucide-react';

export default function RouteStopManagement() {
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  
  const [selectedRoute, setSelectedRoute] = useState('');
  const [routeStops, setRouteStops] = useState([]);
  
  const [form, setForm] = useState({ stop_id: '', sequence_no: '' });

  // โหลดข้อมูลเส้นทางและจุดจอดตั้งต้น
  useEffect(() => {
    const fetchData = async () => {
      const [resRoutes, resStops] = await Promise.all([
        fetch('http://localhost:3001/api/routes').then(r => r.json()),
        fetch('http://localhost:3001/api/bus-stops').then(r => r.json())
      ]);
      setRoutes(resRoutes);
      setStops(resStops);
      if (resRoutes.length > 0) setSelectedRoute(resRoutes[0].route_id);
    };
    fetchData();
  }, []);

  // โหลดจุดจอดของเส้นทางที่เลือก
  const fetchRouteStops = async (routeId) => {
    if (!routeId) return;
    const res = await fetch(`http://localhost:3001/api/route-stops/${routeId}`);
    setRouteStops(await res.json());
  };

  useEffect(() => {
    fetchRouteStops(selectedRoute);
  }, [selectedRoute]);

  const handleAddStop = async (e) => {
    e.preventDefault();
    if (!selectedRoute || !form.stop_id || !form.sequence_no) return alert('กรุณากรอกข้อมูลให้ครบ');

    const res = await fetch('http://localhost:3001/api/route-stops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        route_id: selectedRoute,
        stop_id: form.stop_id,
        sequence_no: form.sequence_no
      })
    });

    if (res.ok) {
      setForm({ stop_id: '', sequence_no: '' });
      fetchRouteStops(selectedRoute);
    } else {
      const errorData = await res.json();
      alert(errorData.error || 'เกิดข้อผิดพลาด');
    }
  };

  const handleRemoveStop = async (stopId) => {
    if (confirm('นำจุดจอดนี้ออกจากเส้นทาง?')) {
      await fetch(`http://localhost:3001/api/route-stops/${selectedRoute}/${stopId}`, { method: 'DELETE' });
      fetchRouteStops(selectedRoute);
    }
  };

  return (
    <div>
      {/* เลือกเส้นทาง */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <label className="flex items-center text-lg font-bold text-gray-800 mb-4"><MapPinned className="w-5 h-5 mr-2" />เลือกเส้นทางที่ต้องการจัดการจุดจอด</label>
        <select 
          value={selectedRoute} 
          onChange={(e) => setSelectedRoute(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500"
        >
          {routes.map(r => (
             <option key={r.route_id} value={r.route_id}>{r.route_name}</option>
          ))}
        </select>
      </div>

      {/* ฟอร์มเพิ่มจุดจอด */}
      <form onSubmit={handleAddStop} className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100 mb-8 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-2">เลือกจุดจอด</label>
          <select 
            value={form.stop_id} 
            onChange={e => setForm({...form, stop_id: e.target.value})} 
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white" required
          >
            <option value="">-- เลือกจุดจอด --</option>
            {stops.map(s => <option key={s.stop_id} value={s.stop_id}>{s.stop_name}</option>)}
          </select>
        </div>
        <div className="w-full md:w-32">
          <label className="block text-sm font-semibold text-gray-700 mb-2">ลำดับที่จอด</label>
          <input type="number" min="1" value={form.sequence_no} onChange={e => setForm({...form, sequence_no: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" required placeholder="เช่น 1" />
        </div>
        <button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg">+ เพิ่มเข้าเส้นทาง</button>
      </form>

      {/* ตารางแสดงจุดจอดในเส้นทาง */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-4 font-semibold text-sm w-24 text-center">ลำดับที่</th>
              <th className="px-6 py-4 font-semibold text-sm">ชื่อจุดจอด</th>
              <th className="px-6 py-4 font-semibold text-sm text-right">นำออก</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {routeStops.length === 0 ? (
              <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-500">ยังไม่มีจุดจอดในเส้นทางนี้</td></tr>
            ) : (
              routeStops.map(rs => (
                <tr key={rs.stop_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-center font-bold text-blue-600 text-lg">{rs.sequence_no}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{rs.stop_name}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleRemoveStop(rs.stop_id)} className="text-red-500 hover:text-red-700 font-medium text-sm">ลบออก</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}