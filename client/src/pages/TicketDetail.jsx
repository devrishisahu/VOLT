import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyOrders } from '../features/order/orderSlice';
import Loading from '../components/Loading';

export default function TicketDetail() {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const { orders, isLoading } = useSelector((state) => state.order);
  const order = orders.find(o => o._id === orderId);

  useEffect(() => {
    if (orders.length === 0) {
      dispatch(getMyOrders());
    }
  }, [orders, dispatch]);

  if (isLoading || !order) return <Loading />;
  
  const event = order.event;

  // Generate a mock QR-like pattern
  const qrRows = 15;
  const qrCols = 15;
  const qrPattern = Array.from({ length: qrRows }, (_, r) =>
    Array.from({ length: qrCols }, (_, c) => {
      // Fixed corners (finder patterns)
      if ((r < 3 && c < 3) || (r < 3 && c >= qrCols - 3) || (r >= qrRows - 3 && c < 3)) return true;
      // Border of finder patterns
      if ((r === 0 || r === 2) && (c < 3 || c >= qrCols - 3)) return true;
      if ((c === 0 || c === 2) && (r < 3 || r >= qrRows - 3)) return true;
      if ((r >= qrRows - 3) && (c === 0 || c === 2)) return true;
      if ((r === qrRows - 1 || r === qrRows - 3) && c < 3) return true;
      // Pseudo-random data pattern based on orderId hash
      const hash = (r * 31 + c * 17 + orderId.charCodeAt(orderId.length - 1)) % 7;
      return hash < 3;
    })
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12 md:py-20">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Ticket Container */}
        <div className="relative">
          {/* Top notch cutouts */}
          <div className="absolute -top-3 left-8 w-6 h-6 bg-[#0a0a0a] rounded-full z-10" />
          <div className="absolute -top-3 right-8 w-6 h-6 bg-[#0a0a0a] rounded-full z-10" />

          {/* Ticket Card */}
          <div className="bg-gradient-to-b from-[#1a1a1a] to-[#111111] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(247,37,133,0.1)]">

            {/* Event Image Header */}
            <div className="relative h-48 overflow-hidden">
              <img src={event.eventImage} alt={event.title} className="w-full h-full object-cover brightness-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  order.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  order.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="absolute bottom-4 left-6 right-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#00f5ff] font-mono">{event.eventArtistName}</p>
                <h1 className="text-2xl font-black text-white uppercase tracking-tight mt-1">{event.title}</h1>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Date</p>
                  <p className="text-sm text-white font-semibold mt-1">{event.eventDate}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Duration</p>
                  <p className="text-sm text-white font-semibold mt-1">{event.duration}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Location</p>
                  <p className="text-sm text-white font-semibold mt-1">{event.eventLocation}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Seats</p>
                  <p className="text-sm text-white font-semibold mt-1">{order.numberOfSeats} {order.numberOfSeats > 1 ? 'Tickets' : 'Ticket'}</p>
                </div>
              </div>
            </div>

            {/* Dashed Divider with cutouts */}
            <div className="relative flex items-center px-2">
              <div className="absolute -left-4 w-8 h-8 bg-[#0a0a0a] rounded-full" />
              <div className="flex-1 border-t-2 border-dashed border-white/10 mx-6" />
              <div className="absolute -right-4 w-8 h-8 bg-[#0a0a0a] rounded-full" />
            </div>

            {/* QR Code & Bottom */}
            <div className="px-6 py-6 flex flex-col items-center">
              {/* QR Code */}
              <div className="bg-white p-3 rounded-2xl shadow-lg animate-fade-in-up animation-delay-300">
                <div className="grid gap-[1px]" style={{ gridTemplateColumns: `repeat(${qrCols}, 1fr)` }}>
                  {qrPattern.flat().map((filled, idx) => (
                    <div key={idx} className={`w-[10px] h-[10px] rounded-[1px] ${filled ? 'bg-[#0a0a0a]' : 'bg-white'}`} />
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mt-4 font-mono">Scan for Verification</p>

              {/* Order Info */}
              <div className="mt-5 w-full bg-white/5 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Order ID</p>
                  <p className="text-sm text-white font-mono font-bold mt-0.5">{order._id.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Amount Paid</p>
                  <p className="text-lg text-[#f72585] font-black mt-0.5">₹{order.billedAmount.toLocaleString()}</p>
                </div>
              </div>

              {order.isDiscounted && (
                <div className="mt-3 flex items-center gap-2 text-green-400 text-xs">
                  <span>✨</span>
                  <span>Discount applied on this booking</span>
                </div>
              )}

              <p className="text-[10px] text-white/15 mt-6 text-center">Booked on {new Date(order.createdAt).toLocaleDateString()} • VOLT™</p>
            </div>
          </div>

          {/* Bottom notch cutouts */}
          <div className="absolute -bottom-3 left-8 w-6 h-6 bg-[#0a0a0a] rounded-full z-10" />
          <div className="absolute -bottom-3 right-8 w-6 h-6 bg-[#0a0a0a] rounded-full z-10" />
        </div>

        {/* Back button */}
        <Link to="/profile" className="block text-center text-sm text-white/30 hover:text-[#f72585] transition-colors mt-8">← Back to My Tickets</Link>
      </div>
    </div>
  );
}
