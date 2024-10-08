import React from "react";
import { useNavigate } from "react-router-dom"; // for redirection after login
import axios from "axios"; // Import Axios
import Alert from "./Alert";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [form, setForm] = React.useState({ email: "", password: "" });
  const [error, setError] = React.useState(null);
  const [showAlert, setShowAlert] = React.useState(false); // State for alert visibility
  const navigate = useNavigate(); // Hook for navigation

  async function LoginData(e) {
    e.preventDefault();

    const requestData = {
      user: {
        email: form.email,
        password: form.password,
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        requestData
      );

      // Save the JWT token in localStorage
      localStorage.setItem("authToken", response.headers.authorization); // Adjust based on your API response key
      localStorage.setItem("role", response.data.user.role); // Adjust based on your API response key

      // Show the alert
      setShowAlert(true);

      // Hide the alert after 3 seconds
      setTimeout(() => {
        setShowAlert(false);
        // Redirect to the projects page
        navigate("/projects");
      }, 800); // 3 seconds
    } catch (error) {
      console.error("Error:", error);
      setError("Login failed. Please try again.");
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  return (
    <>
      {/* Conditionally render the Alert component */}
      <Alert message="Login Successful" show={showAlert} />
      <form onSubmit={LoginData}>
        <section className="bg-white">
          <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
            {/* Add the image on the left side */}
            <aside className="relative block h-16 lg:col-span-5 lg:h-full xl:col-span-6 opacity-80">
              <img
                alt="Login illustration"
                src="https://images.unsplash.com/photo-1610775886065-d79eff2189c0?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Replace with your image URL
                className="absolute inset-0 h-full w-full object-cover"
              />
            </aside>

            <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
              <div className="max-w-xl lg:max-w-3xl">
                <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                  Login
                </h1>

                <p className="mt-4 leading-relaxed text-gray-500">
                  Please fill the form below.
                </p>

                {error && <p className="text-red-600">{error}</p>}

                <div className="mt-8 grid grid-cols-6 gap-6">
                  <div className="col-span-6">
                    <label
                      htmlFor="Email"
                      className="block text-md font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      className="mt-1 w-full p-3 text-sm border-gray-200 rounded-lg shadow-sm"
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter email"
                      value={form.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="Password"
                      className="block text-md font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <input
                      className="mt-1 w-full p-3 text-sm border-gray-200 rounded-lg shadow-sm"
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter password"
                      value={form.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                    <button
                      className="inline-block shrink-0 rounded-lg border bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring"
                      type="submit"
                    >
                      Sign in
                    </button>

                    <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                      Don't have an account?{" "}
                      <Link
                        className="text-blue-600 transition hover:underline"
                        to="/signup"
                      >
                        Sign up
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </section>
      </form>
    </>
  );
};

export default LoginForm;
