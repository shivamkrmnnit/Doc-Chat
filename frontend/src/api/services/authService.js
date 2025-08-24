import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const signup = async (payload) =>
  axios.post(`${BASE_URL}/api/auth/signup`, payload).then((r) => r.data);

export const login = (payload) =>
  axios.post(`${BASE_URL}/api/auth/login`, payload).then((r) => r.data);