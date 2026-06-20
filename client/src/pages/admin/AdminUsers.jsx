import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, updateUserInfo } from '../../features/admin/adminSlice';
import AdminLayout from '../../components/AdminLayout';
import Loading from '../../components/Loading';

export default function AdminUsers() {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleToggleActive = (userId, currentStatus) => {
    dispatch(updateUserInfo({ userId, userData: { isActive: !currentStatus } }));
  };

  const handleAddCredits = (userId) => {
    const credits = prompt("Enter credits to add:");
    if (credits && !isNaN(credits)) {
      dispatch(updateUserInfo({ userId, userData: { credits: parseInt(credits) } }));
    }
  };

  if (isLoading) return <Loading />;
  return (
    <AdminLayout current="/admin/users">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white animate-fade-in-up">Manage Users</h1>
          <p className="text-white/40 mt-1">{users?.length || 0} users found</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
          <span className="text-white/30 text-sm">🔍</span>
          <input type="text" placeholder="Search users..." className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none w-40" />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-white/30 uppercase tracking-wider border-b border-white/10">
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4 hidden md:table-cell">Phone</th>
                <th className="text-left p-4">Credits</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user, i) => (
                <tr key={user._id} className={`border-b border-white/5 last:border-b-0 hover:bg-white/[0.03] transition-colors ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f72585] to-[#00f5ff] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {user?.name?.split(' ').map(n => n[0]).join('') || '?'}
                      </div>
                      <span className="text-sm text-white font-medium">{user?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="p-4"><span className="text-sm text-white/50">{user.email}</span></td>
                  <td className="p-4 hidden md:table-cell"><span className="text-sm text-white/50">{user.phone}</span></td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#f72585] font-bold">{user.credits}</span>
                      <button 
                        onClick={() => handleAddCredits(user._id)}
                        className="w-5 h-5 rounded bg-[#f72585]/10 text-[#f72585] text-[10px] hover:bg-[#f72585]/20"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.isAdmin && <span className="px-2 py-0.5 rounded bg-[#f72585]/20 text-[#f72585] text-[10px] font-bold uppercase">Admin</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/users/edit/${user._id}`} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center text-xs">✏️</Link>
                      <button 
                        onClick={() => handleToggleActive(user._id, user.isActive)}
                        className={`w-8 h-8 rounded-lg border transition-all flex items-center justify-center text-xs ${user.isActive ? 'bg-white/5 border-white/10 text-white/50 hover:text-red-400 hover:bg-red-500/10' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}
                      >
                        ⏻
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-white/10 px-6 py-4 flex justify-between items-center">
          <span className="text-xs text-white/30">Showing 1-{users?.length || 0} of {users?.length || 0}</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-white/40">Prev</button>
            <button className="px-3 py-1.5 bg-[#f72585] rounded text-xs text-white font-bold">1</button>
            <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-white/40">Next</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
