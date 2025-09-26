import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const googleRegister = useGoogleLogin({
    onSuccess: (res) => {
      setLoading(true);
      axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/google", {
        token: res.access_token
      }).then((res) => {
        if (res.data.message === "User created") {
          toast.success("Your account is created successfully!");
          setTimeout(() => {
            window.location.href = "/login";
          }, 1500);
        } else {
          toast.error(res.data.message || "Registration failed");
        }
      }).catch(() => {
        toast.error("Google registration failed");
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
          Register at <span className="text-gray-600">Dhanuka Dilshan Photography</span>
        </h1>
        <p className="text-center text-gray-700">Create your account with Google</p>

        <button
          onClick={() => googleRegister()}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full py-3 border border-gray-300 rounded-full hover:shadow-lg transition duration-300 bg-white"
        >
          <FcGoogle size={24} />
          <span className="text-gray-700 font-semibold">
            {loading ? "Please wait..." : "Register with Google"}
          </span>
        </button>

        <p className="text-gray-600 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 underline hover:text-blue-800">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
