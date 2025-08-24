import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { login as loginAPI } from "../api/services/authService";
import { isValidEmail, isStrongPassword } from "../utils/validators";

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async ({ email, password }) => {
    if (loading) return;

    if (![email, password].every((v) => v.trim()))
      return toast.error("All fields are required.");
    if (!isValidEmail(email))        return toast.error("Invalid email.");
    if (!isStrongPassword(password)) return toast.error("Invalid password.");

    try {
      setLoading(true);
      const data = await loginAPI({
        email: email.toLowerCase(),
        password,
      });

      localStorage.setItem("token", data.token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch ({ response }) {
      const status = response?.status;
      const msg    = response?.data?.message;

      if (status === 400 || status === 401)
        toast.error(msg || "Invalid credentials");
      else toast.error("Oops! Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}
