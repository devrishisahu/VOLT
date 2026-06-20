import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { requestCredits } from '../features/credits/creditSlice';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

const transactions = [
  { id: 1, type: 'Credit Added', amount: '+200', date: '2025-05-01', desc: 'Welcome bonus' },
  { id: 2, type: 'Redeemed', amount: '-100', date: '2025-05-05', desc: 'Cyber Punk Symphony booking' },
  { id: 3, type: 'Credit Added', amount: '+300', date: '2025-05-10', desc: 'Referral reward' },
  { id: 4, type: 'Redeemed', amount: '-50', date: '2025-05-15', desc: 'Midnight Rave booking' },
  { id: 5, type: 'Credit Added', amount: '+150', date: '2025-05-20', desc: 'Cashback offer' },
];

export default function Wallet() {
  const [showRequest, setShowRequest] = useState(false);
  const [amount, setAmount] = useState('');
  
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { isLoading } = useSelector(state => state.credits);

  const handleRequest = (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return toast.error("Please enter a valid amount");
    
    dispatch(requestCredits(amount)).then((res) => {
      if (!res.error) {
        toast.success("Request sent to Admin!");
        setShowRequest(false);
        setAmount('');
      }
    });
  };

  if (!user) return null;
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="px-6 md:px-16 pt-10 md:pt-16 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Credits Balance Card */}
          <div className="relative bg-gradient-to-br from-[#f72585]/20 to-[#00f5ff]/10 border border-[#f72585]/20 rounded-3xl p-10 text-center overflow-hidden animate-fade-in-up">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-[#f72585]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#00f5ff]/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono">Volt Credits</p>
              <p className="text-6xl md:text-8xl font-black text-[#f72585] mt-4 animate-fade-in-up animation-delay-200">{user.credits}</p>
              <p className="text-white/30 mt-2">Available balance</p>
              <button 
                onClick={() => setShowRequest(true)}
                className="mt-6 px-8 py-3 bg-[#f72585] text-white font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_0_30px_rgba(247,37,133,0.5)] transition-all duration-300"
              >
                Add Credits
              </button>
            </div>

            {/* Request Modal */}
            {showRequest && (
              <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-[#0a0a0a]/90 backdrop-blur-md animate-fade-in">
                <div className="w-full max-w-sm">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">Request Credits</h3>
                  <form onSubmit={handleRequest} className="space-y-4">
                    <input 
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount (e.g. 500)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#f72585]/50"
                      required
                    />
                    <div className="flex gap-2">
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="flex-1 py-3 bg-[#f72585] text-white font-bold rounded-xl text-sm uppercase tracking-widest disabled:opacity-50"
                      >
                        {isLoading ? 'Sending...' : 'Send Request'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowRequest(false)}
                        className="flex-1 py-3 bg-white/5 text-white/40 font-bold rounded-xl text-sm uppercase tracking-widest"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* How Credits Work */}
          <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-6 animate-fade-in-up animation-delay-200">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight mb-4">How Credits Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: '🎫', title: 'Book Events', desc: 'Use credits to get discounts on event bookings' },
                { icon: '🎁', title: 'Earn Rewards', desc: 'Get credits through referrals and promotions' },
                { icon: '💸', title: 'Save More', desc: '1 credit = ₹1 discount on any booking' },
              ].map((item) => (
                <div key={item.title} className="bg-white/5 rounded-xl p-4 text-center">
                  <span className="text-2xl">{item.icon}</span>
                  <h3 className="text-sm font-semibold text-white mt-2">{item.title}</h3>
                  <p className="text-xs text-white/40 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction History */}
          <div className="mt-10 animate-fade-in-up animation-delay-400">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-6">Transaction History</h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-3 border-b border-white/10 text-xs text-white/30 uppercase tracking-wider">
                <span>Type</span>
                <span>Description</span>
                <span>Date</span>
                <span className="text-right">Amount</span>
              </div>
              {/* Rows */}
              {transactions.map((tx, i) => (
                <div key={tx.id} className={`grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 px-6 py-4 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''} border-b border-white/5 last:border-b-0`}>
                  <div>
                    <span className={`text-sm font-semibold ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{tx.type}</span>
                  </div>
                  <div>
                    <span className="text-sm text-white/50">{tx.desc}</span>
                  </div>
                  <div>
                    <span className="text-sm text-white/30">{tx.date}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{tx.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
