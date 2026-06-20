import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { useEffect } from "react";

export default function Register() {
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth,
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const { name, email, phone, password } = formData;

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  useEffect(() => {
    if (user) {
      navigate(user.isAdmin ? "/admin" : "/profile");
    }

    if (isError && message) {
      toast.error(message, { position: "top-center", theme: "dark" });
    }
  }, [user, isError, message]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Left - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200"
          alt=""
          className="absolute inset-0 w-full h-full object-cover brightness-[0.3]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]" />

        <div className="absolute top-0 left-1/4 w-28 h-full bg-gradient-to-b from-[#00f5ff]/8 to-transparent rotate-6 animate-spotlight" />
        <div
          className="absolute top-0 right-1/3 w-20 h-full bg-gradient-to-b from-[#f72585]/6 to-transparent -rotate-12 animate-spotlight"
          style={{ animationDelay: "3s" }}
        />

        <div className="relative z-10 px-12">
          <h2 className="text-5xl font-black uppercase tracking-tighter text-white leading-none animate-fade-in-up">
            Join The
            <br />
            <span className="bg-gradient-to-r from-[#f72585] to-[#00f5ff] bg-clip-text text-transparent">
              Revolution
            </span>
          </h2>
          <p className="text-white/40 mt-4 max-w-sm animate-fade-in-up animation-delay-200">
            Create your VOLT account and unlock access to the world's most
            electrifying events.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10">
            <Link
              to="/"
              className="text-3xl font-black bg-gradient-to-r from-[#f72585] to-[#00f5ff] bg-clip-text text-transparent"
            >
              VOLT
            </Link>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mt-4">
              Create Account
            </h2>
          </div>

          <div className="hidden lg:block mb-10">
            <Link
              to="/"
              className="text-2xl font-black bg-gradient-to-r from-[#f72585] to-[#00f5ff] bg-clip-text text-transparent"
            >
              VOLT
            </Link>
            <p className="text-white/40 mt-2">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label htmlFor="reg-name" className="block text-xs text-white/40 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                id="reg-name"
                name="name"
                value={name}
                onChange={handleChange}
                type="text"
                placeholder="John Doe"
                autoComplete="off"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:border-[#f72585]/50 transition-colors"
                style={{ outline: 'none' }}
              />
            </div>
            <div>
              <label htmlFor="reg-email" className="block text-xs text-white/40 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                id="reg-email"
                name="email"
                value={email}
                onChange={handleChange}
                type="email"
                placeholder="your@email.com"
                autoComplete="off"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:border-[#f72585]/50 transition-colors"
                style={{ outline: 'none' }}
              />
            </div>
            <div>
              <label htmlFor="reg-phone" className="block text-xs text-white/40 uppercase tracking-wider mb-2">
                Phone
              </label>
              <input
                id="reg-phone"
                name="phone"
                value={phone}
                onChange={handleChange}
                type="tel"
                placeholder="+91 98765 43210"
                autoComplete="off"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:border-[#f72585]/50 transition-colors"
                style={{ outline: 'none' }}
              />
            </div>
            <div>
              <label htmlFor="reg-password" className="block text-xs text-white/40 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                id="reg-password"
                name="password"
                value={password}
                onChange={handleChange}
                type="password"
                placeholder="Enter your password"
                autoComplete="new-password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 focus:border-[#f72585]/50 transition-colors"
                style={{ outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#f72585] text-white font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_0_30px_rgba(247,37,133,0.5)] transition-all duration-300 text-lg mt-2"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-white/30 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#f72585] hover:underline font-semibold"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
