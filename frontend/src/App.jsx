import Home from "./pages/Home.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layouts/Layout.jsx";
import About from "./pages/About.jsx";
import AddYours from "./pages/AddYours.jsx";
import Map from "./pages/Map.jsx";
import "./App.css";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="loading loading-spinner loading-lg text-primary"></div>
  </div>
);

const allRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/addyours",
    element: <AddYours />,
  },
  {
    path: "/map",
    element: <Map />,
  },
];

const router = createBrowserRouter(
  allRoutes.map((route) => ({
    ...route,
    element: <Layout>{route.element}</Layout>,
  }))
);

function App() {
  return (
    <RouterProvider router={router} fallbackElement={<LoadingSpinner />} />
  );
}

export default App;
