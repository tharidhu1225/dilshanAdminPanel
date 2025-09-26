import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalBlogs: 0,
    totalUsers: 0,
    recentProducts: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Get products (blogs)
        const productsRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Get users
        const usersRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const products = productsRes.data.products || [];
        const users = usersRes.data.users || [];

        setStats({
          totalProducts: products.length,
          totalBlogs: products.length, // assuming products = blogs
          totalUsers: users.length,
          recentProducts: products.slice(-5).reverse(), // last 5 products, newest first
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch dashboard data");
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Blogs */}
        <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
          <div className="bg-green-600 text-white p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12l9-5-9-5-9 5 9 5z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-500">Total Blogs</p>
            <p className="text-2xl font-semibold">{stats.totalBlogs}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Blogs</h2>

        {stats.recentProducts.length > 0 ? (
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentProducts.map((prod) => (
                <tr key={prod._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{prod.postName}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {prod.description.length > 70
                      ? prod.description.substring(0, 70) + "..."
                      : prod.description}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(prod.dateTime).toLocaleDateString()}{" "}
                    {new Date(prod.dateTime).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No recent products found.</p>
        )}
      </div>
    </div>
  );
}
