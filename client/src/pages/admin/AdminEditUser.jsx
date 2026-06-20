import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchAllUsers, updateUserInfo } from '../../features/admin/adminSlice';
import AdminLayout from '../../components/AdminLayout';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';

export default function AdminEditUser() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, isLoading } = useSelector((state) => state.admin);
  const user = users.find((u) => u._id === id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    isActive: false,
    isAdmin: false
  });

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchAllUsers());
    }
  }, [users, dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        isActive: user.isActive,
        isAdmin: user.isAdmin
      });
    }
  }, [user]);

  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const onSubmit = () => {
    dispatch(updateUserInfo({ userId: id, userData: formData })).then((res) => {
      if (!res.error) {
        toast.success("User Updated!");
        navigate('/admin/users');
      } else {
        toast.error(res.payload || "Failed to update user");
      }
    });
  };

  if (isLoading || !user) return <Loading />;

  return (
    <AdminLayout current="/admin/users">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <Link to="/admin/users" className="text-white/40 hover:text-white text-sm flex items-center gap-2 mb-2 transition-colors">
            ← Back
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white animate-fade-in-up">EDIT USER</h1>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f72585] to-[#00f5ff] flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-white/40 text-sm">ID: {user._id}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={onChange} className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#f72585]/50 transition-colors" />
          </div>

          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={onChange} className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#f72585]/50 transition-colors" />
          </div>

          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={onChange} className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#f72585]/50 transition-colors" />
          </div>

          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Credits</label>
            <input type="number" defaultValue={user.credits} className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#f72585]/50 transition-colors" />
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
            <div>
              <div className="text-sm font-bold text-white">Active Status</div>
              <div className="text-xs text-white/40 mt-1">Is this user allowed to login?</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={onChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
            <div>
              <div className="text-sm font-bold text-[#f72585]">Admin Privileges</div>
              <div className="text-xs text-[#f72585]/60 mt-1">Can this user access the admin panel?</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isAdmin" checked={formData.isAdmin} onChange={onChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f72585]"></div>
            </label>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex justify-end gap-4">
          <Link to="/admin/users" className="px-6 py-3 bg-white/5 text-white font-bold uppercase tracking-wider rounded-xl hover:bg-white/10 transition-all text-sm">Cancel</Link>
          <button 
            onClick={onSubmit}
            className="px-8 py-3 bg-[#f72585] text-white font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(247,37,133,0.4)] transition-all text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
