import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { getApiEndpoint, getImageUrl } from "../utils/helpers";

export default function ForgotPassword() {
  const [activeTab, setActiveTab] = useState("otp"); // "otp" or "old_password"
  const [email, setEmail] = useState("");
  
  // Fields for Reset via Old Password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Show/Hide visibility states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (activeTab === "otp") {
      try {
        const res = await fetch(getApiEndpoint("auth/forgot-password"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (data.success) {
          setSuccess("An OTP verification code was sent to your email.");
          localStorage.setItem("reset_email", email);
          setTimeout(() => {
            navigate("/recover-password");
          }, 1500);
        } else {
          setError(data.error || "Password reset request failed");
        }
      } catch (err) {
        setError("Network connection error. Check your PHP server.");
      } finally {
        setLoading(false);
      }
    } else {
      // Client-side validations
      if (newPassword !== confirmPassword) {
        setError("New Password and Confirm New Password do not match.");
        setLoading(false);
        return;
      }
      if (newPassword.length < 6) {
        setError("New Password must be at least 6 characters.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(getApiEndpoint("auth/change-password-old"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, oldPassword, newPassword })
        });
        const data = await res.json();
        if (data.success) {
          setSuccess("Password changed successfully. Redirecting to login...");
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        } else {
          setError(data.error || "Failed to change password. Double check your old password.");
        }
      } catch (err) {
        setError("Network connection error. Check your PHP server.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
          <img src={logo} alt="Ally Soft Solutions Logo" style={{ height: "42px", width: "auto", objectFit: "contain" }} />
        </div>
        <p style={styles.brandSubtitle}>
          {activeTab === "otp" 
            ? "Enter your registered admin email address to receive a 4-digit code" 
            : "Update your password immediately by verifying your current password"}
        </p>

        {/* Tab Switcher Segmented Control */}
        <div style={styles.tabContainer}>
          <button 
            type="button"
            onClick={() => { setActiveTab("otp"); setError(""); setSuccess(""); }}
            style={{
              ...styles.tabButton,
              ...(activeTab === "otp" ? styles.activeTabButton : {})
            }}
          >
            Reset via OTP
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab("old_password"); setError(""); setSuccess(""); }}
            style={{
              ...styles.tabButton,
              ...(activeTab === "old_password" ? styles.activeTabButton : {})
            }}
          >
            Reset via Old Password
          </button>
        </div>

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
          {/* Email Address - Shown in both flows */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.fieldWrapper}>
              <LucideIcons.Mail size={16} style={styles.fieldIcon} />
              <input 
                type="email" 
                placeholder="admin@gmail.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          {/* Reset via Old Password Fields */}
          {activeTab === "old_password" && (
            <>
              {/* Old Password */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Old Password</label>
                <div style={styles.fieldWrapper}>
                  <LucideIcons.Lock size={16} style={styles.fieldIcon} />
                  <input 
                    type={showOldPassword ? "text" : "password"} 
                    placeholder="Current Password" 
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    style={styles.input}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    style={styles.eyeButton}
                  >
                    {showOldPassword ? <LucideIcons.EyeOff size={16} /> : <LucideIcons.Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
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

              {/* Confirm Password */}
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
            </>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Processing Request..." : (activeTab === "otp" ? "Send Recovery OTP" : "Update Password")}
          </button>

          <div style={styles.footerRow}>
            <Link to="/login" style={styles.backLink}>Back to Login</Link>
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
    maxWidth: "420px",
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
  tabContainer: {
    background: "#07080e",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "24px",
    padding: "4px",
    display: "flex",
    gap: "4px",
    marginBottom: "24px"
  },
  tabButton: {
    flex: 1,
    background: "transparent",
    border: "none",
    borderRadius: "20px",
    padding: "8px 12px",
    color: "#94a3b8",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.25s"
  },
  activeTabButton: {
    background: "rgba(245, 166, 35, 0.08)",
    border: "1px solid rgba(245, 166, 35, 0.2)",
    color: "#f5a623"
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
