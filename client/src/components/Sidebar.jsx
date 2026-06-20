import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../features/auth/authSlice";

export default function Sidebar() {

  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth);

  const location = useLocation();

  let allNavItems = [
    { path: "/", label: "Home", icon: "⌂" },
    { path: "/events", label: "Events", icon: "🎫" },
    { path: "/voltbot", label: "VoltBot", icon: "🤖" },
    { path: "/submit-event", label: "Submit Event", icon: "✦" },
    { path: "/wallet", label: "Wallet", icon: "💳" },
    { path: "/profile", label: "Profile", icon: "◉" },
  ];

  const navItems = !user 
    ? allNavItems.slice(0, 3) 
    : allNavItems.map(item => 
        item.path === '/profile' && user.isAdmin 
          ? { path: "/admin", label: "Admin Panel", icon: "⚙️" } 
          : item
      );

  const handleLogout = () => {
    dispatch(logoutUser())
  }


  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-16 hover:w-56 bg-[#0a0a0a] border-r border-white/10 flex-col z-50 transition-all duration-300 group/sidebar overflow-hidden">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 px-4 h-16 border-b border-white/10 shrink-0"
        >
          <span className="text-2xl font-black bg-gradient-to-r from-[#f72585] to-[#00f5ff] bg-clip-text text-transparent">
            V
          </span>
          <span className="text-lg font-black text-white opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            VOLT
          </span>
        </Link>

        {/* Nav Items */}
        <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-[#f72585]/10 text-[#f72585] border-l-2 border-[#f72585]"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-lg w-8 text-center shrink-0">
                  {item.icon}
                </span>
                <span className="text-sm font-medium opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Login/Register CTA */}
        <div className="border-t border-white/10 p-3">
          {user ? (
            <button onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-rose-700 hover:bg-rose-900 rounded-lg text-white text-sm font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(247,37,133,0.4)] transition-all">
              <span className="shrink-0">⚡</span>
              <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Logout
              </span>
            </button>
          ) : (
            <>
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#f72585] rounded-lg text-white text-sm font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(247,37,133,0.4)] transition-all"
              >
                <span className="shrink-0">⚡</span>
                <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Get Started
                </span>
              </Link>
            </>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-white/10 z-50 flex justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all duration-200 ${
                isActive ? "text-[#f72585]" : "text-white/40"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
