import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const VerifyEmailPage = () => {
  const [message, setMessage] = useState("Verifying...");
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      axios
        .post("/api/auth/verify-email", { token })
        .then(() =>
          setMessage("Email verified successfully. You can now login.")
        )
        .catch((error) => setMessage(error.response.data.message));
    }
  }, [token]);

  return (
    <div>
      <h1>Verify Email</h1>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmailPage;
