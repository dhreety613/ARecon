import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const nav = useNavigate();

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await api.post("/auth/login", { email, password });
        console.log(res.data);
        alert("Login successful");
        nav("/home");
      } else {
        await api.post("/auth/signup", { username, email, password });
        alert("Signup successful. Please log in.");
        setIsLogin(true);
        setPassword("");
      }
    } catch (err: any) {
      alert(err.response?.data?.detail || "Error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "380px",
          background: "#1e293b",
          borderRadius: "16px",
          padding: "28px",
          color: "white",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        }}
      >
        <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {!isLogin && (
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={inputStyle}
          />
        )}

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={inputStyle}
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={inputStyle}
        />

        <button onClick={handleSubmit} style={primaryButton}>
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <button style={googleButton}>
          Continue with Google
        </button>

        <p
          style={{
            marginTop: "18px",
            color: "#60a5fa",
            cursor: "pointer",
            textAlign: "center",
          }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Create account" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white",
  boxSizing: "border-box",
};

const primaryButton: React.CSSProperties = {
  width: "100%",
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "10px",
  cursor: "pointer",
  marginTop: "6px",
  fontWeight: 600,
};

const googleButton: React.CSSProperties = {
  width: "100%",
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: "10px",
  cursor: "pointer",
  marginTop: "12px",
  fontWeight: 600,
};