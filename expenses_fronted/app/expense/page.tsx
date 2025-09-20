"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Expense {
  id: number;
  title: string;
  category: string;
  amount: number;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const router = useRouter();

  const categories = [
    "Grocery",
    "Electricity",
    "Shopping",
    "Study",
    "Home",
    "Other",
  ];

  // ✅ Check authorization
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthorized(false);
    } else {
      fetch("http://127.0.0.1:8000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) =>
          res.ok ? setIsAuthorized(true) : setIsAuthorized(false)
        )
        .catch(() => setIsAuthorized(false));
    }
  }, []);

  // ✅ Fetch expenses
  const fetchExpenses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://127.0.0.1:8000/expense", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setExpenses((prev) => prev.filter((exp) => exp.id !== id));
        alert("Expense deleted");
      } else {
        alert("Failed to delete expense");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/expenses/${editingExpense.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editingExpense.title,
            category: editingExpense.category,
            amount: Number(editingExpense.amount),
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        alert(data.detail || "Failed to update expense");
        return;
      }

      setEditingExpense(null);
      fetchExpenses();
      alert("Expense updated successfully!");
    } catch (err) {
      console.error(err);
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
    <div className="min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Your Expenses
      </h1>

      {/* Graph placeholder */}
      <motion.div
        className="w-full h-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md mb-6 shadow-sm flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {expenses.length > 0 ? (
          <img
            src="http://127.0.0.1:8000/expenses/weekly-graph"
            alt="Weekly Expenses Graph"
            className="max-h-60 object-contain"
          />
        ) : (
          <p className="text-gray-400 dark:text-gray-300">No data available</p>
        )}
      </motion.div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left text-gray-900 dark:text-white">
                Title
              </th>
              <th className="px-4 py-2 text-left text-gray-900 dark:text-white">
                Category
              </th>
              <th className="px-4 py-2 text-left text-gray-900 dark:text-white">
                Amount
              </th>
              <th className="px-4 py-2 text-left text-gray-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr
                key={exp.id}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="px-4 py-2 text-gray-900 dark:text-white">
                  {exp.title}
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-white">
                  {exp.category}
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-white">
                  {exp.amount}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    onClick={() => setEditingExpense(exp)}
                  >
                    Update
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => handleDelete(exp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-4 text-center text-gray-500 dark:text-gray-300"
                >
                  No expenses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {editingExpense && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Update Expense
            </h2>
            <form className="space-y-4" onSubmit={handleUpdateSubmit}>
              <input
                type="text"
                value={editingExpense.title}
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    title: e.target.value,
                  })
                }
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <select
                value={editingExpense.category}
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    category: e.target.value,
                  })
                }
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={editingExpense.amount}
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    amount: Number(e.target.value),
                  })
                }
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  onClick={() => setEditingExpense(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
