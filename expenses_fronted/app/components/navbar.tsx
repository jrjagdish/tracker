"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { User } from "lucide-react"; // ✅ profile/account icon

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // 🔹 Fetch logged-in user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://127.0.0.1:8000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Not authenticated");
          return res.json();
        })
        .then((data) => setUserEmail(data.email))
        .catch(() => setUserEmail(null));
    }
  }, []);

  return (
    <div className="position-fixed">
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 ">
      <div className="max-w-screen-xl mx-auto p-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="text-2xl font-semibold dark:text-white">
            Expense Track
          </span>
        </Link>

        {/* Right section */}
        <div className="flex items-center space-x-3 md:space-x-0">
          {/* ✅ If logged in → show icon */}
          {userEmail ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center w-9 h-9 bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                aria-expanded={dropdownOpen}
              >
                <span className="sr-only">Open user menu</span>
                <User className="text-white w-5 h-5" />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md divide-y divide-gray-100 dark:bg-gray-700 dark:divide-gray-600 z-50"
                  >
                    <div className="px-4 py-3">
                      <span className="block text-sm text-gray-900 dark:text-white">
                        Logged in
                      </span>
                      <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                        {userEmail}
                      </span>
                    </div>
                    <ul className="py-2">
                      {["Dashboard", "Spendings"].map((item) => (
                        <li key={item}>
                          <Link
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={() => {
                            localStorage.removeItem("access_token"); // clear token
                            setUserEmail(null);
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Sign out
                        </button>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* ❌ If not logged in → show Login button */
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              Login
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center p-2 text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <Link href="/expense">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-2xl ms-3.5">View Expenses</button>
          </Link>
        </div>

        {/* Desktop & mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 w-full bg-gray-50 md:bg-white md:static md:flex md:space-x-8 md:items-center md:justify-between p-4 md:p-0 dark:bg-gray-800 md:dark:bg-gray-900"
            >
              <ul className="flex flex-col md:flex-row md:space-x-8 font-medium">
                {["Home", "About", "Services", "Pricing", "Contact"].map(
                  (link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white dark:hover:bg-gray-700 md:dark:hover:text-white md:dark:hover:bg-transparent"
                      >
                        {link}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
    </div>
  );
}
