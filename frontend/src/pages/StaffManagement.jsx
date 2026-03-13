import { useState, useEffect } from 'react';

export default function StaffManagement() {
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState({ username: '', password: '', name: '', role: 'driver' });
  const [editingId, setEditingId] = useState(null);

  const fetchStaff = async () => {
    const res = await fetch('http://localhost:3001/api/staff');
    setStaffList(await res.json());
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `http://localhost:3001/api/staff/${editingId}` : 'http://localhost:3001/api/staff';
    
    // ถ้าแก้ไข เราจะไม่ส่งรหัสผ่านไป (ระบบเบื้องต้นนี้ไม่อนุญาตให้แก้รหัสผ่าน)
    const payload = editingId ? { username: form.username, name: form.name, role: form.role } : form;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      handleCancel();
      fetchStaff();
    } else {
      const data = await res.json();
      alert(data.error || 'เกิดข้อผิดพลาด');
    }
  };

  const handleEdit = (staff) => {
    setForm({ username: staff.username, password: '', name: staff.name, role: staff.role });
    setEditingId(staff.staff_id);
  };

  const handleCancel = () => {
    setForm({ username: '', password: '', name: '', role: 'driver' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (confirm('ลบพนักงานคนนี้?')) {
      await fetch(`http://localhost:3001/api/staff/${id}`, { method: 'DELETE' });
      fetchStaff();
    }
  };

  return (
    <div>
      <form onSubmit={handleSave} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-end flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-gray-700 mb-2">ชื่อ-สกุล</label>
          <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" required />
        </div>
        <div className="w-full md:w-1/4 min-w-[150px]">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
          <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" required />
        </div>
        {!editingId && (
          <div className="w-full md:w-1/4 min-w-[150px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5" required={!editingId} />
          </div>
        )}
        <div className="w-full md:w-1/6 min-w-[120px]">
          <label className="block text-sm font-semibold text-gray-700 mb-2">ตำแหน่ง</label>
          <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white">
            <option value="driver">คนขับรถ</option>
            <option value="admin">ผู้ดูแลระบบ</option>
          </select>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg">{editingId ? 'บันทึก' : '+ เพิ่ม'}</button>
          {editingId && <button type="button" onClick={handleCancel} className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2.5 px-6 rounded-lg">ยกเลิก</button>}
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm">ID</th>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm">ชื่อ-สกุล</th>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm">Username</th>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm">ตำแหน่ง</th>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {staffList.map(s => (
              <tr key={s.staff_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700">{s.staff_id}</td>
                <td className="px-6 py-4 text-gray-900 font-medium">{s.name}</td>
                <td className="px-6 py-4 text-gray-600">{s.username}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${s.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                    {s.role === 'admin' ? '👑 Admin' : '🚌 Driver'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(s)} className="text-indigo-600 hover:text-indigo-900 mr-4 font-medium text-sm">แก้ไข</button>
                  <button onClick={() => handleDelete(s.staff_id)} className="text-red-500 hover:text-red-700 font-medium text-sm">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}