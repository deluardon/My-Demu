import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import { Link } from "react-router-dom";

const WishlistPage = () => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.uid) {
        console.log("User is not logged in.");
        return;
      }

      console.log("Fetching wishlist for user:", user.uid);
      setLoading(true);
      setError(null);

      try {
        // ✅ Fetch wishlist items (Contains userId & blogId)
        const response = await fetch(`http://localhost:5000/wishlist/${user.uid}`);
        
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const wishlistData = await response.json();
        console.log("Fetched Wishlist:", wishlistData);

        // ✅ Fetch the actual blog details for each wishlist item
        const blogsData = await Promise.all(
          wishlistData.map(async (wishlistItem) => {
            const blogResponse = await fetch(`http://localhost:5000/blog/${wishlistItem.blogId}`);
            if (!blogResponse.ok) return null;
            return await blogResponse.json();
          })
        );

        // ✅ Remove null values (in case some blogs were deleted)
        setWishlist(blogsData.filter((blog) => blog !== null));
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  return (
    <div className="bg-gray-900 text-white font-sans">
      <section className="container mx-auto px-4 my-10">
        <h2 className="text-3xl text-center text-blue-400 mb-8">Your Wishlist</h2>

        {loading && <p className="text-center text-gray-400">Loading wishlist...</p>}
        {error && <p className="text-center text-red-400">{error}</p>}
        
        {!loading && !error && wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((blog) => (
              <div key={blog._id} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300">
                <h3 className="text-xl font-bold text-blue-400">{blog.title}</h3>
                <p className="text-gray-400">{blog.shortDescription}</p>
                <div className="mt-4 flex justify-between items-center">
                  <Link to={`/blog/${blog._id}`} className="text-blue-400 hover:underline">
                    View Blog
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p className="text-center text-gray-400">You have no blogs in your wishlist yet.</p>
        )}
      </section>
    </div>
  );
};

export default WishlistPage;
