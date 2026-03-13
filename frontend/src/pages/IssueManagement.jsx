import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function IssueManagement() {
  const [issues, setIssues] = useState([]);
  const [admins, setAdmins] = useState([]);
  
  const [form, setForm] = useState({ 
    issue_type: '', description: '', image_url: '', reporter_contact: '', is_masked: false, status: 'pending', staff_id: '' 
  });
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    const [resIssues, resStaff] = await Promise.all([
      fetch('http://localhost:3001/api/issues').then(r => r.json()),
      fetch('http://localhost:3001/api/staff').then(r => r.json())
    ]);
    setIssues(resIssues);
    setAdmins(resStaff.filter(s => s.role === 'admin')); // ให้เฉพาะ admin เป็นคนรับเคส
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `http://localhost:3001/api/issues/${editingId}` : 'http://localhost:3001/api/issues';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    handleCancel();
    fetchData();
  };

  const handleEdit = (issue) => {
    setForm({ 
      issue_type: issue.issue_type, 
      description: issue.description || '', 
      image_url: issue.image_url || '', 
      reporter_contact: issue.reporter_contact || '', 
      is_masked: !!issue.is_masked, 
      status: issue.status,
      staff_id: issue.staff_id || ''
    });
    setEditingId(issue.issue_id);
  };

  const handleCancel = () => {
    setForm({ issue_type: '', description: '', image_url: '', reporter_contact: '', is_masked: false, status: 'pending', staff_id: '' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (confirm('ลบรายการแจ้งปัญหานี้?')) {
      await fetch(`http://localhost:3001/api/issues/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  return (
    <div>
      <form onSubmit={handleSave} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">หัวข้อปัญหา</label>
          <input type="text" value={form.issue_type} onChange={e => setForm({...form, issue_type: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" required placeholder="เช่น รถเสีย, แอร์ไม่เย็น" />
        </div>
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">รายละเอียด</label>
          <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="อธิบายปัญหาเพิ่มเติม..." />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">ช่องทางติดต่อกลับ</label>
          <input type="text" value={form.reporter_contact} onChange={e => setForm({...form, reporter_contact: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="เบอร์โทร / Email" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">ลิงก์รูปภาพ (ถ้ามี)</label>
          <input type="text" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="URL รูปภาพ..." />
        </div>
        <div className="flex items-center mt-6">
          <input type="checkbox" id="is_masked" checked={form.is_masked} onChange={e => setForm({...form, is_masked: e.target.checked})} className="w-5 h-5 text-blue-600 rounded border-gray-300 mr-2" />
          <label htmlFor="is_masked" className="text-sm font-semibold text-gray-700">ซ่อนตัวตนผู้แจ้ง (ไม่แสดงชื่อ)</label>
        </div>

        {/* ส่วนที่ Admin ใช้จัดการ (จะโชว์เฉพาะตอนกดแก้ไข) */}
        {editingId && (
          <>
            <div className="border-t col-span-1 md:col-span-2 lg:col-span-3 my-2 pt-4"><p className="text-sm font-bold text-red-600 mb-2">ส่วนสำหรับผู้ดูแลระบบ (Admin)</p></div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ผู้รับผิดชอบ</label>
              <select value={form.staff_id} onChange={e => setForm({...form, staff_id: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white">
                <option value="">-- เลือกแอดมิน --</option>
                {admins.map(a => <option key={a.staff_id} value={a.staff_id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">สถานะการแก้ไข</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white">
                <option value="pending">รอดำเนินการ (Pending)</option>
                <option value="in_progress">กำลังแก้ไข (In Progress)</option>
                <option value="resolved">แก้ไขแล้ว (Resolved)</option>
              </select>
            </div>
          </>
        )}

        <div className="flex items-end gap-2 col-span-1 md:col-span-2 lg:col-span-3 mt-4">
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-lg inline-flex items-center">
            {editingId ? 'บันทึกสถานะ' : <><AlertCircle className="w-5 h-5 mr-2" />แจ้งปัญหา</>}
          </button>
          {editingId && <button type="button" onClick={handleCancel} className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2.5 px-6 rounded-lg">ยกเลิก</button>}
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="min-w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm">ปัญหา</th>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm">รายละเอียด</th>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm">ผู้แจ้ง</th>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm">ผู้รับผิดชอบ</th>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm">สถานะ</th>
              <th className="px-6 py-4 text-gray-600 font-semibold text-sm text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {issues.map(i => (
              <tr key={i.issue_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-900">{i.issue_type}</td>
                <td className="px-6 py-4 text-gray-600 truncate max-w-xs">{i.description}</td>
                <td className="px-6 py-4 text-gray-600">{i.is_masked ? <span className="text-gray-400 italic">ปกปิดตัวตน</span> : i.reporter_contact || '-'}</td>
                <td className="px-6 py-4 text-gray-600">{i.admin_name || <span className="text-red-400">ยังไม่มีผู้รับผิดชอบ</span>}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
                    ${i.status === 'pending' ? 'bg-red-100 text-red-800' : 
                      i.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'}`}>
                    {i.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(i)} className="text-indigo-600 hover:text-indigo-900 mr-4 font-medium text-sm">แก้ไข/รับเคส</button>
                  <button onClick={() => handleDelete(i.issue_id)} className="text-red-500 hover:text-red-700 font-medium text-sm">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}