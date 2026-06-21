import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAllEvents, updateEventInfo, deleteEvent } from '../../features/admin/adminSlice';
import AdminLayout from '../../components/AdminLayout';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';

const statusColors = {
  upcoming: 'bg-green-500/20 text-green-400',
  ongoing: 'bg-[#f72585]/20 text-[#f72585]',
  expired: 'bg-white/10 text-white/40',
};

export default function AdminEvents() {
  const dispatch = useDispatch();
  const { events, isLoading } = useSelector((state) => state.admin);

  const [filter, setFilter] = useState('All Events');
  const [modalState, setModalState] = useState({ isOpen: false, idToDelete: null });

  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);

  const handleToggleActive = (eventId, currentStatus) => {
    dispatch(updateEventInfo({ eventId, eventData: { isActive: !currentStatus } })).then(res => {
      if(!res.error) toast.success("Status Updated");
    });
  };

  const triggerDelete = (id) => setModalState({ isOpen: true, idToDelete: id });

  const confirmDelete = () => {
    dispatch(deleteEvent(modalState.idToDelete)).then(res => {
      if(!res.error) toast.success("Event Deleted");
    });
    setModalState({ isOpen: false, idToDelete: null });
  };

  const filteredEvents = events?.filter(event => {
    if (filter === 'Pending Approval') return !event.isActive;
    if (filter === 'Active') return event.isActive;
    if (filter === 'Upcoming') return event.status === 'upcoming';
    if (filter === 'Ongoing') return event.status === 'ongoing';
    if (filter === 'Expired') return event.status === 'expired';
    return true; // 'All Events'
  });

  if (isLoading) return <Loading />;
  return (
    <AdminLayout current="/admin/events">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white animate-fade-in-up">Manage Events</h1>
          <p className="text-white/40 mt-1">{filteredEvents?.length || 0} events found</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-xs text-white/60 outline-none [&>option]:bg-[#141414] [&>option]:text-white"
          >
            <option>All Events</option>
            <option>Pending Approval</option>
            <option>Active</option>
            <option>Upcoming</option>
            <option>Ongoing</option>
            <option>Expired</option>
          </select>
          <Link to="/admin/events/create" className="px-4 py-2 bg-[#f72585] text-white text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(247,37,133,0.4)] transition-all">+ Create Event</Link>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-white/30 uppercase tracking-wider border-b border-white/10">
                <th className="text-left p-4">Event</th>
                <th className="text-left p-4 hidden md:table-cell">Artist</th>
                <th className="text-left p-4 hidden lg:table-cell">Date</th>
                <th className="text-left p-4 hidden lg:table-cell">Location</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Active</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents?.map((event, i) => (
                <tr key={event._id} className={`border-b border-white/5 last:border-b-0 hover:bg-white/[0.03] transition-colors ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={event.eventImage} alt={event.title} className="w-12 h-12 rounded-lg object-cover brightness-75 shrink-0" />
                      <span className="text-sm text-white font-medium">{event.title}</span>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell"><span className="text-sm text-[#00f5ff]">{event.eventArtistName}</span></td>
                  <td className="p-4 hidden lg:table-cell"><span className="text-sm text-white/50">{event.eventDate}</span></td>
                  <td className="p-4 hidden lg:table-cell"><span className="text-sm text-white/50">{event.eventLocation}</span></td>
                  <td className="p-4"><span className="text-sm text-[#f72585] font-bold">₹{event.ticketPrice?.toLocaleString()}</span></td>
                  <td className="p-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusColors[event.status] || 'bg-white/10'}`}>{event.status}</span></td>
                  <td className="p-4">
                    <div 
                      onClick={() => handleToggleActive(event._id, event.isActive)}
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-all ${event.isActive ? 'bg-[#f72585]' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${event.isActive ? 'left-5' : 'left-0.5'}`} />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/events/edit/${event._id}`} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center text-xs">✏️</Link>
                      <button 
                        onClick={() => triggerDelete(event._id)}
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
        title="Delete Event"
        message="Are you sure you want to permanently delete this event? This action cannot be undone."
      />
    </AdminLayout>
  );
}
