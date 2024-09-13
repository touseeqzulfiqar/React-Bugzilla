import React from "react";
import SignUpForm from "./comps/SignUpForm";
import LoginForm from "./comps/LoginForm";
import Projects from "./comps/Projects";
import ProjectShow from "./comps/ProjectShow"; // Assuming you have a Projects page component
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./comps/ProtectedRoute"; 
// Import the ProtectedRoute component

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/signup",
      element: <SignUpForm />,
    },
    {
      path: "/login",
      element: <LoginForm />,
    },
    {
      path: "/projects",
      element: <ProtectedRoute element={<Projects />} />, // Protected route
    },
    {
      path: "/",
      element: <ProtectedRoute element={<Projects />} />, // Redirect to projects if logged in
    },
    {
      path: "/projects/:id",
      element: <ProtectedRoute element={<ProjectShow />} />, // Redirect to projects if logged in
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
