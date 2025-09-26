import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: (res) => {
      setLoading(true);
      axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/google", {
        token: res.access_token
      }).then((res) => {
        if (res.data.message === "User created") {
          toast.success("Your account is created, now you can login via Google.");
        } else {
          localStorage.setItem("token", res.data.token);
          if (res.data.user.type === "admin") {
            window.location.href = "/";
          } else {
            window.location.href = "/";
          }
        }
      }).catch(() => {
        toast.error("Google login failed");
      }).finally(() => {
        setLoading(false);
      });
    }
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: 'url(https://4kwallpapers.com/images/wallpapers/glossy-abstract-3840x2160-9602.jpg)' }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-90 rounded-3xl p-10 shadow-xl flex flex-col items-center space-y-8 group-hover:opacity-100">
        <img src="/logo.jpg" alt="Logo" className="w-full h-full hover:scale-110 transition-all" />
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Welcome to <span className="text-gray-600">Dhanuka Dilshan Photography</span>
        </h1>
        <p className="text-center text-gray-700">Login with your Google account to continue</p>

        <button
          onClick={() => googleLogin()}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full py-3 border border-gray-300 rounded-full hover:shadow-lg transition duration-300 bg-white"
        >
          <FcGoogle size={24} />
          <span className="text-gray-700 font-semibold">
            {loading ? "Please wait..." : "Login with Google"}
          </span>
        </button>

        <p className="text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 underline hover:text-blue-800">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
