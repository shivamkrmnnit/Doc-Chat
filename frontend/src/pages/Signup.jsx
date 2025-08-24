import React from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/ui/Loader";
import SignupForm from "../components/SignupForm";
import useSignup from "../hooks/useSignup";
import Navbar from "../components/Navbar"; 

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, loading } = useSignup();

  return (
    <>
      <Navbar />
    <div className="bg-white flex justify-center items-center min-h-[80vh] relative">
     
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl z-10">
        
        <SignupForm onSubmit={signup} loading={loading} />

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-purple-600 hover:underline font-medium"
          >
            Login
          </button>
        </p>
      </div>

      {loading}
    </div>
    </>
  );
}
