import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { signup as signupAPI } from "../api/services/authService";
import { isValidEmail, isStrongPassword } from "../utils/validators";

export default function useSignup() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signup = async ({ name, email, password }) => {
    if (loading) return;

    if (![name, email, password].every((v) => v.trim())) {
      return toast.error("All fields are required");
    }
    if (name.trim().length < 2)          return toast.error("Name too short");
    if (!isValidEmail(email))            return toast.error("Invalid email");
    if (!isStrongPassword(password))     return toast.error("Invalid password format");

    try {
      setLoading(true);
      const data = await signupAPI({
        name,
        email: email.toLowerCase(),
        password,
      });

      if (data?.token) {
        localStorage.setItem("token", data.token);
        toast.success("Signup successful!");
        navigate("/dashboard");
      } else {
        toast.error("Signup failed");
      }
    } catch ({ response }) {
      const status = response?.status;
      const message = response?.data?.message?.toLowerCase() || '';
      const errorText = response?.data?.error?.toLowerCase() || '';

      if ((status === 400 || status === 409) && (message.includes("email") || errorText.includes("email"))) {
        toast.error('Email already exists.');
      } else if (status === 400 && (message.includes("password") || errorText.includes("password"))) {
        toast.error('Password does not meet requirements.');
      } else {
        toast.error('Oops! Try again later.');
      }
      setLoading(false);
    }
  };

  return { signup, loading };
}
