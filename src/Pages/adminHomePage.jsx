import { Link, Route, Routes, useNavigate } from "react-router-dom";
import {
  BsGraphUp,
  BsPeopleFill,
  BsList,
  BsX,
  BsBoxArrowRight,
} from "react-icons/bs";
import { ImBlogger2 } from "react-icons/im";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import AdminProductsPage from "./productPage";
import AddProductForm from "./addProductForm";
import EditProductForm from "./editProductForm";
import AdminUsers from "./viewAllUsers";
import DashboardPage from "./DashBord";

export default function AdminHomePage() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.type !== "admin") {
          toast.error("Unauthorized access");
          navigate("/login");
        } else {
          setUser(res.data);
        }
      })
      .catch(() => {
        toast.error("Failed to fetch user data");
        navigate("/login");
      });
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white text-black relative">
      {/* Sidebar */}
      <div
        className={`bg-black text-white fixed top-0 left-0 z-40 transform transition-transform duration-300 ease-in-out 
        md:relative md:translate-x-0 md:w-1/5 w-3/4 max-w-xs h-full
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        h-full md:min-h-screen`}
      >
        {/* Top bar with close icon on mobile */}
        <div className="flex justify-between items-center px-4 py-3 md:hidden">
          <h2 className="text-lg font-semibold">Admin Menu</h2>
          <button onClick={() => setSidebarOpen(false)} className="text-white">
            <BsX size={24} />
          </button>
        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col items-start space-y-6 px-6 mt-6 md:mt-12">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2 hover:text-gray-300"
          >
            <BsGraphUp /> Dashboard
          </Link>
          <Link
            to="/products"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2 hover:text-gray-300"
          >
            <ImBlogger2 /> Blogs
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 mt-10 text-red-500 hover:text-red-400 focus:outline-none"
          >
            <BsBoxArrowRight /> Logout
          </button>
        </div>
      </div>

      {/* Toggle Sidebar Button (hamburger) */}
      {!sidebarOpen && (
        <button
          className="absolute top-4 left-4 md:hidden text-black z-50"
          onClick={() => setSidebarOpen(true)}
        >
          <BsList size={28} />
        </button>
      )}

      {/* Main Content */}
      <div className="w-full md:w-4/5 p-4 mt-12 md:mt-0">
        {user !== null ? (
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<AdminProductsPage />} />
            <Route path="/products/addProduct" element={<AddProductForm />} />
            <Route path="/products/editProduct" element={<EditProductForm />} />
            <Route path="/customers" element={<AdminUsers />} />
            <Route
              path="*"
              element={<h1 className="text-red-600">404 Not Found</h1>}
            />
          </Routes>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-black"></div>
          </div>
        )}
      </div>
    </div>
  );
}
