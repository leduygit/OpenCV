import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", formData);
      localStorage.setItem("token", response.data.token);
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Forgot your password? <Link href="/forgot-password">Reset here</Link>
      </p>
      <p>
        Don&apos;t have an account? <Link href="/register">Register here</Link>
      </p>
    </div>
  );
};

export default LoginPage;
