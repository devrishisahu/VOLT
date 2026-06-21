import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents } from '../features/event/eventSlice';
import { bookTicket, verifyCoupon, removeCoupon, reset } from '../features/order/orderSlice';
import { syncUser } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

const steps = ['Select Seats', 'Apply Coupon', 'Confirm'];

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { events } = useSelector((state) => state.event);
  const { isLoading, isSuccess, isError, message, appliedCoupon } = useSelector((state) => state.order);
  const event = events.find(e => e._id === id);

  const handleApplyCoupon = () => {
    if (couponCode) {
      dispatch(verifyCoupon(couponCode)).then(res => {
        if (res.error) {
          toast.error(res.payload);
        } else {
          toast.success(`Coupon Applied! ${res.payload.couponDiscount}% Off`);
        }
      });
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (events.length === 0) {
      dispatch(getEvents());
    }
  }, [events, dispatch]);

  const handleBooking = () => {
    dispatch(bookTicket({ 
      eventId: id, 
      bookingData: { 
        numberOfSeats, 
        couponCode: appliedCoupon ? appliedCoupon.couponCode : '' 
      } 
    })).then((res) => {
      if (!res.error) {
        toast.success("Ticket Booked Successfully!");
        setShowConfirmModal(false);
        dispatch(syncUser());
        navigate(`/ticket/${res.payload._id}`);
      } else {
        toast.error(res.payload);
      }
    });
  };

  if (!user) return null;
  if (!event) return <Loading />;

  const currentStep = 2; // hardcoded to show confirm step

  const subtotal = event.ticketPrice * numberOfSeats;
  const discount = appliedCoupon ? (subtotal * appliedCoupon.couponDiscount) / 100 : 0;
  const total = subtotal - discount;
  const remainingCredits = user.credits - total;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-start justify-center pt-10 md:pt-20 px-4 pb-24">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter bg-gradient-to-r from-[#f72585] to-[#00f5ff] bg-clip-text text-transparent animate-fade-in-up">Checkout</h1>
          <p className="text-white/40 mt-2 animate-fade-in-up animation-delay-200">Complete your booking</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-0 mb-12 animate-fade-in-up animation-delay-400">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${i <= currentStep
                  ? 'bg-[#f72585] text-white shadow-[0_0_20px_rgba(247,37,133,0.4)]'
                  : 'bg-white/5 text-white/30 border border-white/10'
                  }`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] uppercase tracking-wider mt-2 ${i <= currentStep ? 'text-[#f72585]' : 'text-white/30'}`}>{step}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-16 md:w-24 h-0.5 mx-2 mb-5 ${i < currentStep ? 'bg-[#f72585]' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Event Summary & Seats */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 mb-6 animate-slide-in-right">
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Event Summary</h2>
          <div className="flex gap-4">
            <img src={event.eventImage} alt={event.title} className="w-20 h-20 rounded-xl object-cover brightness-75 shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">{event.title}</h3>
              <p className="text-sm text-[#00f5ff]">{event.eventArtistName}</p>
              <p className="text-xs text-white/40 mt-1">{event.eventDate} • {event.eventLocation}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm text-white/40">Number of Seats</span>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setNumberOfSeats(Math.max(1, numberOfSeats - 1))}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-all"
              >
                −
              </button>
              <span className="text-xl font-bold text-white w-8 text-center">{numberOfSeats}</span>
              <button 
                onClick={() => setNumberOfSeats(Math.min(5, numberOfSeats + 1))}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-all"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: Coupon */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 mb-6 animate-slide-in-right animation-delay-200">
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Apply Coupon</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={appliedCoupon ? appliedCoupon.couponCode : couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              disabled={!!appliedCoupon}
              placeholder="Enter coupon code"
              className={`flex-1 bg-white/5 border rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors ${appliedCoupon ? 'border-green-500/50 text-green-400' : 'border-white/10 focus:border-[#f72585]/50'}`}
            />
            {appliedCoupon ? (
              <button 
                onClick={() => { dispatch(removeCoupon()); setCouponCode(''); }}
                className="px-4 py-3 bg-red-500/10 text-red-500 text-sm font-bold rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-all"
              >
                Remove
              </button>
            ) : (
              <button 
                onClick={handleApplyCoupon}
                className="px-4 py-3 bg-[#f72585]/10 text-[#f72585] text-sm font-bold rounded-lg border border-[#f72585]/20 hover:bg-[#f72585]/20 transition-all"
              >
                Apply
              </button>
            )}
          </div>
          <p className="text-[10px] text-white/20 mt-3 italic">Coupons are applied automatically if valid during confirmation.</p>
        </div>

        {/* Step 3: Order Summary */}
        <div className="bg-white/5 backdrop-blur border border-[#f72585]/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(247,37,133,0.1)] animate-slide-in-right animation-delay-400">
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Event</span>
              <span className="text-white font-medium">{event.title}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Seats</span>
              <span className="text-white">{numberOfSeats}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Price per seat</span>
              <span className="text-white">₹{event.ticketPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Subtotal</span>
              <span className={`text-white ${appliedCoupon ? 'line-through opacity-30' : ''}`}>
                ₹{(event.ticketPrice * numberOfSeats).toLocaleString()}
              </span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-sm text-green-400">
                <span>Discount ({appliedCoupon.couponDiscount}%)</span>
                <span>-₹{((event.ticketPrice * numberOfSeats * appliedCoupon.couponDiscount) / 100).toLocaleString()}</span>
              </div>
            )}
            <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold">
              <span className="text-white">Total</span>
              <span className="text-[#f72585]">
                ₹{(
                  (event.ticketPrice * numberOfSeats) - 
                  (appliedCoupon ? (event.ticketPrice * numberOfSeats * appliedCoupon.couponDiscount) / 100 : 0)
                ).toLocaleString()}
              </span>
            </div>
          </div>

          <button 
            onClick={() => setShowConfirmModal(true)}
            disabled={isLoading}
            className="mt-6 w-full py-4 bg-[#f72585] text-white font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_0_30px_rgba(247,37,133,0.5)] transition-all duration-300 animate-glow-pulse text-lg block text-center disabled:opacity-50"
          >
            Confirm Booking
          </button>
          <p className="text-[10px] text-white/20 text-center mt-3 uppercase tracking-widest italic">Credits will be deducted from your wallet</p>
        </div>

        <Link to="/events" className="block text-center text-sm text-white/30 hover:text-[#f72585] transition-colors mt-8">← Back to Events</Link>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111] border border-[#f72585]/30 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(247,37,133,0.15)]">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-black uppercase text-white tracking-tight">Confirm Booking</h2>
              <p className="text-sm text-white/40 mt-1">Review your ticket details before purchasing</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                <span className="text-sm text-white/50 uppercase tracking-widest">Event</span>
                <span className="text-sm font-bold text-white text-right">{event.title}</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                <span className="text-sm text-white/50 uppercase tracking-widest">Seats</span>
                <span className="text-sm font-bold text-white">{numberOfSeats}</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                <span className="text-sm text-white/50 uppercase tracking-widest">Total Cost</span>
                <span className="text-sm font-bold text-[#f72585]">₹{total.toLocaleString()}</span>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/50">Current Credits</span>
                  <span className="text-sm text-white">₹{Number(user.credits).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/50">Remaining Credits</span>
                  <span className={`text-sm font-bold ${remainingCredits < 0 ? 'text-red-500' : 'text-[#00f5ff]'}`}>
                    ₹{remainingCredits.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
                {remainingCredits < 0 && (
                  <p className="text-xs text-red-500 mt-4 text-center bg-red-500/10 py-2.5 rounded-lg border border-red-500/20">Insufficient credits to complete this booking.</p>
                )}
              </div>
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3.5 bg-white/5 text-white/60 font-bold uppercase tracking-wider rounded-xl hover:bg-white/10 hover:text-white transition-all text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleBooking}
                disabled={isLoading || remainingCredits < 0}
                className="flex-1 py-3.5 bg-[#f72585] text-white font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_0_30px_rgba(247,37,133,0.4)] transition-all text-sm disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Book Ticket'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
