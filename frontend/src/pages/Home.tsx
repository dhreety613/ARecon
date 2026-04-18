import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const nav = useNavigate();
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowCards(true), 400);
    return () => clearTimeout(timer);
  }, []);

  // --- Fixed Theme Constants ---
  const NEON_PURPLE = "#bc13fe";
  const HEADER_GRADIENT = "linear-gradient(90deg, #ffffff 0%, #d8b4fe 50%, #bc13fe 100%)";
  const GLASS_GRADIENT = "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%)";

  const animations = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

    @keyframes slimyPop {
      0% {
        opacity: 0;
        transform: translateY(60px) scaleY(1.3) scaleX(0.9);
        filter: blur(20px);
      }
      60% {
        transform: translateY(-5px) scaleY(0.9) scaleX(1.02);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scaleY(1) scaleX(1);
        filter: blur(0px);
      }
    }
  `;

  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "120px 24px",
    fontFamily: "'Orbitron', sans-serif",
    position: "relative",
    overflowX: "hidden",
  };

  const headerBarStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "80px",
    background: HEADER_GRADIENT,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    boxShadow: "0 10px 30px rgba(188, 19, 254, 0.3)",
  };

  const getNavButtonStyle = (index: number): React.CSSProperties => ({
    background: GLASS_GRADIENT,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    padding: "35px",
    borderRadius: "25px",
    cursor: "pointer",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
    marginBottom: "25px",
    transition: "0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    opacity: showCards ? 1 : 0,
    animation: showCards ? `slimyPop 1.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.4}s forwards` : "none",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.5)",
  });

  return (
    <div style={containerStyle}>
      <style>{animations}</style>

      {/* FIXED TOP HEADER */}
      <div style={headerBarStyle}>
        <h1 style={{ color: "#000", fontSize: "24px", fontWeight: 900, letterSpacing: "8px", margin: 0 }}>
          DRONE INTEL ANALYSIS
        </h1>
      </div>

      <div style={{ marginBottom: "50px", textAlign: "center" }}>
        <p style={{ letterSpacing: "10px", opacity: 0.5, fontSize: "12px", textTransform: "uppercase" }}>
          System // Command_Nexus
        </p>
      </div>

      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={getNavButtonStyle(0)}
          onClick={() => nav("/analysis")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.borderColor = NEON_PURPLE;
            e.currentTarget.style.boxShadow = `0 0 40px ${NEON_PURPLE}33`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
          }}
        >
          <span style={{ color: "#d8b4fe", fontSize: "10px", letterSpacing: "4px", display: "block", marginBottom: "10px" }}>MODULE_01</span>
          <span style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" }}>Intelligence Analysis</span>
        </div>

        <div
          style={getNavButtonStyle(1)}
          onClick={() => nav("/missions")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.borderColor = NEON_PURPLE;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
          }}
        >
          <span style={{ color: "#d8b4fe", fontSize: "10px", letterSpacing: "4px", display: "block", marginBottom: "10px" }}>MODULE_02</span>
          <span style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" }}>Mission Planning</span>
        </div>

        <div
          style={getNavButtonStyle(2)}
          onClick={() => nav("/live")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.borderColor = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
          }}
        >
          <span style={{ color: "#f87171", fontSize: "10px", letterSpacing: "4px", display: "block", marginBottom: "10px" }}>MODULE_03 // LIVE</span>
          <span style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" }}>Active Telemetry</span>
        </div>
      </div>

      {/* THE FIXED LAVENDER BOTTOM BAR */}
      <div style={{
        marginTop: "60px",
        width: "120px",
        height: "4px",
        background: HEADER_GRADIENT, // Reusing the established gradient
        borderRadius: "10px",
        boxShadow: `0 0 20px ${NEON_PURPLE}66`,
        opacity: 0.6
      }} />
    </div>
  );
}