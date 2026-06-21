import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCoupons, updateCoupon, deleteCoupon } from '../../features/admin/adminSlice';
import AdminLayout from '../../components/AdminLayout';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function AdminCoupons() {
  const dispatch = useDispatch();
  const { coupons, isLoading } = useSelector((state) => state.admin);
  const [modalState, setModalState] = useState({ isOpen: false, idToDelete: null });

  useEffect(() => {
    dispatch(fetchAllCoupons());
  }, [dispatch]);

  const triggerDelete = (id) => setModalState({ isOpen: true, idToDelete: id });

  const confirmDelete = () => {
    dispatch(deleteCoupon(modalState.idToDelete)).then(res => {
      if (!res.error) toast.success("Coupon Deleted");
    });
    setModalState({ isOpen: false, idToDelete: null });
  };

  const handleToggleStatus = (id, currentStatus) => {
    dispatch(updateCoupon({ couponId: id, couponData: { isActive: !currentStatus } })).then(res => {
      if (!res.error) toast.success("Status Updated");
    });
  };

  if (isLoading) return <Loading />;
  return (
    <AdminLayout current="/admin/coupons">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white animate-fade-in-up">Manage Coupons</h1>
          <p className="text-white/40 mt-1">{coupons.length} coupons found</p>
        </div>
        <Link to="/admin/coupons/create" className="px-4 py-2 bg-[#f72585] text-white text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(247,37,133,0.4)] transition-all">+ Create Coupon</Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-white/30 uppercase tracking-wider border-b border-white/10">
                <th className="text-left p-4">Coupon Code</th>
                <th className="text-left p-4">Discount %</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon, i) => (
                <tr key={coupon._id} className={`border-b border-white/5 last:border-b-0 hover:bg-white/[0.03] transition-colors ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <td className="p-4"><span className="text-sm text-white font-mono font-bold bg-white/5 px-3 py-1 rounded-lg">{coupon.couponCode}</span></td>
                  <td className="p-4"><span className="text-sm text-[#f72585] font-bold">{coupon.couponDiscount}%</span></td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div 
                        onClick={() => handleToggleStatus(coupon._id, coupon.isActive)}
                        className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${coupon.isActive ? 'bg-[#f72585]' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${coupon.isActive ? 'left-5' : 'left-0.5'}`} />
                      </div>
                      <span className={`text-xs font-semibold uppercase ${coupon.isActive ? 'text-green-400' : 'text-white/30'}`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/coupons/edit/${coupon._id}`} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center text-xs">✏️</Link>
                      <button 
                        onClick={() => triggerDelete(coupon._id)}
                        className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all flex items-center justify-center text-xs"
                      >
                        🗑️
                      </button>
                    </div>
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
        title="Delete Coupon"
        message="Are you sure you want to permanently delete this coupon? This action cannot be undone."
      />
    </AdminLayout>
  );
}
