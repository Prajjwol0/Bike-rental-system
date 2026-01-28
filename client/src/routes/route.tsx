import Dashboard from "@/pages/dashboard/Dashboard";
import AddBike from "@/pages/dashboard/partials/addBike";
import MyBike from "@/pages/dashboard/partials/myBike";
import RentBike from "@/pages/dashboard/partials/rentBike";
import HomePage from "@/pages/home-page";
import About from "@/pages/Home/partials/about";
import Contacts from "@/pages/Home/partials/contacts";
import Supports from "@/pages/Home/partials/ser-supp";
import { ErrorPage } from "@/pages/login-register/partials/error";
import Login from "@/pages/login-register/partials/Login";
import Register from "@/pages/login-register/partials/Register";
import ProtectedRoutes from "@/routes/ProtectedRoute";

import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      // public routes
      {
        children: [
          {
            path: "/",
            element: <HomePage/>,
          },

          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Register />,
          },
          {
            path:"/about",
            element:<About/>
          },
          {
            path:"/support",
            element:<Supports/>
          }
          ,
          {
            path:"/contact",
            element:<Contacts/>
          }
        ],
      },

      // Protected Routes
      {
        element: <ProtectedRoutes />, // wrapper
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          {
            path: "/rent",
            element: <RentBike />,
          },
          {
            path: "/add",
            element: <AddBike />,
          },
          {
            path: "/mybike",
            element: <MyBike />,
          },
        ],
      },
    ],
  },
]);
