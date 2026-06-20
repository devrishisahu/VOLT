import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loginUser, registerUser } from "../features/auth/authSlice";

export default function Login() {
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth,
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
    dispatch(loginUser(formData));
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
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200"
          alt=""
          className="absolute inset-0 w-full h-full object-cover brightness-[0.3]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]" />

        {/* Spotlight effects */}
        <div className="absolute top-0 left-1/3 w-32 h-full bg-gradient-to-b from-[#f72585]/8 to-transparent rotate-12 animate-spotlight" />
        <div
          className="absolute top-0 right-1/4 w-24 h-full bg-gradient-to-b from-[#00f5ff]/6 to-transparent -rotate-6 animate-spotlight"
          style={{ animationDelay: "4s" }}
        />

        <div className="relative z-10 px-12">
          <h2 className="text-5xl font-black uppercase tracking-tighter text-white leading-none animate-fade-in-up">
            Welcome
            <br />
            <span className="bg-gradient-to-r from-[#f72585] to-[#00f5ff] bg-clip-text text-transparent">
              Back
            </span>
          </h2>
          <p className="text-white/40 mt-4 max-w-sm animate-fade-in-up animation-delay-200">
            Your next electrifying experience awaits. Sign in to access your
            tickets and discover new shows.
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
              Welcome Back
            </h2>
          </div>

          <div className="hidden lg:block mb-10">
            <Link
              to="/"
              className="text-2xl font-black bg-gradient-to-r from-[#f72585] to-[#00f5ff] bg-clip-text text-transparent"
            >
              VOLT
            </Link>
            <p className="text-white/40 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div>
              <label htmlFor="login-email" className="block text-xs text-white/40 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                id="login-email"
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
              <label htmlFor="login-password" className="block text-xs text-white/40 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                id="login-password"
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
            <button type="submit" className="w-full py-4 bg-[#f72585] text-white font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_0_30px_rgba(247,37,133,0.5)] transition-all duration-300 text-lg">
              Login
            </button>
          </form>

          <p className="text-center text-sm text-white/30 mt-8">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-[#f72585] hover:underline font-semibold"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
