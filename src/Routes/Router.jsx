import { createBrowserRouter } from "react-router-dom";
import Home from "../Page/Home";
import ErrorElement from "../components/ErrorElement";
import Main from "../Layout/Main";
import AddBlog from "../Page/AddBlog";

import Login from "../Page/Authentication/Login";
import Register from "../Page/Authentication/Register";
import AllBlogs from "../Page/AllBlogs";
import Featured from "../Page/Featured";
import Profile from "../components/Profile";

import BlogDetails from "../Page/Details";
 // Make sure this is the correct import for your private route.
import WishlistPage from "../Page/Wishlist";
import MyBlog from "../Page/MyBlog";  // I assume this component exists, if not, please create it.
import PrivateRoute from "./PraivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorElement />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/add-blog",
        element: (
          
            <AddBlog />
        
        ),
      },
      {
        path: "/wishlist",
        element: <WishlistPage /> // Protected Route
      },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/all-blogs", element: <AllBlogs /> },
      { path: "/featured", element: <Featured /> },
      {
        path: "/profile",
        element: (
          
            <Profile />
         
        ),
      },
      { path: "/blog/:id", element: <BlogDetails /> },
      {
        path: "/my-blogs",
        element: (
          
            <MyBlog />
         
        ),
      },
    ],
  },
]);

export default router;
