import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../Provider/AuthProvider";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [blogs, setBlogs] = useState({
    technology: [],
    travel: [],
    health: [],
    lifestyle: [],
    education: [],
    all: [],
  });
  const [wishlist, setWishlist] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchBlogs = async (category) => {
      try {
        const limit = category === "all" ? 15 : 3;
        const response = await fetch(
          `http://localhost:5000/blogs?category=${category}&limit=${limit}`
        );
        const data = await response.json();
        setBlogs((prevBlogs) => ({ ...prevBlogs, [category]: data }));
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      }
    };

    fetchBlogs(selectedCategory);

    const fetchWishlist = async () => {
      if (user) {
        try {
          const response = await fetch(`http://localhost:5000/wishlist/${user.uid}`);
          const data = await response.json();
          setWishlist(data);
        } catch (error) {
          console.error("Failed to fetch wishlist", error);
        }
      }
    };

    fetchWishlist();
  }, [user, selectedCategory]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("Thank you for subscribing to our newsletter!");
    setEmail(""); 
  };

  const handleWishlist = async (blogId) => {
    if (!user) {
      toast.error("Please login to add to wishlist.");
      return;
    }

    if (wishlist.some((item) => item.blogId === blogId)) {
      toast.error("This blog is already in your wishlist!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/wishlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          blogId: blogId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to wishlist");
      }

      const data = await response.json();
      toast.success("Added to wishlist successfully!");
      setWishlist((prev) => [...prev, data.result]);
    } catch (error) {
      toast.error("Error adding to wishlist.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white font-sans">
      {/* Banner Section */}
      <section className="bg-blue-700 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Blogify</h1>
          <p className="text-xl mb-6">Stay updated with the latest blogs, tips, and news!</p>
        </div>
      </section>

      {/* Category Buttons */}
      <section className="container mx-auto text-center my-6">
        <div className="flex justify-center space-x-4 flex-wrap gap-4">
          {["all", "technology", "travel", "health", "lifestyle", "education"].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`${
                selectedCategory === category ? "bg-blue-400" : "bg-gray-700"
              } text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors duration-300`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Category Blog Section */}
      <section className="container mx-auto px-4 my-10">
        <h2 className="text-3xl text-center text-blue-400 mb-8">
          {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Blogs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-6">
          {blogs[selectedCategory].length > 0 ? (
            blogs[selectedCategory].map((blog) => (
              <div key={blog._id} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300">
                <h3 className="text-xl font-bold text-blue-400">{blog.title}</h3>
                <p className="text-gray-400">{blog.description}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Category: {blog.category} | {new Date(blog.date).toLocaleDateString()}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <Link to={`/blog/${blog._id}`} className="text-blue-400 hover:underline">
                    Details
                  </Link>
                  <button onClick={() => handleWishlist(blog._id)} className="text-red-500 hover:text-red-400">
                    <FaHeart />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">Loading {selectedCategory} blogs...</p>
          )}
        </div>
      </section>

      {/* Tips Section */}
      <section className="bg-gray-800 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl text-blue-400 mb-4">Pro Blogging Tips</h2>
          <p className="text-lg text-gray-400 mb-6">Get the best out of blogging with these pro tips!</p>
          <ul className="text-left text-gray-400">
            <li>1. Focus on your audience first.</li>
            <li>2. Write compelling headlines to grab attention.</li>
            <li>3. Use visuals to support your content.</li>
            <li>4. Stay consistent with your content schedule.</li>
            <li>5. Promote your blog on social media for greater reach.</li>
          </ul>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-900 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold text-blue-400">Subscribe to Our Newsletter</h2>
          <form onSubmit={handleSubscribe} className="mt-6 flex justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-l-lg focus:outline-none"
              placeholder="Enter your email"
              required
            />
            <button type="submit" className="bg-blue-400 text-white px-6 py-2 rounded-r-lg">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-blue-600 py-4">
        <div className="container mx-auto text-center text-white">
          <p>&copy; 2025 Blogify. All Rights Reserved.</p>
        </div>
      </footer>

      {/* ToastContainer for notifications */}
      <ToastContainer />
    </div>
  );
};

export default Home;
