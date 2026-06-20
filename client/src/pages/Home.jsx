import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents } from '../features/event/eventSlice';
import Footer from '../components/Footer';
import Loading from '../components/Loading';

const genres = ['ALL GENRES', 'ROCK', 'POP', 'EDM', 'TECHNO', 'HIP HOP'];

const liveShows = [
  { id: 1, title: 'NEON NIGHTS FESTIVAL', subtitle: 'Live from Tokyo Dome', viewers: '12.4K', image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600' },
  { id: 2, title: 'UNDERGROUND SESSIONS', subtitle: 'Berlin Warehouse', viewers: '8.7K', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600' },
  { id: 3, title: 'SUNSET BASS', subtitle: 'Ibiza Main Stage', viewers: '24.1K', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600' },
];

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const dispatch = useDispatch();
  const { events, isLoading } = useSelector((state) => state.event);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden flex items-center">
        {/* Background layers */}
        <div className="absolute inset-0" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
          <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600" alt="" className="w-full h-full object-cover brightness-[0.2] scale-110" />
        </div>

        {/* Spotlight beams */}
        <div className="absolute top-0 left-1/4 w-32 h-[120%] bg-gradient-to-b from-[#f72585]/10 to-transparent rotate-12 animate-spotlight" />
        <div className="absolute top-0 right-1/3 w-24 h-[120%] bg-gradient-to-b from-[#00f5ff]/8 to-transparent -rotate-6 animate-spotlight" style={{ animationDelay: '3s' }} />
        <div className="absolute top-0 left-1/2 w-20 h-[120%] bg-gradient-to-b from-[#f72585]/6 to-transparent rotate-3 animate-spotlight" style={{ animationDelay: '5s' }} />

        {/* Crowd silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10" style={{ transform: `translateY(${scrollY * 0.3}px)` }} />

        {/* Content */}
        <div className="relative z-20 px-6 md:px-16 max-w-4xl" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
          <span className="inline-block text-[#00f5ff] text-xs font-mono uppercase tracking-[0.3em] mb-6 animate-fade-in-up">● Streaming Now Worldwide</span>

          <h1 className="animate-fade-in-up animation-delay-200">
            <span className="block text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none">Feel The</span>
            <span className="block text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none bg-gradient-to-r from-[#f72585] to-[#00f5ff] bg-clip-text text-transparent">Voltage</span>
          </h1>

          <p className="mt-6 text-white/50 text-lg md:text-xl max-w-lg leading-relaxed animate-fade-in-up animation-delay-400">
            Immerse yourself in the world's most electrifying live events. From underground raves to arena spectacles.
          </p>

          <div className="mt-10 flex flex-wrap gap-4 animate-fade-in-up animation-delay-600">
            <Link to="/events" className="px-8 py-4 bg-[#f72585] text-white font-bold uppercase tracking-wider rounded-lg hover:shadow-[0_0_30px_rgba(247,37,133,0.5)] transition-all duration-300 hover:scale-105">
              Enter The Stage
            </Link>
            <button className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/20 text-white font-bold uppercase tracking-wider rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full border-2 border-white/40 flex items-center justify-center text-xs">▶</span>
              View Trailer
            </button>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-20" />
      </section>

      {/* Genre Filter Bar */}
      <section className="relative z-30 -mt-12 px-6 md:px-16">
        <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
            <span className="text-white/30">🔍</span>
            <input type="text" placeholder="Search events..." className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none w-full" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {genres.map((g, i) => (
              <span
                key={g}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all duration-200 ${
                  i === 0
                    ? 'bg-[#f72585] text-white shadow-[0_0_15px_rgba(247,37,133,0.3)]'
                    : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                }`}
              >
                {g}
              </span>
            ))}
          </div>
          <button className="w-10 h-10 rounded-full bg-[#f72585] flex items-center justify-center hover:shadow-[0_0_20px_rgba(247,37,133,0.4)] transition-all shrink-0">
            <span className="text-white text-sm">⚡</span>
          </button>
        </div>
      </section>

      {/* Featured Shows */}
      <section className="px-6 md:px-16 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">Featured Shows</h2>
              <p className="text-white/40 mt-2">Handpicked events from around the globe</p>
            </div>
            <Link to="/events" className="text-[#f72585] text-sm font-semibold hover:underline uppercase tracking-wider hidden md:block">View All Lineup →</Link>
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Large featured card */}
              <div className="lg:col-span-2 group relative rounded-2xl overflow-hidden h-[400px] md:h-[500px] hover:scale-[1.02] transition-transform duration-500 cursor-pointer">
                <img src={events[0].eventImage} alt={events[0].title} className="w-full h-full object-cover brightness-50 group-hover:brightness-[0.4] transition-all duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className="px-3 py-1 bg-[#f72585] text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Headline</span>
                  <span className="px-3 py-1 bg-white/10 backdrop-blur text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Global Tour 2025</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">{events[0].title}</h3>
                  <p className="text-white/50 mt-2 line-clamp-2">{events[0].description}</p>
                  <Link to={`/events/${events[0]._id}`} className="inline-block mt-4 px-6 py-3 bg-[#f72585] text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:shadow-[0_0_30px_rgba(247,37,133,0.5)] transition-all">
                    Get Tickets
                  </Link>
                </div>
              </div>

              {/* Two smaller cards */}
              <div className="flex flex-col gap-6">
                {events.slice(1, 3).map((event) => (
                  <Link key={event._id} to={`/events/${event._id}`} className="group relative rounded-2xl overflow-hidden h-[190px] md:h-[237px] hover:scale-[1.02] transition-transform duration-500">
                    <img src={event.eventImage} alt={event.title} className="w-full h-full object-cover brightness-50 group-hover:brightness-[0.35] transition-all duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[10px] uppercase tracking-widest text-[#00f5ff] font-semibold">{event.eventArtistName}</span>
                      <h3 className="text-lg font-black uppercase tracking-tight text-white mt-1">{event.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
