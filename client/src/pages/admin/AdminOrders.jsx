import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, deleteOrder } from '../../features/admin/adminSlice';
import AdminLayout from '../../components/AdminLayout';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';

const statusColors = {
  confirmed: 'bg-green-500/20 text-green-400',
  pending: 'bg-amber-500/20 text-amber-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

const statusTabs = ['All', 'Confirmed', 'Pending', 'Cancelled'];

export default function AdminOrders() {
  const [activeTab, setActiveTab] = useState('All');
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.admin);
  const [modalState, setModalState] = useState({ isOpen: false, idToDelete: null });

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const triggerDelete = (id) => setModalState({ isOpen: true, idToDelete: id });

  const confirmDelete = () => {
    dispatch(deleteOrder(modalState.idToDelete)).then(res => {
      if (!res.error) toast.success("Order Deleted");
    });
    setModalState({ isOpen: false, idToDelete: null });
  };

  const filteredOrders = activeTab === 'All' 
    ? orders 
    : orders?.filter(o => o?.status?.toLowerCase() === activeTab.toLowerCase());

  if (isLoading) return <Loading />;
  return (
    <AdminLayout current="/admin/orders">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white animate-fade-in-up">Manage Orders</h1>
          <p className="text-white/40 mt-1">{filteredOrders?.length || 0} orders found</p>
        </div>
        <button className="px-4 py-2 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-lg hover:bg-white/10 transition-all flex items-center gap-2">
          📥 Export
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {statusTabs.map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-[#f72585] text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-white/30 uppercase tracking-wider border-b border-white/10">
                <th className="text-left p-4">Order ID</th>
                <th className="text-left p-4">Event</th>
                <th className="text-left p-4">Seats</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4 hidden md:table-cell">Discount</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4 hidden md:table-cell">Date</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders?.map((order, i) => (
                <tr key={order?._id} className={`border-b border-white/5 last:border-b-0 hover:bg-white/[0.03] transition-colors ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <td className="p-4"><span className="text-sm text-white/50 font-mono">{order?._id?.toUpperCase()}</span></td>
                  <td className="p-4"><span className="text-sm text-white font-medium">{order?.event?.title || 'Unknown Event'}</span></td>
                  <td className="p-4"><span className="text-sm text-white/60">{order?.seats || 0}</span></td>
                  <td className="p-4"><span className="text-sm text-[#f72585] font-bold">₹{order?.billedAmount?.toLocaleString() || 0}</span></td>
                  <td className="p-4 hidden md:table-cell">
                    {order?.isDiscounted ? <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] font-bold uppercase">Yes</span> : <span className="text-xs text-white/30">—</span>}
                  </td>
                  <td className="p-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusColors[order?.status] || 'bg-white/10'}`}>{order?.status || 'Unknown'}</span></td>
                  <td className="p-4 hidden md:table-cell"><span className="text-sm text-white/30">{order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span></td>
                  <td className="p-4">
                    <button 
                      onClick={() => triggerDelete(order._id)}
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all flex items-center justify-center text-xs"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal 
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, idToDelete: null })}
        onConfirm={confirmDelete}
        title="Delete Order"
        message="Are you sure you want to permanently delete this order? This action cannot be undone."
      />
    </AdminLayout>
  );
}
