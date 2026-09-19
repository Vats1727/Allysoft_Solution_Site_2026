import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { getApiEndpoint, getImageUrl } from "../utils/helpers";

export default function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("reset_email");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      navigate("/forgot-password");
    }

    setLogo(getImageUrl("/logo-white.png"));
    fetch(getApiEndpoint("batch_active"))
      .then(res => res.json())
      .then(data => {
        const logoPath = data?.navbar_section?.[0]?.logo;
        if (logoPath) {
          setLogo(getImageUrl(logoPath));
        }
      })
      .catch(() => {});
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(getApiEndpoint("auth/verify-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Password updated successfully. Redirecting to login...");
        localStorage.removeItem("reset_email");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(data.error || "Verification failed. Check your OTP code.");
      }
    } catch (err) {
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
          <img src={logo} alt="Ally Soft Solutions Logo" style={{ height: "42px", width: "auto", objectFit: "contain" }} />
        </div>
        <p style={styles.brandSubtitle}>
          Enter the 4-digit code sent to <strong>{email}</strong> and set your new password
        </p>

        {error && (
          <div style={styles.errorAlert}>
            <LucideIcons.AlertTriangle size={14} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={styles.successAlert}>
            <LucideIcons.CheckCircle2 size={14} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Verification Code</label>
            <div style={styles.fieldWrapper}>
              <LucideIcons.Key size={16} style={styles.fieldIcon} />
              <input 
                type="text" 
                placeholder="4-Digit OTP" 
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>New Password</label>
            <div style={styles.fieldWrapper}>
              <LucideIcons.Lock size={16} style={styles.fieldIcon} />
              <input 
                type={showNewPassword ? "text" : "password"} 
                placeholder="At least 6 characters" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeButton}
              >
                {showNewPassword ? <LucideIcons.EyeOff size={16} /> : <LucideIcons.Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm New Password</label>
            <div style={styles.fieldWrapper}>
              <LucideIcons.Lock size={16} style={styles.fieldIcon} />
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Repeat new password" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
              >
                {showConfirmPassword ? <LucideIcons.EyeOff size={16} /> : <LucideIcons.Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Verifying..." : "Verify & Reset"}
          </button>

          <div style={styles.footerRow}>
            <Link to="/forgot-password" style={styles.backLink}>Request new OTP code</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#050505",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Outfit, sans-serif",
    padding: "20px"
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#0c0e18",
    border: "1px solid rgba(245, 166, 35, 0.1)",
    borderRadius: "16px",
    padding: "36px 30px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
    textAlign: "center",
    boxSizing: "border-box"
  },
  logoWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px"
  },
  logoCircle: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "rgba(245, 166, 35, 0.08)",
    border: "2px solid #f5a623",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  brandName: {
    fontSize: "1.5rem",
    fontWeight: "900",
    color: "#e2e8f5",
    letterSpacing: "1px",
    margin: 0
  },
  brandSubtitle: {
    fontSize: "0.85rem",
    color: "#64748b",
    marginTop: "6px",
    marginBottom: "24px",
    lineHeight: "1.4"
  },
  errorAlert: {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    color: "#ef4444",
    borderRadius: "8px",
    padding: "10px 12px",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textAlign: "left",
    marginBottom: "20px"
  },
  successAlert: {
    background: "rgba(16, 185, 129, 0.1)",
    border: "1px solid rgba(16, 185, 129, 0.2)",
    color: "#10b981",
    borderRadius: "8px",
    padding: "10px 12px",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textAlign: "left",
    marginBottom: "20px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    textAlign: "left"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase"
  },
  fieldWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  fieldIcon: {
    position: "absolute",
    left: "14px",
    color: "#64748b"
  },
  input: {
    width: "100%",
    background: "#07080e",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "8px",
    padding: "12px 40px 12px 42px",
    fontSize: "13px",
    color: "#e2e8f5",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s"
  },
  eyeButton: {
    position: "absolute",
    right: "12px",
    background: "transparent",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    zIndex: 10
  },
  submitButton: {
    background: "linear-gradient(135deg, #f5a623 0%, #d48312 100%)",
    border: "none",
    borderRadius: "20px",
    color: "#050505",
    padding: "12px",
    fontSize: "13px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(245, 166, 35, 0.25)",
    transition: "transform 0.15s, box-shadow 0.15s",
    marginTop: "10px"
  },
  footerRow: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px"
  },
  backLink: {
    fontSize: "12px",
    color: "#64748b",
    textDecoration: "none",
    fontWeight: "600",
    transition: "color 0.15s"
  }
};
