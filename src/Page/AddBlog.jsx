import React from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const AddBlog = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    // Log the data being sent to the server
    console.log("Form Data:", data);
  
    // Check if all fields are filled
    if (!data.title || !data.image || !data.shortDescription || !data.longDescription || !data.category) {
      toast.error("❌ All fields are required.", { autoClose: 3000 });
      return;
    }
  
    try {
      // Sending data to the backend
      const res = await axios.post("http://localhost:5000/blogs/add", data);
  
      if (res?.data?.blogId) {
        toast.success("🎉 Blog added successfully!", { autoClose: 2000 });
        reset(); // Reset form immediately
      } else {
        throw new Error("Failed to add blog");
      }
    } catch (error) {
      console.error("Error adding blog:", error);
      toast.error("❌ Failed to add blog. Try again!", { autoClose: 3000 });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 p-6 sm:p-8 md:p-10 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
          Add a New Blog
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
          
          {/* Blog Title */}
          <div>
            <label className="block mb-1 text-blue-400">Blog Title</label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
              placeholder="Enter blog title"
            />
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
          </div>

          {/* Image URL */}
          <div>
            <label className="block mb-1 text-blue-400">Image URL</label>
            <input
              type="text"
              {...register("image", { required: "Image URL is required" })}
              className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
              placeholder="Enter image URL"
            />
            {errors.image && <p className="text-red-500">{errors.image.message}</p>}
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block mb-1 text-blue-400">Category</label>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full p-3 rounded bg-gray-700 text-white"
            >
              <option value="">Select a category</option>
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Travel">Travel</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
            </select>
            {errors.category && <p className="text-red-500">{errors.category.message}</p>}
          </div>

          {/* Short Description */}
          <div>
            <label className="block mb-1 text-blue-400">Short Description</label>
            <textarea
              {...register("shortDescription", { required: "Short description is required" })}
              className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
              placeholder="Enter a short description"
            />
            {errors.shortDescription && (
              <p className="text-red-500">{errors.shortDescription.message}</p>
            )}
          </div>

          {/* Long Description */}
          <div>
            <label className="block mb-1 text-blue-400">Long Description</label>
            <textarea
              {...register("longDescription", { required: "Long description is required" })}
              className="w-full p-3 h-32 rounded bg-gray-700 text-white placeholder-gray-400"
              placeholder="Enter a detailed description"
            />
            {errors.longDescription && (
              <p className="text-red-500">{errors.longDescription.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
          >
            Add Blog
          </button>
        </form>
      </div>
      
      {/* Toast Messages */}
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default AddBlog;
