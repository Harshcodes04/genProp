import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5432/api/auth",
  withCredentials: true,
});

export async function register({ username, email, password }) {
  const response = await api.post("/register", { username, email, password });
  return response.data;
}

export async function login({ email, password }) {
  const response = await api.post("/login", { email, password });
  return response.data;
}

export async function logout() {
  const response = await api.get("/logout");
  return response.data;
}

export async function getMe() {
  const response = await api.get("/get-me");
  return response.data;
}
