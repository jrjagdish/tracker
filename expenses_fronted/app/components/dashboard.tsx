"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  const categories = ["Grocery", "Electricity", "Shopping", "Study", "Home", "Other"];

  // ✅ Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthorized(false);
    } else {
      // Optional: validate token with backend
      fetch("http://127.0.0.1:8000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.ok ? setIsAuthorized(true) : setIsAuthorized(false))
        .catch(() => setIsAuthorized(false));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthorized) {
      alert("You are not authorized. Please log in first.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/expense/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, category, amount: Number(amount) }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Failed to add expense");
        throw new Error(data.detail || "Failed to add expense");
      }

      // Success
      console.log("Expense added:", data);
      setTitle("");
      setCategory("");
      setAmount("");
      alert("Expense added successfully!");
    } catch (error: any) {
      console.error("Error adding expense:", error.message);
    }
  };

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          You are not authorized
        </h2>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-2 text-white bg-blue-700 rounded-lg hover:bg-blue-800"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white text-center">
        Welcome to the Expenses App
      </h1>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-full sm:max-w-md md:max-w-3xl lg:max-w-2xl xl:max-w-[60%] p-6 border border-gray-200 rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700"
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          Add New Expense
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter expense title"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label
              htmlFor="amount"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
              required
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add Expense
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
