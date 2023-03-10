import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Results from "./pages/Results";
import Redeem from "./pages/Redeem";
import SellProduct from "./pages/SellProduct";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/result/:query',
    element: <Results />
  },
  {
    path: '/redeem',
    element: <Redeem />
  },
  {
    path: '/sellProduct',
    element: <SellProduct />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
