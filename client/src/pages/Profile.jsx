import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyOrders, reset } from '../features/order/orderSlice';
import Footer from '../components/Footer';
import Loading from '../components/Loading';

const statusColors = {
  confirmed: 'bg-green-500/20 text-green-400',
  pending: 'bg-amber-500/20 text-amber-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector(state => state.auth);
  const { orders, isLoading, isError, message } = useSelector(state => state.order);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.isAdmin) {
      navigate('/admin');
    } else {
      dispatch(getMyOrders());
    }
  }, [user, navigate, dispatch]);

  const tabs = ['My Tickets', 'Activity'];

  if (isLoading) return <Loading />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="px-6 md:px-16 pt-10 md:pt-16 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#f72585] to-[#00f5ff] flex items-center justify-center text-white text-2xl font-black shrink-0 uppercase">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <h1 className="text-2xl font-black text-white uppercase tracking-tight">{user.name}</h1>
                  {user.isAdmin && (
                    <span className="px-2 py-0.5 bg-[#f72585]/20 text-[#f72585] text-[10px] font-bold uppercase rounded-full">Admin</span>
                  )}
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-white/40 flex items-center gap-2 justify-center md:justify-start">📧 {user.email}</p>
                  <p className="text-sm text-white/40 flex items-center gap-2 justify-center md:justify-start">📱 {user.phone}</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-center">
                <p className="text-xs text-white/40 uppercase tracking-widest">Credits</p>
                <p className="text-3xl font-black text-[#f72585] mt-1">{user.credits}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-10 mb-8">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                className={`px-6 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all ${
                  i === 0
                    ? 'bg-[#f72585] text-white shadow-[0_0_20px_rgba(247,37,133,0.3)]'
                    : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Orders — now clickable to ticket detail */}
          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order, i) => (
                <Link
                  key={order._id}
                  to={`/ticket/${order._id}`}
                  className="group bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row gap-5 hover:border-[#f72585]/20 hover:shadow-[0_0_30px_rgba(247,37,133,0.08)] transition-all duration-300 block animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <img src={order.event.eventImage} alt={order.event.title} className="w-full md:w-32 h-32 md:h-24 rounded-xl object-cover brightness-75 group-hover:brightness-90 transition-all shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-white uppercase tracking-tight group-hover:text-[#f72585] transition-colors">{order.event.title}</h3>
                        <p className="text-sm text-[#00f5ff] mt-1">{order.event.eventArtistName}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[order.status]}`}>{order.status}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/40">
                      <span>🎫 {order.seats} seat{order.seats > 1 ? 's' : ''}</span>
                      <span>📅 {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest">Billed</p>
                      <p className="text-xl font-black text-[#f72585]">₹{order.billedAmount.toLocaleString()}</p>
                    </div>
                    <span className="text-xs text-white/20 group-hover:text-[#f72585]/60 transition-colors mt-2">View Ticket →</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <p className="text-white/20 uppercase tracking-widest">No tickets booked yet</p>
                <Link to="/events" className="inline-block mt-4 text-[#f72585] font-bold uppercase text-xs hover:underline">Browse Events →</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
