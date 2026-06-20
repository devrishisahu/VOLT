import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEvents } from '../features/event/eventSlice';
import { bookTicket, verifyCoupon, reset } from '../features/order/orderSlice';
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

  useEffect(() => {
    if (events.length === 0) {
      dispatch(getEvents());
    }
  }, [events, dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
    if (isSuccess) {
      toast.success("Ticket Booked Successfully!");
      dispatch(reset());
      navigate('/profile');
    }
  }, [isError, isSuccess, message, navigate, dispatch]);

  const handleBooking = () => {
    dispatch(bookTicket({ 
      eventId: id, 
      bookingData: { numberOfSeats, couponCode } 
    }));
  };

  if (!user) return null;
  if (!event) return <Loading />;

  const currentStep = 2; // hardcoded to show confirm step

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
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#f72585]/50"
            />
            <button 
              onClick={handleApplyCoupon}
              className="px-4 py-3 bg-[#f72585]/10 text-[#f72585] text-sm font-bold rounded-lg border border-[#f72585]/20 hover:bg-[#f72585]/20 transition-all"
            >
              Apply
            </button>
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
            onClick={handleBooking}
            disabled={isLoading}
            className="mt-6 w-full py-4 bg-[#f72585] text-white font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_0_30px_rgba(247,37,133,0.5)] transition-all duration-300 animate-glow-pulse text-lg block text-center disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Confirm Booking'}
          </button>
          <p className="text-[10px] text-white/20 text-center mt-3 uppercase tracking-widest italic">Credits will be deducted from your wallet</p>
        </div>

        <Link to="/events" className="block text-center text-sm text-white/30 hover:text-[#f72585] transition-colors mt-8">← Back to Events</Link>
      </div>
    </div>
  );
}
