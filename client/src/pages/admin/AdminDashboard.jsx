import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, fetchAllEvents, fetchAllOrders, updateEventInfo, deleteEvent } from '../../features/admin/adminSlice';
import AdminLayout from '../../components/AdminLayout';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';

const statusColors = {
  confirmed: 'bg-green-500/20 text-green-400',
  pending: 'bg-amber-500/20 text-amber-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { users, events, orders, isLoading } = useSelector((state) => state.admin);
  const [modalState, setModalState] = useState({ isOpen: false, idToDelete: null });

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllEvents());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleApprove = (eventId) => {
    dispatch(updateEventInfo({ eventId, eventData: { isActive: true } })).then(res => {
      if(!res.error) toast.success("Event Approved!");
    });
  };

  const triggerReject = (id) => setModalState({ isOpen: true, idToDelete: id });

  const confirmReject = () => {
    dispatch(deleteEvent(modalState.idToDelete)).then(res => {
      if(!res.error) toast.success("Event Rejected & Deleted");
    });
    setModalState({ isOpen: false, idToDelete: null });
  };

  const pendingList = events?.filter(e => !e.isActive) || [];
  const upcomingCount = events?.filter(e => e.status === 'upcoming').length || 0;
  const ongoingCount = events?.filter(e => e.status === 'ongoing').length || 0;
  const expiredCount = events?.filter(e => e.status === 'expired').length || 0;
  const totalEvents = events?.length || 0;
  
  const totalRevenue = orders?.reduce((sum, order) => {
    if (order.status === 'cancelled') {
      return sum + (order.cancellationFee || 0);
    }
    return sum + (order.billedAmount || 0);
  }, 0) || 0;

  const eventStatusData = [
    { label: 'Upcoming', count: upcomingCount, color: '#00f5ff', pct: totalEvents ? (upcomingCount/totalEvents)*100 : 0 },
    { label: 'Ongoing', count: ongoingCount, color: '#f72585', pct: totalEvents ? (ongoingCount/totalEvents)*100 : 0 },
    { label: 'Expired', count: expiredCount, color: '#555555', pct: totalEvents ? (expiredCount/totalEvents)*100 : 0 },
  ];

  const stats = [
    { label: 'Total Users', value: users?.length || 0, icon: '👥', change: 'Live' },
    { label: 'Total Events', value: events?.length || 0, icon: '🎪', change: 'Live' },
    { label: 'Total Orders', value: orders?.length || 0, icon: '📋', change: 'Live' },
    { label: 'Pending Approvals', value: pendingList.length, icon: '⏳', change: 'Action', changeColor: pendingList.length > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-green-500/10 text-green-400' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: '💰', change: 'Live', changeColor: 'bg-[#00f5ff]/10 text-[#00f5ff]' },
  ];

  if (isLoading) return <Loading />;

  return (
    <AdminLayout current="/admin">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white animate-fade-in-up">Dashboard</h1>
          <p className="text-white/40 mt-1 animate-fade-in-up animation-delay-200">Overview of your platform</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/events/create" className="px-4 py-2 bg-[#f72585] text-white text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(247,37,133,0.4)] transition-all">+ Create Event</Link>
          <Link to="/admin/coupons/create" className="px-4 py-2 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-lg hover:bg-white/10 transition-all">+ Add Coupon</Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex justify-between items-start">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${stat.changeColor || 'bg-green-500/10 text-green-400'}`}>{stat.change}</span>
            </div>
            <p className="text-3xl font-black text-white mt-4">{stat.value}</p>
            <p className="text-xs text-white/40 uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Pending Approvals */}
      {pendingList.length > 0 && (
        <div className="mb-10 animate-fade-in-up animation-delay-400">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight">Pending Approvals</h2>
            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full animate-pulse">{pendingList.length}</span>
          </div>
          <div className="space-y-4">
            {pendingList.map((event, i) => (
              <div key={event._id} className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-5 animate-fade-in-up" style={{ animationDelay: `${i * 100 + 500}ms` }}>
                <div className="flex flex-col md:flex-row gap-5">
                  <img src={event.eventImage} alt={event.title} className="w-full md:w-40 h-32 md:h-28 rounded-xl object-cover brightness-75 shrink-0" />
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <h3 className="font-bold text-white uppercase tracking-tight text-lg">{event.title}</h3>
                        <p className="text-sm text-[#00f5ff] mt-0.5">{event.eventArtistName}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400">⏳ Pending</span>
                    </div>
                    <p className="text-xs text-white/40 mt-2 line-clamp-2">{event.description}</p>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/40">
                      <span>📅 {event.eventDate}</span>
                      <span>📍 {event.eventLocation}</span>
                      <span>🎫 ₹{event.ticketPrice?.toLocaleString() || 0}</span>
                      <span>💺 {event.totalSeats?.toLocaleString() || 0} seats</span>
                    </div>
                  </div>
                  <div className="flex md:flex-col gap-2 shrink-0 md:justify-center">
                    <button 
                      onClick={() => handleApprove(event._id)}
                      className="px-5 py-2.5 bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-green-500/30 transition-all border border-green-500/20"
                    >
                      ✓ Approve
                    </button>
                    <button 
                      onClick={() => triggerReject(event._id)}
                      className="px-5 py-2.5 bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-red-500/30 transition-all border border-red-500/20"
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight mb-6">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-white/30 uppercase tracking-wider border-b border-white/10">
                  <th className="text-left pb-3 pr-4">Event</th>
                  <th className="text-left pb-3 pr-4">Seats</th>
                  <th className="text-left pb-3 pr-4">Amount</th>
                  <th className="text-left pb-3 pr-4">Status</th>
                  <th className="text-left pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders?.slice(0, 5).map((order) => (
                  <tr key={order._id} className="border-b border-white/5 last:border-b-0">
                    <td className="py-3 pr-4"><span className="text-sm text-white font-medium">{order?.event?.title || 'Unknown'}</span></td>
                    <td className="py-3 pr-4"><span className="text-sm text-white/60">{order.seats}</span></td>
                    <td className="py-3 pr-4"><span className="text-sm text-[#f72585] font-bold">₹{order?.billedAmount?.toLocaleString() || 0}</span></td>
                    <td className="py-3 pr-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusColors[order.status] || 'bg-white/10'}`}>{order?.status || 'Unknown'}</span></td>
                    <td className="py-3"><span className="text-sm text-white/30">{order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Events by Status */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight mb-6">Events by Status</h2>
          <div className="flex justify-center mb-8">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#1a1a1a" strokeWidth="4" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#00f5ff" strokeWidth="4" strokeDasharray={`${eventStatusData[0].pct} ${100 - eventStatusData[0].pct}`} strokeDashoffset="0" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f72585" strokeWidth="4" strokeDasharray={`${eventStatusData[1].pct} ${100 - eventStatusData[1].pct}`} strokeDashoffset={`-${eventStatusData[0].pct}`} />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#555555" strokeWidth="4" strokeDasharray={`${eventStatusData[2].pct} ${100 - eventStatusData[2].pct}`} strokeDashoffset={`-${eventStatusData[0].pct + eventStatusData[1].pct}`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{totalEvents}</span>
                <span className="text-[10px] text-white/40 uppercase tracking-wider">Total</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {eventStatusData.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-white/60">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal 
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, idToDelete: null })}
        onConfirm={confirmReject}
        title="Reject & Delete Event"
        message="Are you sure you want to reject this event? This will permanently delete the event data."
      />
    </AdminLayout>
  );
}
