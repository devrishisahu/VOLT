import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createNewCoupon, resetAdmin } from '../../features/admin/adminSlice';
import AdminLayout from '../../components/AdminLayout';
import { toast } from 'react-toastify';

export default function AdminCreateCoupon() {
  const [formData, setFormData] = useState({
    couponCode: '',
    couponDiscount: ''
  });
  const { couponCode, couponDiscount } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, message } = useSelector((state) => state.admin);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createNewCoupon(formData)).then((res) => {
      if (!res.error) {
        toast.success("Coupon Created!");
        navigate('/admin/coupons');
      } else {
        toast.error(res.payload || "Failed to create coupon");
      }
      dispatch(resetAdmin());
    });
  };
  return (
    <AdminLayout current="/admin/coupons">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link to="/admin/coupons" className="text-white/30 hover:text-white transition-colors text-sm">← Back</Link>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white animate-fade-in-up">Create Coupon</h1>
      </div>

      {/* Form */}
      <div className="max-w-lg">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6 animate-fade-in-up animation-delay-200">
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Coupon Code</label>
            <input
              type="text"
              name="couponCode"
              value={couponCode}
              onChange={onChange}
              placeholder="e.g. VOLT20"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 outline-none focus:border-[#f72585]/50 transition-colors font-mono uppercase"
            />
          </div>

          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Discount Percentage</label>
            <div className="relative">
              <input
                type="number"
                name="couponDiscount"
                value={couponDiscount}
                onChange={onChange}
                placeholder="e.g. 20"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 outline-none focus:border-[#f72585]/50 transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 font-bold">%</span>
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Status</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="w-10 h-5 rounded-full bg-[#f72585] relative">
                  <div className="absolute top-0.5 left-5 w-4 h-4 rounded-full bg-white" />
                </div>
                <span className="text-sm text-green-400">Active</span>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="border-t border-white/10 pt-6">
            <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Preview</p>
            <div className="bg-gradient-to-r from-[#f72585]/10 to-[#00f5ff]/10 border border-[#f72585]/20 rounded-xl p-4 flex justify-between items-center">
              <div>
                <span className="text-white font-mono font-bold text-lg">{couponCode || 'VOLT20'}</span>
                <p className="text-xs text-white/40 mt-1">Active coupon</p>
              </div>
              <span className="text-3xl font-black text-[#f72585]">{couponDiscount || '0'}%</span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-2">
            <button 
              onClick={onSubmit}
              disabled={isLoading}
              className="px-8 py-4 bg-[#f72585] text-white font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_0_30px_rgba(247,37,133,0.5)] transition-all duration-300 text-sm disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Coupon"}
            </button>
            <Link to="/admin/coupons" className="px-8 py-4 bg-white/5 border border-white/10 text-white/60 font-bold uppercase tracking-wider rounded-xl hover:bg-white/10 transition-all text-sm">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
