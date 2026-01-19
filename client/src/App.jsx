import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import ResidentLayout from './components/layout/ResidentLayout';
import StaffLayout from './components/layout/Stafflayout';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/login';
import ResidentsList from './pages/admin/ResidentsList';
import ResidentAdd from './pages/admin/ResidentAdd';
import ResidentEdit from './pages/admin/ResidentEdit';
import HouseList from './pages/admin/HousesList';
import HouseEdit from './pages/admin/HouseEdit';
import HouseAdd from './pages/admin/HouseAdd';
import StaffList from './pages/admin/StaffList';
import StaffAdd from './pages/admin/StaffAdd';
import StaffEdit from './pages/admin/StaffEdit';
import BillsList from './pages/admin/BillsList';
import BillsAdd from './pages/admin/BillsAdd';
import BillsEdit from './pages/admin/BillsEdit';
import AdminRequestList from './pages/admin/AdminRequestList';
import AdminRequestAssign from './pages/admin/AdminRequestAssign';
import NoticesList from './pages/admin/NoticesList';
import NoticeEdit from './pages/admin/NoticeEdit';
import NoticeAdd from './pages/admin/NoticeAdd';
import ParkingList from './pages/admin/ParkingList';
import ParkingAdd from './pages/admin/ParkingAdd';
import ParkingEdit from './pages/admin/ParkingEdit';
import ResidentDashboard from './pages/resident/ResidentDashboard';
import ResidentProfile from './pages/resident/ResidentProfile'
import ResidentBills from './pages/resident/ResidentBills';
import ResidentRequestList from './pages/resident/ResidentRequestList';
import ResidentRequestEdit from './pages/resident/ResidentRequestEdit';
import ResidentRequestAdd from './pages/resident/ResidentRequestAdd';
import ResidentNotices from './pages/resident/ResidentNotices';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/residents" element={<ResidentsList />} />
                  <Route path="/residents/add" element={<ResidentAdd />} />
                  <Route path="/residents/edit/:id" element={<ResidentEdit />} />
                  <Route path="/houses" element={<HouseList />} />
                  <Route path="/houses/add" element={<HouseAdd />} />
                  <Route path="/house/edit/:id" element={<HouseEdit />} />
                  <Route path="/staff" element={<StaffList />} />
                  <Route path="/staff/add" element={<StaffAdd />} />
                  <Route path="/staff/edit/:id" element={<StaffEdit />} />
                  <Route path="/bills" element={<BillsList />} />
                  <Route path="/bills/add" element={<BillsAdd />} />
                  <Route path="/bills/edit/:id" element={<BillsEdit />} />
                  <Route path="/requests" element={<AdminRequestList />} />
                  <Route path="/requests/assign/:id" element={<AdminRequestAssign />} />  
                  <Route path="/notices" element={<NoticesList />} />
                  <Route path="/notices/add" element={<NoticeAdd />} />
                  <Route path="/notices/edit/:id" element={<NoticeEdit />} />
                  <Route path="/parking" element={<ParkingList />} />
                  <Route path="/parking/add" element={<ParkingAdd />} />
                  <Route path="/parking/edit/:id" element={<ParkingEdit />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />

          {/* Protected Resident Routes */}
          <Route path="/resident/*" element={
            <ProtectedRoute allowedRoles={['resident', 'rental', 'owner']}>
              <ResidentLayout>
                <Routes>
                  <Route path="/" element={<ResidentDashboard />} />
                  <Route path="/profile" element={<ResidentProfile />} />
                  <Route path="/bills" element={<ResidentBills />} />
                  <Route path="/requests" element={<ResidentRequestList />} />
                  <Route path="/requests/add" element={<ResidentRequestAdd />} />
                  <Route path="/requests/edit/:id" element={<ResidentRequestEdit />} />
                  <Route path="/notices" element={<ResidentNotices />} />
                </Routes>
              </ResidentLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;