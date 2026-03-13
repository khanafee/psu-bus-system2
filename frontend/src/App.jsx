import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. นำเข้า Layout จากโฟลเดอร์ components (ตัวนี้ตัวเดียวที่ยังอยู่ components)
import AdminLayout from './components/AdminLayout';

// 2. นำเข้าหน้าต่างๆ จากโฟลเดอร์ pages (เปลี่ยนจาก ./components/ เป็น ./pages/ ทั้งหมด)
import ScheduleManagement from './pages/ScheduleManagement';
import BusManagement from './pages/BusManagement';
import RouteManagement from './pages/RouteManagement';
import BusStopManagement from './pages/BusStopManagement';
import RouteStopManagement from './pages/RouteStopManagement';
import StaffManagement from './pages/StaffManagement';
import IssueManagement from './pages/IssueManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<ScheduleManagement />} />
          <Route path="buses" element={<BusManagement />} />
          <Route path="routes" element={<RouteManagement />} />
          <Route path="stops" element={<BusStopManagement />} />
          <Route path="route-stops" element={<RouteStopManagement />} />
          <Route path="staff" element={<StaffManagement />} />
          <Route path="issues" element={<IssueManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;