import { Link } from "react-router-dom";

import { useMission } from "../context/MissionContext.tsx";

export default function Welcome() {
  const { draft, hasDraft, hasMissionId, hasRoute, runtime } = useMission();

  return (
    <section className="page page-welcome">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Autonomous Recon Workflow</p>
          <h1>Mission-control flow from a single entry point.</h1>
          <p className="page-lead">
            Run authentication, mission setup, terrain analysis, route planning, and live
            replanning from one guided console without changing URLs manually.
          </p>

          <div className="button-row">
            <Link className="button button-primary" to="/auth">
              Begin guided flow
            </Link>
            <Link className="button button-secondary" to={hasDraft ? "/setup" : "/auth"}>
              {hasDraft ? "Resume mission draft" : "Open auth"}
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-radar" />
          <div className="hero-stack">
            <article className="glass-panel stat-panel">
              <span className="mission-panel-label">Drone ID</span>
              <strong>{draft.drone_id}</strong>
            </article>
            <article className="glass-panel stat-panel">
              <span className="mission-panel-label">Analysis</span>
              <strong>{runtime.analysisResult ? "Cached" : "Pending"}</strong>
            </article>
            <article className="glass-panel stat-panel">
              <span className="mission-panel-label">Route</span>
              <strong>{hasRoute ? "Validated" : "Not planned"}</strong>
            </article>
            <article className="glass-panel stat-panel">
              <span className="mission-panel-label">Mission ID</span>
              <strong>{hasMissionId ? runtime.missionId : "Not created"}</strong>
            </article>
          </div>
        </div>
      </div>

      <div className="section-grid three-up">
        <article className="glass-panel">
          <p className="eyebrow">Step 01</p>
          <h3>Authenticate</h3>
          <p>Run signup or login against the existing backend and continue even if auth is offline.</p>
        </article>
        <article className="glass-panel">
          <p className="eyebrow">Step 02</p>
          <h3>Configure Mission</h3>
          <p>Persist uploaded image/video metadata plus start, goal, and bounds inputs to local mission state.</p>
        </article>
        <article className="glass-panel">
          <p className="eyebrow">Step 03</p>
          <h3>Execute Demo</h3>
          <p>Run analysis, plan the route, create the mission, and simulate a local replan live.</p>
        </article>
      </div>
    </section>
  );
}
