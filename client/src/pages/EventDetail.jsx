import { useParams, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getEvents } from '../features/event/eventSlice';
import { getComments, addComment, deleteComment } from '../features/comment/commentSlice';
import { useState } from 'react';
import Loading from '../components/Loading';

export default function EventDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { events, isLoading } = useSelector((state) => state.event);
  const { comments } = useSelector((state) => state.comment);
  const { user } = useSelector((state) => state.auth);
  const event = events.find(e => e._id === id);

  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => {
    if (events.length === 0) {
      dispatch(getEvents());
    }
    dispatch(getComments(id));
  }, [events, dispatch, id]);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    dispatch(addComment({ eventId: id, commentData: { text: commentText, rating } }));
    setCommentText("");
    setRating(5);
  };

  const handleDeleteComment = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (commentToDelete) {
      dispatch(deleteComment(commentToDelete));
      setShowDeleteModal(false);
      setCommentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCommentToDelete(null);
  };

  const statusColors = {
    upcoming: 'bg-green-500/20 text-green-400',
    ongoing: 'bg-[#f72585]/20 text-[#f72585]',
    expired: 'bg-white/10 text-white/40',
  };

  if (isLoading || !event) {
    return <Loading />;
  }


  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Image */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img src={event.eventImage} alt={event.title} className="w-full h-full object-cover brightness-[0.3] scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        <div className="absolute bottom-8 left-6 md:left-16 right-6 z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[event.status]}`}>{event.status}</span>
            <span className="px-3 py-1 rounded-full bg-[#00f5ff]/10 text-[#00f5ff] text-[10px] font-bold uppercase">{event.genre}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white animate-fade-in-up">{event.title}</h1>
          <p className="text-lg text-[#00f5ff] font-semibold mt-2 animate-fade-in-up animation-delay-200">{event.eventArtistName}</p>
        </div>
      </section>

      {/* Two Column Layout */}
      <section className="px-6 md:px-16 mt-10 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left - Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-4">About This Event</h2>
              <p className="text-white/60 leading-relaxed">{event.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Date', value: event.eventDate, icon: '📅' },
                { label: 'Location', value: event.eventLocation, icon: '📍' },
                { label: 'Duration', value: event.duration, icon: '⏱️' },
                { label: 'Seats', value: event.totalSeats.toLocaleString(), icon: '💺' },
                { label: 'Price', value: `₹${event.ticketPrice.toLocaleString()}`, icon: '💰' },
                { label: 'Status', value: event.status.toUpperCase(), icon: '🔵' },
              ].map((d) => (
                <div key={d.label} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4">
                  <span className="text-lg">{d.icon}</span>
                  <p className="text-xs text-white/40 uppercase tracking-wider mt-2">{d.label}</p>
                  <p className="text-white font-semibold mt-1">{d.value}</p>
                </div>
              ))}
            </div>

            {/* Comments */}
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-6">Reviews</h2>
              <div className="space-y-4">
                {comments && comments.length > 0 ? comments.map((c) => (
                  <div key={c._id} className="bg-white/5 border border-white/10 rounded-xl p-5 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f72585] to-[#00f5ff] flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {c.user?.name?.[0] || 'G'}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-semibold text-sm">{c.user?.name || 'Guest'}</p>
                          <div className="flex gap-0.5 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-xs ${i < c.rating ? 'text-amber-400' : 'text-white/15'}`}>★</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-white/30">{new Date(c.createdAt).toLocaleDateString()}</span>
                          {user && (user._id === c.user?._id || user.isAdmin) && (
                            <button 
                              onClick={() => handleDeleteComment(c._id)}
                              className="text-[10px] text-red-500 hover:text-red-400 uppercase tracking-wider font-bold transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-white/50 mt-2">{c.text}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-white/40 italic">No reviews yet. Be the first to share your experience!</p>
                )}
              </div>

              {/* Add Comment */}
              {user ? (
                <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-white">Leave a Review</h3>
                    <div className="flex gap-1 cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className={`text-xl transition-colors duration-200 ${
                            star <= (hoverRating || rating) ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]' : 'text-white/20'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                    placeholder="Share your experience..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#f72585]/50 resize-none"
                  />
                  <button 
                    onClick={handleAddComment}
                    className="mt-3 px-6 py-2 bg-[#f72585] text-white text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(247,37,133,0.4)] transition-all"
                  >
                    Submit
                  </button>
                </div>
              ) : (
                <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                  <p className="text-sm text-white/40 mb-3">Please log in to leave a review</p>
                  <Link to="/login" className="inline-block px-6 py-2 bg-[#f72585]/20 text-[#f72585] text-sm font-bold rounded-lg hover:bg-[#f72585]/30 transition-all">Log In</Link>
                </div>
              )}
            </div>
          </div>

          {/* Right - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="text-center">
                <p className="text-xs text-white/40 uppercase tracking-widest">Starting from</p>
                <p className="text-4xl font-black text-[#f72585] mt-2">₹{event.ticketPrice.toLocaleString()}</p>
                <p className="text-[10px] text-white/30 mt-1 uppercase tracking-widest">per ticket</p>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <span>🎟️</span>
                  <span>Instant Confirmation</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <span>🛡️</span>
                  <span>Secure Credit Payment</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <span>⚡</span>
                  <span>High Energy Experience</span>
                </div>
              </div>

              <Link
                to={`/booking/${event._id}`}
                className="block w-full text-center py-4 bg-[#f72585] text-white font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_0_30px_rgba(247,37,133,0.5)] transition-all duration-300 animate-glow-pulse"
              >
                Book Now
              </Link>

              <p className="text-[10px] text-white/20 text-center">Instant confirmation • Secure payment</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 max-w-sm w-full animate-fade-in-up">
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Delete Review</h3>
            <p className="text-white/60 text-sm mb-6">Are you sure you want to delete this review? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white/60 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
