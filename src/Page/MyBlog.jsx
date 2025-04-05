// MyBlog.jsx
import React, { useEffect, useState, useContext } from "react";

import { collection, query, where, getDocs } from "firebase/firestore";
 // Adjust path to your AuthProvider
import { db } from "../Auth/Fairbase";
import { AuthContext } from "../Provider/AuthProvider";

const MyBlog = () => {
  const { user, loading } = useContext(AuthContext); // Using AuthContext
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch blogs if user is authenticated
  useEffect(() => {
    if (user) {
      const fetchBlogs = async () => {
        try {
          const blogsCollection = collection(db, "blogs");
          const q = query(blogsCollection, where("email", "==", user.email)); // Use the logged-in user's email
          const querySnapshot = await getDocs(q);
          
          const blogsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBlogs(blogsData);
        } catch (error) {
          console.error("Error fetching blogs: ", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchBlogs();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading || loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to see your blogs.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Blogs</h1>
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <div key={blog.id} className="bg-gray-100 p-4 mb-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p className="text-gray-600">{blog.content}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-600">You don't have any blogs yet.</p>
      )}
    </div>
  );
};

export default MyBlog;
