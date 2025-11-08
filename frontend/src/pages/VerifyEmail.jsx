import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import FormContainer from "../components/FormContainer.jsx";
import { useVerifyEmailMutation } from "../slices/authsApiSlice.js";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice.js";
import { useResendVerificationEmailMutation } from "../slices/authsApiSlice.js";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(0);
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendVerification, {isLoading: isResending}] = useResendVerificationEmailMutation();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await verifyEmail({ code }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success(res.message || "Email verified successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || "Verification failed. Try again.");
    }
  };

    const resendHandler = async () => {
    try {
      await resendVerification({ email: state?.email }).unwrap();
      toast.success("Verification code resent successfully!");
      setTimer(60); // 60 seconds before user can resend again
    } catch (err) {
      toast.error(err?.data?.message || "Failed to resend code.");
    }
  };

  return (
    <FormContainer>
      <h1>Verify Your Email</h1>
      <p>Enter the 6-digit code we sent to your email address.</p>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="code" className="my-3">
          <Form.Control
            type="text"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify Email"}
        </Button>
      </Form>
        <div className="mt-3">
        <Button
          variant="link"
          onClick={resendHandler}
          disabled={timer > 0 || isResending}
        >
          {isResending
            ? "Resending..."
            : timer > 0
            ? `Resend in ${timer}s`
            : "Resend Code"}
        </Button>
      </div>
    </FormContainer>
  );
};

export default VerifyEmail;
