// 1. รับ handleCancel เพิ่มเข้ามาใน Props
export default function BusForm({ form, setForm, handleSave, editingId, handleCancel }) {
  return (
    <form onSubmit={handleSave} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1 w-full">
        <label className="block text-sm font-semibold text-gray-700 mb-2">ทะเบียนรถ / ชื่อรถ</label>
        <input 
          type="text" 
          value={form.plate_number} 
          onChange={e => setForm({...form, plate_number: e.target.value})} 
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          required 
          placeholder="เช่น รถ EV ป้ายเหลือง..."
        />
      </div>
      <div className="w-full md:w-1/3">
        <label className="block text-sm font-semibold text-gray-700 mb-2">สถานะ</label>
        <select 
          value={form.status} 
          onChange={e => setForm({...form, status: e.target.value})} 
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="active">พร้อมใช้งาน (Active)</option>
          <option value="maintenance">ซ่อมบำรุง (Maintenance)</option>
        </select>
      </div>
      
      {/* 2. จัดกลุ่มปุ่มให้อยู่ด้วยกัน */}
      <div className="flex w-full md:w-auto gap-2">
        <button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
          {editingId ? 'บันทึกการแก้ไข' : '+ เพิ่มรถบัส'}
        </button>
        
        {/* 3. แสดงปุ่มยกเลิก เฉพาะตอนที่กำลังแก้ไขอยู่ */}
        {editingId && (
          <button 
            type="button" 
            onClick={handleCancel} 
            className="w-full md:w-auto bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
          >
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}