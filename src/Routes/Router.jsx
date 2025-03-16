import { createBrowserRouter } from "react-router-dom";
import Home from "../Page/Home";
import ErrorElement from "../components/ErrorElement";
import Main from "../Layout/Main";
import AddBlog from "../Page/AddBlog";
import Wishlist from "../Page/Wishlist";
import Login from "../Page/Authentication/Login";
import Register from "../Page/Authentication/Register";
import AllBlogs from "../Page/AllBlogs";
import Featured from "../Page/Featured";
import Profile from "../components/Profile";
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
          <PrivateRoute>
            <AddBlog />
          </PrivateRoute>
        ),
      },
      {
        path: "/wishlist",
        element: (
          <PrivateRoute>
            <Wishlist />
          </PrivateRoute>
        ),
      },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/all-blogs", element: <AllBlogs /> },
      { path: "/featured", element: <Featured /> },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
