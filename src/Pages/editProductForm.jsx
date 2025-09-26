import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditProductForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  if (!product) {
    navigate("/admin/products");
    return null;
  }

  const [productId] = useState(product.productId);
  const [postName, setProductName] = useState(product.postName);
  const [imageFiles, setImageFiles] = useState([]);
  const [description, setDescription] = useState(product.description);
  const [fbLink, setFbLink] = useState(product.fbLink);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      let updatedImages = product.Images;

      // ✅ Upload new images if selected
      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((file) => formData.append("images", file));

        const uploadRes = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/uploadImages`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (uploadRes.data.success) {
          updatedImages = uploadRes.data.images; // 👈 [{url, public_id}]
        } else {
          toast.error("Image upload failed");
          setIsSubmitting(false);
          return;
        }
      }

      // 🔁 Update the product
      const token = localStorage.getItem("token");

      const updateRes = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${product._id}`,
        {
          postName,
          description,
          fbLink,
          Images: updatedImages,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (updateRes.data.success) {
        toast.success("Post updated successfully!");
        navigate("/products");
      } else {
        toast.error(updateRes.data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg bg-white p-6 sm:p-10 rounded-xl shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-6">
          Edit Post Form
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Post ID */}
          <div>
            <label className="text-gray-700 text-sm font-medium mb-1">Post ID</label>
            <input
              disabled
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 bg-gray-100"
              value={productId}
            />
          </div>

          {/* Event Name */}
          <div>
            <label className="text-gray-700 text-sm font-medium mb-1">Event Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={postName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          {/* Facebook Link */}
          <div>
            <label className="text-gray-700 text-sm font-medium mb-1">Facebook Link</label>
            <input
              type="url"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={fbLink}
              onChange={(e) => setFbLink(e.target.value)}
            />
          </div>

          {/* Upload Images */}
          {/* Image Upload */}
<div className="flex flex-col">
  <label className="text-gray-700 text-lg font-medium mb-2">Upload Images</label>

  {/* Upload Area */}
  <div
    className="w-full border-2 border-dashed border-blue-400 rounded-xl p-6 flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 transition-all cursor-pointer"
    onClick={() => document.getElementById("imageUpload").click()}
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);
      setImageFiles((prev) => [...prev, ...droppedFiles]);
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-blue-500 mb-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
    <p className="text-gray-600 font-medium">Click or drag & drop to upload</p>
    <p className="text-sm text-gray-400 mt-1">Accepted formats: JPG, PNG, WEBP</p>
  </div>

  {/* Hidden File Input */}
  <input
    type="file"
    id="imageUpload"
    multiple
    accept="image/*"
    hidden
    onChange={(e) => {
      const files = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...files]);
    }}
  />

  {/* Preview Gallery */}
  {imageFiles.length > 0 && (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {imageFiles.map((file, index) => (
        <div key={index} className="relative group shadow rounded-lg overflow-hidden">
          <img
            src={URL.createObjectURL(file)}
            alt={`preview-${index}`}
            className="w-full h-32 object-cover"
          />
          <button
            type="button"
            className="absolute top-1 right-1 bg-white text-red-600 rounded-full w-6 h-6 flex items-center justify-center shadow group-hover:scale-110 transition transform"
            onClick={() => {
              const newFiles = [...imageFiles];
              newFiles.splice(index, 1);
              setImageFiles(newFiles);
            }}
            title="Remove"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  )}

  {/* Clear All Images */}
  {imageFiles.length > 0 && (
    <div className="flex justify-end mt-2">
      <button
        type="button"
        className="text-red-500 hover:underline text-sm font-medium"
        onClick={() => setImageFiles([])}
      >
        Clear all
      </button>
    </div>
  )}
</div>


          {/* Description */}
          <div>
            <label className="text-gray-700 text-sm font-medium mb-1">Description</label>
            <textarea
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
