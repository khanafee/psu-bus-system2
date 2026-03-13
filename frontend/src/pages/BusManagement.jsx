import { useState, useEffect } from 'react';
import BusForm from '../components/BusForm';
import BusTable from '../components/BusTable';

export default function BusManagement() {
  const [buses, setBuses] = useState([]);
  const [form, setForm] = useState({ plate_number: '', status: 'active' });
  const [editingId, setEditingId] = useState(null);

  const fetchBuses = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/buses');
      setBuses(await res.json());
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchBuses(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `http://localhost:3001/api/buses/${editingId}` : 'http://localhost:3001/api/buses';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    handleCancel();
    fetchBuses();
  };

  const handleEdit = (bus) => { setForm({ plate_number: bus.plate_number, status: bus.status }); setEditingId(bus.bus_id); };
  const handleCancel = () => { setForm({ plate_number: '', status: 'active' }); setEditingId(null); };
  const handleDelete = async (id) => { if (confirm('ลบรถบัสคันนี้?')) { await fetch(`http://localhost:3001/api/buses/${id}`, { method: 'DELETE' }); fetchBuses(); } };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">จัดการข้อมูลรถบัส</h2>
        <p className="text-gray-500 text-sm mt-1">เพิ่ม ลบ หรือแก้ไขสถานะรถบัสในระบบ</p>
      </div>
      <BusForm form={form} setForm={setForm} handleSave={handleSave} editingId={editingId} handleCancel={handleCancel} />
      <BusTable buses={buses} handleEdit={handleEdit} handleDelete={handleDelete} />
    </div>
  );
}