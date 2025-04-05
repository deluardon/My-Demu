import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:5000/blogs/${id}`);
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error("Failed to fetch blog details", error);
      }
    };
    fetchBlog();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-10">
      {blog ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl text-blue-400">{blog.title}</h2>
          <p className="text-gray-400">{blog.description}</p>
          <div className="mt-4 text-gray-300">{blog.content}</div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BlogDetails;
