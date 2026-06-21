import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEvents, updateEventInfo } from '../../features/admin/adminSlice';
import AdminLayout from '../../components/AdminLayout';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';

export default function AdminEditEvent() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { events, isLoading } = useSelector((state) => state.admin);
  const event = events?.find((e) => e._id === id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventArtistName: '',
    genre: '',
    eventDate: '',
    duration: '',
    eventLocation: '',
    totalSeats: '',
    ticketPrice: '',
    status: ''
  });

  useEffect(() => {
    if (!events || events.length === 0) {
      dispatch(fetchAllEvents());
    }
  }, [events, dispatch]);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        eventArtistName: event.eventArtistName || '',
        genre: event.genre || '',
        eventDate: event.eventDate || '',
        duration: event.duration || '',
        eventLocation: event.eventLocation || '',
        totalSeats: event.totalSeats || '',
        ticketPrice: event.ticketPrice || '',
        status: event.status || 'upcoming'
      });
    }
  }, [event]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(updateEventInfo({ eventId: id, eventData: formData })).then((res) => {
      if (!res.error) {
        toast.success("Event updated successfully!");
        navigate("/admin/events");
      } else {
        toast.error(res.payload || "Failed to update event");
      }
    });
  };

  if (isLoading || !event) return <AdminLayout current="/admin/events"><Loading /></AdminLayout>;

  return (
    <AdminLayout current="/admin/events">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <Link to="/admin/events" className="text-white/40 hover:text-white text-sm flex items-center gap-2 mb-2 transition-colors">
            ← Back
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white animate-fade-in-up">EDIT EVENT</h1>
        </div>
      </div>

      <form onSubmit={onSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 animate-fade-in-up max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Event Title</label>
            <input type="text" name="title" value={formData.title} onChange={onChange} className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#f72585]/50 transition-colors" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Description</label>
            <textarea rows={4} name="description" value={formData.description} onChange={onChange} className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#f72585]/50 transition-colors resize-none" />
          </div>

          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Artist Name</label>
            <input type="text" name="eventArtistName" value={formData.eventArtistName} onChange={onChange} className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#f72585]/50 transition-colors" />
          </div>

          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Genre</label>
            <select name="genre" value={formData.genre} onChange={onChange} className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3.5 text-white/50 outline-none focus:border-[#f72585]/50 transition-colors [&>option]:bg-[#141414] [&>option]:text-white">
              <option value="" disabled>Select Genre</option>
              <option value="EDM">EDM</option>
              <option value="TECHNO">TECHNO</option>
              <option value="POP">POP</option>
              <option value="ROCK">ROCK</option>
              <option value="HIP HOP">HIP HOP</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Event Date</label>
            <input type="text" name="eventDate" value={formData.eventDate} onChange={onChange} className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#f72585]/50 transition-colors" />
          </div>

          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Duration</label>
            <input type="text" name="duration" value={formData.duration} onChange={onChange} className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#f72585]/50 transition-colors" />
          </div>

          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Location</label>
            <input type="text" name="eventLocation" value={formData.eventLocation} onChange={onChange} className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#f72585]/50 transition-colors" />
          </div>

          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Total Seats</label>
            <input type="number" name="totalSeats" value={formData.totalSeats} onChange={onChange} className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#f72585]/50 transition-colors" />
          </div>

          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Ticket Price (₹)</label>
            <input type="number" name="ticketPrice" value={formData.ticketPrice} onChange={onChange} className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#f72585]/50 transition-colors" />
          </div>

          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Status</label>
            <select name="status" value={formData.status} onChange={onChange} className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3.5 text-white/50 outline-none focus:border-[#f72585]/50 transition-colors [&>option]:bg-[#141414] [&>option]:text-white">
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex justify-end gap-4">
          <Link to="/admin/events" className="px-6 py-3 bg-white/5 text-white font-bold uppercase tracking-wider rounded-xl hover:bg-white/10 transition-all text-sm">Cancel</Link>
          <button type="submit" className="px-8 py-3 bg-[#f72585] text-white font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(247,37,133,0.4)] transition-all text-sm">Save Changes</button>
        </div>
      </form>
    </AdminLayout>
  );
}
