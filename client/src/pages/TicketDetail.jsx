import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyOrders, cancelTicket } from '../features/order/orderSlice';
import Loading from '../components/Loading';
import QRCode from 'react-qr-code';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';

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
  
  const event = order.event || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");

  const handleCancelClick = () => {
    const elapsedMs = Date.now() - new Date(order.createdAt).getTime();
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    const ONE_DAY = 24 * 60 * 60 * 1000;

    if (elapsedMs > SEVEN_DAYS) {
      toast.error("Cannot cancel ticket after 7 days of booking.");
      return;
    } 
    
    if (elapsedMs > ONE_DAY) {
      const fee = order.billedAmount * 0.1;
      const refund = order.billedAmount - fee;
      setCancelMessage(`You are cancelling this ticket after 24 hours of booking. A 10% cancellation fee (₹${fee}) will be deducted. You will be refunded ₹${refund} in credits. Are you sure?`);
    } else {
      setCancelMessage(`You are cancelling this ticket within 24 hours of booking. You will receive a full refund of ₹${order.billedAmount} in credits. Are you sure?`);
    }
    
    setIsModalOpen(true);
  };

  const confirmCancel = () => {
    dispatch(cancelTicket(order._id)).then((res) => {
      if(!res.error) {
        toast.success("Ticket cancelled successfully! Credits have been refunded.");
      } else {
        toast.error(res.payload || "Failed to cancel ticket");
      }
      setIsModalOpen(false);
    });
  };

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
              <img src={event?.eventImage} alt={event?.title} className="w-full h-full object-cover brightness-50" />
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
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#00f5ff] font-mono">{event?.eventArtistName}</p>
                <h1 className="text-2xl font-black text-white uppercase tracking-tight mt-1">{event?.title}</h1>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Date</p>
                  <p className="text-sm text-white font-semibold mt-1">{event?.eventDate}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Duration</p>
                  <p className="text-sm text-white font-semibold mt-1">{event?.duration}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Location</p>
                  <p className="text-sm text-white font-semibold mt-1">{event?.eventLocation}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Seats</p>
                  <p className="text-sm text-white font-semibold mt-1">{order.seats} {order.seats > 1 ? 'Tickets' : 'Ticket'}</p>
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
              <div className="relative bg-white p-3 rounded-2xl shadow-lg animate-fade-in-up animation-delay-300 flex items-center justify-center">
                <QRCode 
                  value={JSON.stringify({
                    Event: event?.title || "Unknown",
                    Date: event?.eventDate || "Unknown",
                    Seats: order.seats,
                    Status: order?.status?.toUpperCase() || "",
                    Order_ID: order?._id?.toUpperCase() || ""
                  })} 
                  size={160}
                  bgColor="#ffffff"
                  fgColor="#0a0a0a"
                  level="L"
                />
                {order.status === 'cancelled' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl backdrop-blur-[1px]">
                    <div className="border-4 border-red-600 text-red-600 font-black text-2xl uppercase tracking-widest px-3 py-1 rounded-lg -rotate-12 opacity-90 mix-blend-multiply">
                      Cancelled
                    </div>
                  </div>
                )}
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

              {order.status === 'confirmed' && (
                <button 
                  onClick={handleCancelClick}
                  className="mt-6 w-full py-3 bg-red-500/10 border border-red-500/20 text-red-500 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-red-500/20 transition-colors"
                >
                  Cancel Ticket
                </button>
              )}

              <p className="text-[10px] text-white/15 mt-6 text-center">Booked on {new Date(order.createdAt).toLocaleDateString()} • VOLT™</p>
            </div>
          </div>

          {/* Bottom notch cutouts */}
          <div className="absolute -bottom-3 left-8 w-6 h-6 bg-[#0a0a0a] rounded-full z-10" />
          <div className="absolute -bottom-3 right-8 w-6 h-6 bg-[#0a0a0a] rounded-full z-10" />
        </div>

        <Modal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmCancel}
          title="Cancel Ticket"
          message={cancelMessage}
        />

        {/* Back button */}
        <Link to="/profile" className="block text-center text-sm text-white/30 hover:text-[#f72585] transition-colors mt-8">← Back to My Tickets</Link>
      </div>
    </div>
  );
}
