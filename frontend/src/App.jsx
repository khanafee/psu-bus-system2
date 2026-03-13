import { useState, useEffect } from "react";
import BusForm from "./components/BusForm";
import BusTable from "./components/BusTable";
import RouteManagement from "./components/RouteManagement";
import BusStopManagement from "./components/BusStopManagement";
import RouteStopManagement from "./components/RouteStopManagement";
import StaffManagement from "./components/StaffManagement";
import ScheduleManagement from "./components/ScheduleManagement";
import IssueManagement from './components/IssueManagement';

function App() {
  const [activeTab, setActiveTab] = useState("issue"); // สถานะสำหรับสลับหน้า (bus หรือ route)

  // State ของฝั่ง Bus
  const [buses, setBuses] = useState([]);
  const [form, setForm] = useState({ plate_number: "", status: "active" });
  const [editingId, setEditingId] = useState(null);

  const fetchBuses = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/buses");
      setBuses(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  // ฟังก์ชันต่างๆ ของ Bus
  const handleSave = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:3001/api/buses/${editingId}`
      : "http://localhost:3001/api/buses";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    handleCancel();
    fetchBuses();
  };
  const handleEdit = (bus) => {
    setForm({ plate_number: bus.plate_number, status: bus.status });
    setEditingId(bus.bus_id);
  };
  const handleCancel = () => {
    setForm({ plate_number: "", status: "active" });
    setEditingId(null);
  };
  const handleDelete = async (id) => {
    if (confirm("ลบ?")) {
      await fetch(`http://localhost:3001/api/buses/${id}`, {
        method: "DELETE",
      });
      fetchBuses();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 font-sans">
        
        {/* เมนู Tabs */}
        <div className="flex flex-col xl:flex-row justify-between items-center border-b pb-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 xl:mb-0">ระบบจัดตารางเดินรถ PSU</h1>
          <div className="flex bg-gray-200 rounded-lg p-1 overflow-x-auto w-full xl:w-auto">
            {/* แทรก Tab แจ้งปัญหา */}
            <button onClick={() => setActiveTab('schedule')} className={`px-3 py-2 rounded-md font-medium text-sm whitespace-nowrap ${activeTab === 'schedule' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>⏰ ตารางเดินรถ</button>
            <button onClick={() => setActiveTab('bus')} className={`px-3 py-2 rounded-md font-medium text-sm whitespace-nowrap ${activeTab === 'bus' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>🚌 รถบัส</button>
            <button onClick={() => setActiveTab('route')} className={`px-3 py-2 rounded-md font-medium text-sm whitespace-nowrap ${activeTab === 'route' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>🛣️ เส้นทาง</button>
            <button onClick={() => setActiveTab('stop')} className={`px-3 py-2 rounded-md font-medium text-sm whitespace-nowrap ${activeTab === 'stop' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>🚏 จุดจอด</button>
            <button onClick={() => setActiveTab('route-stop')} className={`px-3 py-2 rounded-md font-medium text-sm whitespace-nowrap ${activeTab === 'route-stop' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>📍 จัดเส้นทาง</button>
            <button onClick={() => setActiveTab('staff')} className={`px-3 py-2 rounded-md font-medium text-sm whitespace-nowrap ${activeTab === 'staff' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>👥 พนักงาน</button>
            <button onClick={() => setActiveTab('issue')} className={`px-3 py-2 rounded-md font-medium text-sm whitespace-nowrap ${activeTab === 'issue' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-600'}`}>⚠️ แจ้งปัญหา</button>
          </div>
        </div>
        
        {/* แสดงผล Component */}
        {activeTab === 'schedule' && <ScheduleManagement />}
        {activeTab === 'bus' && (
          <div>
            <BusForm form={form} setForm={setForm} handleSave={handleSave} editingId={editingId} handleCancel={handleCancel} />
            <BusTable buses={buses} handleEdit={handleEdit} handleDelete={handleDelete} />
          </div>
        )}
        {activeTab === 'route' && <RouteManagement />}
        {activeTab === 'stop' && <BusStopManagement />}
        {activeTab === 'route-stop' && <RouteStopManagement />}
        {activeTab === 'staff' && <StaffManagement />}
        {activeTab === 'issue' && <IssueManagement />} {/* <-- แทรกตรงนี้ */}
        
      </div>
    </div>
  );
}

export default App;