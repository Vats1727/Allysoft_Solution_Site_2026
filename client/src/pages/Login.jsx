import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { getApiEndpoint, getImageUrl } from "../utils/helpers";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If token exists, skip login
    if (localStorage.getItem("admin_token")) {
      navigate("/admin");
    }

    // Set default fallback logo
    setLogo(getImageUrl("/logo-white.png"));

    // Fetch dynamic logo from batch api
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
    setLoading(true);

    try {
      const res = await fetch(getApiEndpoint("auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_user", JSON.stringify(data.user));
        navigate("/admin");
      } else {
        setError(data.error || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Server connection failed. Make sure your PHP server is running.");
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
        <p style={styles.brandSubtitle}>Solutions Customizer Login Portal</p>

        {error && (
          <div style={styles.errorAlert}>
            <LucideIcons.AlertTriangle size={14} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
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

          <div style={styles.inputGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label}>Password</label>
              <Link to="/forgot-password" style={styles.forgotLink}>Forgot password?</Link>
            </div>
            <div style={styles.fieldWrapper}>
              <LucideIcons.Lock size={16} style={styles.fieldIcon} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? <LucideIcons.EyeOff size={16} /> : <LucideIcons.Eye size={16} />}
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
            {loading ? "Authenticating..." : "Sign In to Dashboard"}
          </button>
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
    marginBottom: "30px"
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
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    textAlign: "left"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  label: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase"
  },
  forgotLink: {
    fontSize: "11px",
    color: "#f5a623",
    textDecoration: "none",
    fontWeight: "600"
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
  }
};
