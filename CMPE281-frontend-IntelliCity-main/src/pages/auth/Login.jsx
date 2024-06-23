import React, { useState } from "react";
import LoginIcon from "../../medias/auth/authIcon.png";
import Toast from "../../components/Toast";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [toast, setToast] = useState({ message: '', type: '' });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_DATA_SERVER_URL}auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed");
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        localStorage.setItem("firstname", data.firstname);
        localStorage.setItem("lastname", data.lastname);
        localStorage.setItem("is_agent", data.is_agent);
        window.location.href = "/";
      })
      .catch((error) => {
        setToast({ message: error.message, type: 'error' });
        console.error("Login error:", error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex space-x-5">
        <img src={LoginIcon} alt="icon" />
        <h1 className="mb-2 mt-0 text-5xl font-medium leading-tight text-primary">
          IntelliCity
        </h1>
      </div>
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Login
        </h2>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
            placeholder="Enter email"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
            placeholder="Password"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
          >
            Login
          </button>
          <Toast message={toast.message} type={toast.type} />

          <p className="text-gray-900 mt-4">
            Don't have an account?
            <a
              href="/auth/signup"
              className="text-sm text-blue-500 -200 hover:underline mt-4"
            >
              Signup
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
