import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents } from '../features/event/eventSlice';
import Loading from '../components/Loading';

const statusTabs = ['All', 'Upcoming', 'Ongoing', 'Expired'];

const genreColors = {
  EDM: 'bg-[#00f5ff]/20 text-[#00f5ff]',
  TECHNO: 'bg-purple-500/20 text-purple-400',
  POP: 'bg-[#f72585]/20 text-[#f72585]',
  JAZZ: 'bg-amber-500/20 text-amber-400',
  BASS: 'bg-green-500/20 text-green-400',
  ROCK: 'bg-orange-500/20 text-orange-400',
};

const statusColors = {
  upcoming: 'bg-green-500/20 text-green-400 border-green-500/30',
  ongoing: 'bg-[#f72585]/20 text-[#f72585] border-[#f72585]/30',
  expired: 'bg-white/10 text-white/40 border-white/10',
};

export default function Events() {
  const dispatch = useDispatch();
  const { events, isLoading } = useSelector((state) => state.event);
  const [activeTab, setActiveTab] = useState('All');
  const [sortOrder, setSortOrder] = useState('Sort by Price');

  const filteredEvents = events.filter((event) => {
    if (activeTab === 'All') return true;
    return event.status.toLowerCase() === activeTab.toLowerCase();
  }).sort((a, b) => {
    if (sortOrder === 'Low to High') return a.ticketPrice - b.ticketPrice;
    if (sortOrder === 'High to Low') return b.ticketPrice - a.ticketPrice;
    return 0; // Default or 'Sort by Price'
  });

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Banner */}
      <section className="relative h-64 md:h-80 overflow-hidden flex items-center justify-center">
        <img src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1600" alt="" className="absolute inset-0 w-full h-full object-cover brightness-[0.25]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/50" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent animate-fade-in-up">Discover Events</h1>
          <p className="text-white/40 mt-3 animate-fade-in-up animation-delay-200">Find your next electrifying experience</p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 md:px-16 -mt-6 relative z-20">
        <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-wrap items-center gap-4">
          {/* Status Tabs */}
          <div className="flex gap-2">
            {statusTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === tab ? 'bg-[#f72585] text-white' : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-xs text-white/60 outline-none [&>option]:bg-[#141414] [&>option]:text-white"
          >
            <option value="Sort by Price">Sort by Price</option>
            <option value="Low to High">Low to High</option>
            <option value="High to Low">High to Low</option>
          </select>
        </div>
      </section>

      {/* Events Grid */}
      <section className="px-6 md:px-16 mt-10 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Link
              key={event._id}
              to={`/events/${event._id}`}
              className="group bg-[#141414] border border-white/5 rounded-2xl overflow-hidden hover:border-[#f72585]/20 hover:shadow-[0_0_30px_rgba(247,37,133,0.1)] transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img src={event.eventImage} alt={event.title} className="w-full h-full object-cover brightness-75 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${genreColors[event.genre] || 'bg-white/10 text-white/60'}`}>{event.genre}</span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusColors[event.status]}`}>
                    {event.status === 'ongoing' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f72585] animate-pulse mr-1 align-middle" />}
                    {event.status}
                  </span>
                </div>
                {/* Hover CTA overlay */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-4 bg-gradient-to-t from-black/90 to-transparent">
                  <span className="block w-full text-center py-2 bg-[#f72585] text-white text-sm font-bold uppercase rounded-lg">Get Tickets</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-[#f72585] transition-colors">{event.title}</h3>
                <p className="text-sm text-[#00f5ff] font-semibold mt-1">{event.eventArtistName}</p>
                <div className="mt-3 flex flex-col gap-1.5 text-xs text-white/40">
                  <span className="flex items-center gap-2">📅 {event.eventDate}</span>
                  <span className="flex items-center gap-2">📍 {event.eventLocation}</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xl font-black text-[#f72585]">₹{event.ticketPrice.toLocaleString()}</span>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest">{event.duration}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
