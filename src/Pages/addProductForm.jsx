import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddProductForm() {
  const [postName, setPostName] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [fbLink, setFbLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!postName || !description || !fbLink || imageFiles.length === 0) {
    toast.error("Please fill all fields and upload at least one image");
    return;
  }

  setIsSubmitting(true);

  try {
    // 🔼 Step 1: Upload Images to backend (Cloudinary)
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

    if (!uploadRes.data.success) {
      toast.error("Image upload failed");
      setIsSubmitting(false);
      return;
    }

    const uploadedImages = uploadRes.data.images;

    // 🔼 Step 2: Create Product with uploaded image URLs + public_ids
    const createRes = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/create`,
      {
        postName,
        description,
        fbLink,
        Images: uploadedImages, // ✅ Include this!
      }
    );

    if (createRes.data.success) {
      toast.success("Post created successfully!");
      navigate("/products");
    } else {
      toast.error("Failed to create post");
    }

  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-6 md:p-10 rounded-xl shadow-lg"
      >
        <h1 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-6">
          Add Post Form
        </h1>

        <div className="grid gap-4">

          {/* Event Name */}
          <div className="flex flex-col">
            <label className="text-gray-700 text-lg font-medium">Event Name</label>
            <input
              type="text"
              placeholder="Enter Event Name"
              value={postName}
              onChange={(e) => setPostName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="text-gray-700 text-lg font-medium">Description</label>
            <textarea
              rows="5"
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Facebook Link */}
          <div className="flex flex-col">
            <label className="text-gray-700 text-lg font-medium">Facebook Link</label>
            <input
              type="url"
              placeholder="https://facebook.com/..."
              value={fbLink}
              onChange={(e) => setFbLink(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

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


          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full md:w-auto px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-700 text-white hover:bg-blue-800"
              }`}
            >
              {isSubmitting ? "Submitting..." : "List Post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
