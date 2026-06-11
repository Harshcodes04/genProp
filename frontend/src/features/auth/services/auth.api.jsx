import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:5432/api/auth",
  withCredentials: true,
});

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/register", { username, email, password });
    return response.data;
  } catch (err) {
    console.log(err);
  }
}
export async function login({ email, password }) {
  try {
    const reponse = await api.post("/login", { email, password });
    return reponse.data;
  } catch (err) {
    console.log(err);
  }
}
export async function logout() {
  try {
    const response = await api.get("/logout");
    return response.data;
  } catch (err) {
    console.log(err);
  }
}
export async function getMe() {
  try {
    const response = await api.get("/get-me");
    return response.data;
  } catch (err) {
    console.log(err);
  }
}
