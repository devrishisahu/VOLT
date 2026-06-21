import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from '../features/auth/authSlice';

export default function Navbar() {

  const dispatch = useDispatch()

  const {user} = useSelector(state => state.auth)

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    dispatch(logoutUser());
    setShowLogoutModal(false);
    window.location.href = '/';
  }
  
  return (
    <>
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-lg border-b border-white/10">
      <div className="flex items-center justify-between px-4 h-14">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-black bg-gradient-to-r from-[#f72585] to-[#00f5ff] bg-clip-text text-transparent">VOLT</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/events" className="text-white/60 hover:text-white text-sm transition-colors">Events</Link>
         {
          user ? ( <button onClick={() => setShowLogoutModal(true)} className="text-xs px-3 py-1.5 rounded-full bg-rose-600 text-white font-semibold hover:shadow-[0_0_20px_rgba(247,37,133,0.4)] transition-all"> Logout</button>) : (
             <Link to="/login" className="text-xs px-3 py-1.5 rounded-full bg-[#f72585] text-white font-semibold hover:shadow-[0_0_20px_rgba(247,37,133,0.4)] transition-all">Get Started</Link>
          )
         }
        </div>
      </div>
    </header>
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111] border border-rose-500/30 rounded-2xl w-full max-w-sm overflow-hidden shadow-[0_0_50px_rgba(225,29,72,0.15)]">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20 text-rose-500 text-3xl">
                👋
              </div>
              <h2 className="text-xl font-black uppercase text-white tracking-tight">Leaving so soon?</h2>
              <p className="text-sm text-white/40 mt-2">Are you sure you want to log out of your VOLT account?</p>
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3.5 bg-white/5 text-white/60 font-bold uppercase tracking-wider rounded-xl hover:bg-white/10 hover:text-white transition-all text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 py-3.5 bg-rose-600 text-white font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_0_30px_rgba(225,29,72,0.4)] transition-all text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
