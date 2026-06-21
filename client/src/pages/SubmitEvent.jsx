import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createEvent, getMyEvents, reset } from '../features/event/eventSlice';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

const statusStyles = {
  pending: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', label: '⏳ Pending Review' },
  approved: { bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-400', label: '✓ Approved' },
  rejected: { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', label: '✗ Rejected' },
};

export default function SubmitEvent() {
  const [formData, setFormData] = useState({
    title: '',
    eventArtistName: '',
    description: '',
    eventLocation: '',
    eventDate: '',
    totalSeats: '',
    ticketPrice: '',
    duration: '',
    genre: '',
    image: null
  });

  const { title, eventArtistName, description, eventLocation, eventDate, totalSeats, ticketPrice, duration, genre, image } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submitted = useRef(false);

  const { isLoading, isSuccess, isError, message, myEvents } = useSelector((state) => state.event);
  const mySubmissions = myEvents || [];


  useEffect(() => {
    dispatch(getMyEvents());
  }, [dispatch]);

  useEffect(() => {
    if (submitted.current) {
      if (isError && message) {
        toast.error(message);
        dispatch(reset());
        submitted.current = false;
      }
      if (isSuccess) {
        toast.success("Event Submitted Successfully!");
        dispatch(reset());
        dispatch(getMyEvents());
        submitted.current = false;
        navigate('/');
      }
    }
  }, [isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    const eventData = new FormData();
    eventData.append('title', title);
    eventData.append('eventArtistName', eventArtistName);
    eventData.append('description', description);
    eventData.append('eventLocation', eventLocation);
    eventData.append('eventDate', eventDate);
    eventData.append('totalSeats', totalSeats);
    eventData.append('ticketPrice', ticketPrice);
    eventData.append('duration', duration);
    eventData.append('genre', genre);
    eventData.append('eventImage', image);

    submitted.current = true;
    dispatch(createEvent(eventData));
  };

  if (isLoading) return <Loading />;
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="px-6 md:px-16 pt-10 md:pt-16 pb-20">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight bg-gradient-to-r from-[#f72585] to-[#00f5ff] bg-clip-text text-transparent animate-fade-in-up">Submit Your Event</h1>
              <p className="text-white/40 mt-2 animate-fade-in-up animation-delay-200">Create an event and submit it for admin approval</p>
            </div>
          </div>

          {/* Create Event Form */}
          <form onSubmit={onSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-12 animate-fade-in-up animation-delay-300">
            <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f72585]" />
              New Event Submission
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Event Title *</label>
                <input 
                  type="text" 
                  name="title"
                  value={title}
                  onChange={onChange}
                  placeholder="e.g. Neon Nights Festival" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 outline-none focus:border-[#f72585]/50 transition-colors" 
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Description *</label>
                <textarea 
                  name="description"
                  value={description}
                  onChange={onChange}
                  rows={3} 
                  placeholder="Tell us about your event..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 outline-none focus:border-[#f72585]/50 transition-colors resize-none" 
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Artist / Performer *</label>
                  <input 
                    type="text" 
                    name="eventArtistName"
                    value={eventArtistName}
                    onChange={onChange}
                    placeholder="e.g. DJ SPARK" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 outline-none focus:border-[#f72585]/50 transition-colors" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Duration *</label>
                  <input 
                    type="text" 
                    name="duration"
                    value={duration}
                    onChange={onChange}
                    placeholder="e.g. 3h 30min" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 outline-none focus:border-[#f72585]/50 transition-colors" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Event Date *</label>
                  <input 
                    type="date" 
                    name="eventDate"
                    value={eventDate}
                    onChange={onChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white/50 outline-none focus:border-[#f72585]/50 transition-colors" 
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Venue / Location *</label>
                  <input 
                    type="text" 
                    name="eventLocation"
                    value={eventLocation}
                    onChange={onChange}
                    placeholder="e.g. Mumbai Arena, India" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 outline-none focus:border-[#f72585]/50 transition-colors" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Total Seats</label>
                  <input 
                    type="number" 
                    name="totalSeats"
                    value={totalSeats}
                    onChange={onChange}
                    placeholder="e.g. 3000" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 outline-none focus:border-[#f72585]/50 transition-colors" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Ticket Price (₹)</label>
                  <input 
                    type="number" 
                    name="ticketPrice"
                    value={ticketPrice}
                    onChange={onChange}
                    placeholder="e.g. 1199" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 outline-none focus:border-[#f72585]/50 transition-colors" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Genre / Category *</label>
                  <select 
                    name="genre"
                    value={genre}
                    onChange={onChange}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#f72585]/50 transition-colors appearance-none" 
                    required
                  >
                    <option value="" disabled>Select a genre</option>
                    <option value="ROCK">ROCK</option>
                    <option value="POP">POP</option>
                    <option value="EDM">EDM</option>
                    <option value="TECHNO">TECHNO</option>
                    <option value="HIP HOP">HIP HOP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Event Poster</label>
                  <label className="flex flex-col items-center justify-center w-full h-28 bg-white/5 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-[#f72585]/50 transition-colors">
                    <input 
                      type="file" 
                      name="image"
                      onChange={onChange}
                      className="hidden" 
                      accept="image/*"
                      required
                    />
                    <span className="text-2xl mb-1">📷</span>
                    <span className="text-xs text-white/40">{image ? image.name : 'Click to upload poster image'}</span>
                    <span className="text-[10px] text-white/20 mt-1">PNG, JPG up to 5MB</span>
                  </label>
                </div>
              </div>

              {/* Info notice */}
              <div className="bg-[#00f5ff]/5 border border-[#00f5ff]/15 rounded-xl p-4 flex gap-3">
                <span className="text-[#00f5ff] text-lg shrink-0">ℹ️</span>
                <p className="text-xs text-white/50 leading-relaxed">Your event will be reviewed by the VOLT admin team. Once approved, it will go live on the platform and users can book tickets. This usually takes 1-2 business days.</p>
              </div>

              <button 
                type="submit"
                className="px-8 py-4 bg-[#f72585] text-white font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_0_30px_rgba(247,37,133,0.5)] transition-all duration-300 text-sm"
              >
                ⚡ Submit for Review
              </button>
            </div>
          </form>

          {/* My Submissions */}
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white mb-6 animate-fade-in-up">My Submissions</h2>

            {mySubmissions.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <p className="text-white/30 text-sm">You haven't submitted any events yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mySubmissions.map((event, i) => {
                  const st = event.isActive ? statusStyles.approved : statusStyles.pending;
                  return (
                    <div key={event._id} className={`${st.bg} border rounded-2xl p-5 animate-fade-in-up`} style={{ animationDelay: `${i * 100 + 400}ms` }}>
                      <div className="flex flex-col md:flex-row gap-5">
                        <img src={event.eventImage} alt={event.title} className="w-full md:w-32 h-32 md:h-24 rounded-xl object-cover brightness-75 shrink-0" />
                        <div className="flex-1">
                          <div className="flex flex-wrap justify-between items-start gap-2">
                            <div>
                              <h3 className="font-bold text-white uppercase tracking-tight">{event.title}</h3>
                              <p className="text-sm text-[#00f5ff] mt-0.5">{event.eventArtistName}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${st.text} bg-white/5`}>
                              {st.label}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-4 text-xs text-white/40">
                            <span>📅 {event.eventDate}</span>
                            <span>📍 {event.eventLocation}</span>
                            <span>🎫 ₹{event.ticketPrice.toLocaleString()}</span>
                            <span>Submitted: {new Date(event.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
