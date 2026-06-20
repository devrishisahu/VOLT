import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminRequests, updateRequestStatus } from '../../features/credits/creditSlice';
import AdminLayout from '../../components/AdminLayout';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';

export default function AdminCredits() {
  const dispatch = useDispatch();
  const { requests, isLoading } = useSelector((state) => state.credits);

  useEffect(() => {
    dispatch(getAdminRequests());
  }, [dispatch]);

  const handleAction = (id, status) => {
    dispatch(updateRequestStatus({ id, status })).then((res) => {
      if (!res.error) {
        toast.success(`Request ${status.charAt(0).toUpperCase() + status.slice(1)}`);
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <AdminLayout current="/admin/credits">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Credit Requests</h1>
        <p className="text-white/40 mt-1">Approve or reject user wallet top-up requests</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-white/30 uppercase tracking-wider border-b border-white/10">
              <th className="p-4">User</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-white/20 italic">No pending requests</td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4">
                    <div className="text-sm font-bold text-white">{req.user?.name}</div>
                    <div className="text-xs text-white/40">{req.user?.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-mono text-[#00f5ff]">₹{req.amount}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      req.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                      req.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {req.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleAction(req._id, 'approved')}
                          className="px-3 py-1 bg-green-500 text-white text-[10px] font-bold uppercase rounded hover:bg-green-600 transition-colors"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleAction(req._id, 'rejected')}
                          className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold uppercase rounded hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
