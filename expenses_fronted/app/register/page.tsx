"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔹 Call your FastAPI backend
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail);
        const errorData = await res.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      
      console.log("✅ Registered:", data);
      alert("Registration successful! Please log in.");
      router.push("/login");

      // Save token to localStorage (or Zustand)
      localStorage.setItem("token", data.access_token);
    } catch (err) {
      console.error("❌ Error:", err);
    }
    
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">
            Sign in to our platform
          </h5>

          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              type="text"
              id="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="jhon doe"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
              focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
              dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
          </div>

          {/* Email */}

          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
              focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
              dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
              focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
              dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 
            focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 
            text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create Account
          </button>

          {/* Register link */}
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Not registered?{" "}
            <a
              href="/auth/register"
              className="text-blue-700 hover:underline dark:text-blue-500"
            >
              Create account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
