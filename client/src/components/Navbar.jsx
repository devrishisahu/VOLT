import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from '../features/auth/authSlice';

export default function Navbar() {

  const dispatch = useDispatch()

  const {user} = useSelector(state => state.auth)

  const handleLogout =() =>{
    dispatch(logoutUser())
  }
  
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-lg border-b border-white/10">
      <div className="flex items-center justify-between px-4 h-14">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-black bg-gradient-to-r from-[#f72585] to-[#00f5ff] bg-clip-text text-transparent">VOLT</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/events" className="text-white/60 hover:text-white text-sm transition-colors">Events</Link>
         {
          user ? ( <button onClick={handleLogout} className="text-xs px-3 py-1.5 rounded-full bg-rose-600 text-white font-semibold hover:shadow-[0_0_20px_rgba(247,37,133,0.4)] transition-all"> Logout</button>) : (
             <Link to="/register" className="text-xs px-3 py-1.5 rounded-full bg-[#f72585] text-white font-semibold hover:shadow-[0_0_20px_rgba(247,37,133,0.4)] transition-all">Get Started</Link>
          )
         }
        </div>
      </div>
    </header>
  );
}
