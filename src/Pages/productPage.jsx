import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!productsLoaded) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/products")
        .then((res) => {
          setProducts(res.data.products); // ✅ extract only the array
          setProductsLoaded(true);
        })
        .catch((err) => {
          toast.error("Failed to fetch products");
          console.error(err);
        });
    }
  }, [productsLoaded]);

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");

    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("Are you sure you want to delete this post?");
        toast.success("Post deleted successfully");
        setProductsLoaded(false); // trigger refetch
      })
      .catch((err) => {
        toast.error("Delete failed");
        console.error(err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Add Blog Button */}
      <div className="flex justify-end mb-4">
        <Link
          to="/products/addProduct"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
        >
          + Add Blog
        </Link>
      </div>

      {/* Main Card */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-4 md:p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">All Blog Posts</h1>

        {productsLoaded ? (
          products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm">
                <thead>
  <tr className="bg-gray-100">
    <th className="text-left px-4 py-3 border-b">Image</th> {/* 🆕 */}
    <th className="text-left px-4 py-3 border-b">Date & Time</th>
    <th className="text-left px-4 py-3 border-b">Event Name</th>
    <th className="text-left px-4 py-3 border-b">Description</th>
    <th className="text-center px-4 py-3 border-b">Action</th>
  </tr>
</thead>
<tbody>
  {products.map((product, index) => (
    <tr
      key={product._id}
      className={`hover:bg-gray-50 ${
        index % 2 === 0 ? "bg-gray-50" : "bg-white"
      }`}
    >
      {/* 🖼️ Image preview */}
      <td className="px-4 py-3 border-b">
        {product.Images && product.Images.length > 0 ? (
          <img
            src={product.Images[0]?.url}
            alt="Preview"
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <span className="text-gray-400 italic">No Image</span>
        )}
      </td>

      <td className="px-4 py-3 border-b">{product.dateTime}</td>
      <td className="px-4 py-3 border-b">{product.postName}</td>
      <td className="px-4 py-3 border-b max-w-xs truncate">
        {product.description}
      </td>
      <td className="px-4 py-3 border-b text-center">
        <button
          className="text-red-500 hover:text-red-700 mr-3"
          title="Delete"
          onClick={() => handleDelete(product._id)}
        >
          <FaTrash />
        </button>
        <button
          className="text-blue-500 hover:text-blue-700"
          title="Edit"
          onClick={() =>
            navigate("/products/editProduct", {
              state: { product: product },
            })
          }
        >
          <FaPencil />
        </button>
      </td>
    </tr>
  ))}
</tbody>


              </table>
            </div>
          ) : (
            <p className="text-gray-600 text-center">No products found.</p>
          )
        ) : (
          <div className="w-full h-40 flex justify-center items-center">
            <div className="w-[60px] h-[60px] border-[4px] border-gray-200 border-b-blue-500 animate-spin rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}
