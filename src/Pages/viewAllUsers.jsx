import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">
        User Management
      </h1>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border p-2 sm:p-3">Profile</th>
              <th className="border p-2 sm:p-3">Name</th>
              <th className="border p-2 sm:p-3">Email</th>
              <th className="border p-2 sm:p-3">Role</th>
              <th className="border p-2 sm:p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="border p-2 sm:p-3 flex items-center justify-center sm:justify-start">
                  <img
                    src={user.profilePicture || "/default-profile.png"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => { e.target.src = "/default-profile.png"; }}
                  />
                </td>
                <td className="border p-2 sm:p-3 whitespace-nowrap">
                  {user.firstName} {user.lastName}
                </td>
                <td className="border p-2 sm:p-3 break-words max-w-xs">
                  {user.email}
                </td>
                <td className="border p-2 sm:p-3 capitalize whitespace-nowrap">
                  {user.type}
                </td>
                <td className="border p-2 sm:p-3 whitespace-nowrap">
                  {user.isBlocked ? (
                    <span className="text-red-600 font-semibold">Blocked</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}
