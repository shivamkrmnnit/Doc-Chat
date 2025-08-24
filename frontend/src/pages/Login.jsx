import React from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/ui/Loader";
import LoginForm from "../components/LoginForm";
import useLogin from "../hooks/useLogin";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useLogin();

  return (
    <>
    <Navbar />
    <div className="bg-white flex justify-center items-center min-h-[80vh] relative">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl z-10">
        <LoginForm onSubmit={login} loading={loading} />

        <p className="text-center text-sm mt-4">
          Don&rsquo;t have an account?{" "}
          <button
            className="text-purple-600 hover:underline font-medium"
            onClick={() => navigate("/signup")}
          >
            Signup
          </button>
        </p>
      </div>

      {loading}
    </div>
    </>
  );
}
