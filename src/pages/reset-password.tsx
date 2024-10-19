import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { token } = router.query;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/reset-password", {
        token,
        newPassword: password,
      });
      setMessage(
        "Password reset successful. You can now login with your new password."
      );
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
      <h1>Reset Password</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="password"
          placeholder="New Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
