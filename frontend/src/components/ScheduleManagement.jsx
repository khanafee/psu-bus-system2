import { useState, useEffect } from 'react';

export default function ScheduleManagement() {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  
  const [form, setForm] = useState({ bus_id: '', route_id: '', staff_id: '', start_time: '', status: 'scheduled' });
  const [editingId, setEditingId] = useState(null);

  // ดึงข้อมูล Master Data ทั้งหมดมารอไว้ทำ Dropdown
  const fetchMasterData = async () => {
    const [resSchedules, resBuses, resRoutes, resStaff] = await Promise.all([
      fetch('http://localhost:3001/api/schedules').then(r => r.json()),
      fetch('http://localhost:3001/api/buses').then(r => r.json()),
      fetch('http://localhost:3001/api/routes').then(r => r.json()),
      fetch('http://localhost:3001/api/staff').then(r => r.json())
    ]);
    
    setSchedules(resSchedules);
    setBuses(resBuses.filter(b => b.status === 'active')); // ให้เลือกเฉพาะรถที่พร้อมใช้งาน
    setRoutes(resRoutes);
    setDrivers(resStaff.filter(s => s.role === 'driver')); // ให้เลือกเฉพาะคนที่เป็น driver
  };

  useEffect(() => { fetchMasterData(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `http://localhost:3001/api/schedules/${editingId}` : 'http://localhost:3001/api/schedules';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    handleCancel();
    fetchMasterData();
  };

  // จัดการเวลาสำหรับ input type="datetime-local"
  const handleEdit = (schedule) => {
    // ตัดเอาเฉพาะส่วน YYYY-MM-DDTHH:mm ไปใส่ในฟอร์ม
    const formattedDate = new Date(schedule.start_time).toISOString().slice(0, 16);
    setForm({ 
      bus_id: schedule.bus_id || '', 
      route_id: schedule.route_id || '', 
      staff_id: schedule.staff_id || '', 
      start_time: formattedDate, 
      status: schedule.status 
    });
    setEditingId(schedule.schedule_id);
  };

  const handleCancel = () => {
    setForm({ bus_id: '', route_id: '', staff_id: '', start_time: '', status: 'scheduled' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (confirm('ลบตารางเดินรถนี้?')) {
      await fetch(`http://localhost:3001/api/schedules/${id}`, { method: 'DELETE' });
      fetchMasterData();
    }
  };

  return (
    <div>
      <form onSubmit={handleSave} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">เวลารถออก</label>
          <input type="datetime-local" value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" required />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">เส้นทาง</label>
          <select value={form.route_id} onChange={e => setForm({...form, route_id: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white" required>
            <option value="">-- เลือกเส้นทาง --</option>
            {routes.map(r => <option key={r.route_id} value={r.route_id}>{r.route_name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">รถบัส</label>
          <select value={form.bus_id} onChange={e => setForm({...form, bus_id: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white" required>
            <option value="">-- เลือกรถบัส --</option>
            {buses.map(b => <option key={b.bus_id} value={b.bus_id}>{b.plate_number}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">คนขับรถ</label>
          <select value={form.staff_id} onChange={e => setForm({...form, staff_id: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white" required>
            <option value="">-- เลือกคนขับ --</option>
            {drivers.map(d => <option key={d.staff_id} value={d.staff_id}>{d.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">สถานะ</label>
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white">
            <option value="scheduled">ตามกำหนดการ (Scheduled)</option>
            <option value="in_progress">กำลังวิ่ง (In Progress)</option>
            <option value="completed">เสร็จสิ้น (Completed)</option>
            <option value="cancelled">ยกเลิก (Cancelled)</option>
          </select>
        </div>

        <div className="flex items-end gap-2 mt-4 lg:mt-0">
          <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">{editingId ? 'บันทึก' : '+ จัดตาราง'}</button>
          {editingId && <button type="button" onClick={handleCancel} className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg">ยกเลิก</button>}
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="min-w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm">เวลาออกรถ</th>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm">เส้นทาง</th>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm">รถบัส</th>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm">คนขับ</th>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm">สถานะ</th>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {schedules.map(s => (
              <tr key={s.schedule_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-800">
                  {new Date(s.start_time).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}
                </td>
                <td className="px-6 py-4 text-gray-900">{s.route_name || '-'}</td>
                <td className="px-6 py-4 text-gray-600">{s.plate_number || '-'}</td>
                <td className="px-6 py-4 text-gray-600">{s.driver_name || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
                    ${s.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                      s.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
                      s.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(s)} className="text-indigo-600 hover:text-indigo-900 mr-4 font-medium text-sm">แก้ไข</button>
                  <button onClick={() => handleDelete(s.schedule_id)} className="text-red-500 hover:text-red-700 font-medium text-sm">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}