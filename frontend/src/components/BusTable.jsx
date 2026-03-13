export default function BusTable({ buses, handleEdit, handleDelete }) {
  if (buses.length === 0) {
    return <div className="text-center py-8 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">ยังไม่มีข้อมูลรถบัสในระบบ</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="min-w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-6 py-4 text-gray-600 font-semibold text-sm">ID</th>
            <th className="px-6 py-4 text-gray-600 font-semibold text-sm">ป้ายทะเบียน</th>
            <th className="px-6 py-4 text-gray-600 font-semibold text-sm">สถานะ</th>
            <th className="px-6 py-4 text-gray-600 font-semibold text-sm text-right">การจัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {buses.map(bus => (
            <tr key={bus.bus_id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-gray-700">{bus.bus_id}</td>
              <td className="px-6 py-4 text-gray-900 font-medium">{bus.plate_number}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  bus.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {bus.status === 'active' ? '● พร้อมใช้งาน' : '● ซ่อมบำรุง'}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button onClick={() => handleEdit(bus)} className="text-indigo-600 hover:text-indigo-900 mr-4 font-medium text-sm">แก้ไข</button>
                <button onClick={() => handleDelete(bus.bus_id)} className="text-red-500 hover:text-red-700 font-medium text-sm">ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}