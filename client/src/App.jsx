import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import TicketDetail from './pages/TicketDetail';
import NotFound from './pages/NotFound';
import SubmitEvent from './pages/SubmitEvent';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminEvents from './pages/admin/AdminEvents';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminCreateEvent from './pages/admin/AdminCreateEvent';
import AdminEditEvent from './pages/admin/AdminEditEvent';
import AdminCreateCoupon from './pages/admin/AdminCreateCoupon';
import AdminEditUser from './pages/admin/AdminEditUser';
import AdminCredits from './pages/admin/AdminCredits';
import VoltBot from './pages/VoltBot';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Only show sidebar/navbar on non-admin and non-auth pages */}
      {!isAdminRoute && !isAuthRoute && (
        <>
          <Navbar />
          <Sidebar />
        </>
      )}

      <main className={!isAdminRoute && !isAuthRoute ? 'md:ml-16 pb-20 md:pb-0' : ''}>
        <Routes>
          {/* Public user routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/voltbot" element={<VoltBot />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/booking/:id" element={<Booking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/submit-event" element={<SubmitEvent />} />
            <Route path="/ticket/:orderId" element={<TicketDetail />} />
          </Route>

          {/* Admin routes (use their own AdminLayout) */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/edit/:id" element={<AdminEditUser />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/events/create" element={<AdminCreateEvent />} />
            <Route path="/admin/events/edit/:id" element={<AdminEditEvent />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/coupons" element={<AdminCoupons />} />
            <Route path="/admin/coupons/create" element={<AdminCreateCoupon />} />
            <Route path="/admin/credits" element={<AdminCredits />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </main>
    </div>
  );
}
