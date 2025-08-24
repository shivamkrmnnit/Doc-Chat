import { useState } from "react";
// Adjust the import path as necessary

export default function SignupForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (k) => (e) =>
    setForm({ ...form, [k]: k === "email" ? e.target.value.toLowerCase() : e.target.value });

  return (
    <>
     
      <h2 className="text-2xl font-semibold text-center mb-6">Signup</h2>

      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={handleChange("name")}
        className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange("email")}
        className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange("password")}
        className="w-full mb-2 px-4 py-3 border border-gray-300 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <p className="text-sm text-gray-500 mb-4">
        <em>Min 8 chars, uppercase, lowercase, number & special char</em>
      </p>

      <button
        disabled={loading}
        onClick={() => onSubmit(form)}
        className={`cursor-pointer w-full py-3 rounded-md transition 
          ${loading
            ? "bg-purple-400 cursor-not-allowed text-white"
            : "bg-purple-600 hover:bg-purple-700 text-white"}`}
      >
        {loading ? "Please wait…" : "Signup"}
      </button>
    </>
  );
}
