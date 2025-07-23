import axios from "axios";

const instance = axios.create({
  baseURL: typeof window === "undefined" ? "http://localhost:3000" : "",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
