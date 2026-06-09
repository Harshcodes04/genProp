import axios from "axios";

export async function register({ username, email, password }) {
  try {
    const response = await axios.post(
      "https://localhost:5432/api/auth/register",
      { username, email, password },
      {
        withCredentials: true, //because we want to send cookies with the request
      },
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function login({ email, password }) {
  try {
    const reponse = await axios.post(
      "https://localhost:5432/api/auth/login",
      { email, password },
      {
        withCredentials: true, //same as above
      },
    );
    return reponse.data;
  } catch (err) {
    console.log(err);
  }
}
export async function logout() {
  try {
    const response = await axios.get("https://localhost:5432/api/auth/logout", {
      withCredentials: true, //same
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getMe() {
  try {
    const response = await axios.get("https://localhost:5432/api/auth/get-me", {
      withCredentials: true, //same
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
}
