import React, { useState, useEffect } from "react";
import "./CSS/OtpPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";

const OtpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/login"); // redirect if accessed directly
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (e) => {
    setOtp(e.target.value.replace(/\D/, ""));
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("❌ Enter a 6-digit OTP");
      return;
    }
    setIsVerifying(true);
    try {
      const response = await fetch("http://localhost:4000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("auth-token", data.token);
        toast.success("✅ OTP Verified Successfully!");
        setTimeout(() => navigate("/"), 1000); // redirect home
      } else {
        toast.error(data.error || "❌ Invalid OTP");
      }
    } catch (err) {
      toast.error("⚠️ Server error during OTP verification");
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOtp = async () => {
    if (!canResend) return;
    setResendTimer(30);
    setCanResend(false);
    try {
      await fetch("http://localhost:4000/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      toast.success("📩 OTP resent successfully!");
    } catch (err) {
      toast.error("⚠️ Failed to resend OTP");
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-container">
        <h1>OTP Verification</h1>
        <p>
          Enter the 6-digit OTP sent to your email: <b>{email}</b>
        </p>
        <input
          type="text"
          value={otp}
          onChange={handleChange}
          maxLength={6}
          placeholder="Enter OTP"
        />
        <button onClick={verifyOtp} disabled={isVerifying}>
          {isVerifying ? "Verifying..." : "Verify OTP"}
        </button>
        <p className="resend-otp">
          Didn't receive OTP?{" "}
          <span
            onClick={resendOtp}
            style={{ cursor: canResend ? "pointer" : "not-allowed" }}
          >
            {canResend ? "Resend" : `Resend in ${resendTimer}s`}
          </span>
        </p>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default OtpPage;
