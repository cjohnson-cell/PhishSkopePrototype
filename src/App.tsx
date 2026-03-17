import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle,
  Mail,
  Zap,
  ChevronRight,
  AlertTriangle,
  Flame,
  Trophy,
  X,
  ShieldAlert,
} from "lucide-react";
import "./styles.css";

// 1. ADDED 'tier' TO THE DATABASE TO CATEGORIZE DIFFICULTY
const EMAIL_DATABASE = [
  {
    id: 1,
    app: "Okta",
    tier: 3,
    isPhish: true,
    sender: "security@okta-verify.co",
    subject: "⚠️ Urgent: New Login Detected",
    body: "A login from Moscow, RU was detected. Verify your identity now to prevent account lockout.",
    hidden: "Hidden Data: Root domain is .co (Fake). Real Okta uses okta.com.",
    lesson:
      "Look at the root domain! Attackers use .co or .net to mimic corporate portals.",
  },
  {
    id: 2,
    app: "Netskope",
    tier: 1,
    isPhish: false,
    sender: "rewards@netskope.com",
    subject: "Your Quarterly Swag Voucher!",
    body: "Congratulations! Use code SKOPE2026 for $50 off at the company store.",
    hidden:
      "Hidden Data: Valid netskope.com domain. Internal link structure verified.",
    lesson:
      "Not every reward is a threat! This came from a verified internal domain.",
  },
  {
    id: 3,
    app: "AWS",
    tier: 3,
    isPhish: true,
    sender: "no-reply@aws-console.security-check.io",
    subject: "Instance Limit Warning",
    body: "Your EC2 instances are being throttled due to billing issues. Sign in to update credentials.",
    hidden: "Hidden Data: The real domain is security-check.io, not AWS.",
    lesson:
      "The brand name at the start of a URL is a distraction. The tail end is the truth.",
  },
  {
    id: 4,
    app: "Gmail",
    tier: 1,
    isPhish: true,
    sender: "google-support@gmail-security.net",
    subject: "Storage Full: Action Required",
    body: "Your Google Workspace storage is at 99%. Upgrade now to avoid losing incoming emails.",
    hidden:
      "Hidden Data: Gmail/Google will never email you from a .net domain for billing.",
    lesson:
      "Storage warnings are high-pressure tactics used to force a quick, unthinking click.",
  },
  {
    id: 5,
    app: "Zoom",
    tier: 1,
    isPhish: false,
    sender: "no-reply@zoom.us",
    subject: "Meeting Invitation: Project Skope Update",
    body: "You have been invited to a scheduled meeting. Click below to join the lobby.",
    hidden:
      "Hidden Data: Verified zoom.us domain. Link matches official meeting patterns.",
    lesson:
      "Legitimate meeting invites will usually include a meeting ID and password.",
  },
  {
    id: 6,
    app: "Jira",
    tier: 2,
    isPhish: true,
    sender: "jira-notifications@atlassian-support.co",
    subject: "[JIRA] Issue Assigned: Security Vulnerability Patch",
    body: "A high-priority ticket has been assigned to you. Review the documentation here.",
    hidden:
      "Hidden Data: Spoofed atlassian domain. The link leads to a file-download site.",
    lesson:
      "Hackers use Jira notifications to trick technical staff into downloading malware.",
  },
  {
    id: 7,
    app: "Gemini",
    tier: 3,
    isPhish: true,
    sender: "ai-billing@gemini-google.biz",
    subject: "Action Required: Your Pro Subscription",
    body: "Your AI Plus payment failed. Click to update your card details to keep your access.",
    hidden:
      "Hidden Data: Gemini is a Google product; it uses google.com, not .biz.",
    lesson:
      "New, trending apps (like Gemini) are frequent targets for billing scams.",
  },
  {
    id: 8,
    app: "Lyra",
    tier: 3,
    isPhish: false,
    sender: "notifications@lyrahealth.com",
    subject: "New Care Message Received",
    body: "You have a secure message waiting for you in the Lyra Health portal.",
    hidden:
      "Hidden Data: Matches official healthcare portal domain and HTTPS certificate.",
    lesson:
      'Sensitive health apps use "Secure Message" alerts rather than putting info in email.',
  },
  {
    id: 9,
    app: "Sprout Social",
    tier: 2,
    isPhish: true,
    sender: "alerts@sproutsocial-analytics.com",
    subject: "Security Alert: Account Disconnected",
    body: "Your social media accounts have been disconnected. Re-authorize immediately.",
    hidden:
      "Hidden Data: sprout-social-analytics is a registered squatter domain.",
    lesson:
      "Social media management tools are goldmines for credentials. Always check the URL.",
  },
  {
    id: 10,
    app: "Expensify",
    tier: 2,
    isPhish: false,
    sender: "concierge@expensify.com",
    subject: "Report Approved: Q1 Travel",
    body: "Your expense report for the March offsite has been approved and reimbursed.",
    hidden: "Hidden Data: Authenticated via SPF/DKIM. Valid Expensify link.",
    lesson:
      'Correctly identifying safe emails prevents "Security Fatigue" and keeps you productive.',
  },
];

const BASE_LEADERBOARD = [
  { id: "npc1", name: "SecOps_Ninja", xp: 1450, acc: "98%" },
  { id: "npc2", name: "Alex_IT", xp: 1100, acc: "95%" },
  { id: "npc3", name: "Sarah.Dev", xp: 800, acc: "97%" },
  { id: "npc4", name: "Michael.HR", xp: 400, acc: "92%" },
  { id: "npc5", name: "Dwight.S", xp: 200, acc: "89%" },
];

export default function SkopeAwarenessStandalone() {
  const [username, setUsername] = useState("");
  const [xp, setXp] = useState(0);
  const [rank, setRank] = useState("IRON");
  const [streak, setStreak] = useState(0);
  // CHANGED: We now track challenges completed instead of a global index
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [inspectorActive, setInspectorActive] = useState(false);
  const [showRankUp, setShowRankUp] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const multiplier = streak >= 5 ? 3 : streak >= 3 ? 2 : 1;

  // 2. THE CONTENT SEQUENCER ENGINE
  const getDifficultyTier = (currentRank) => {
    if (currentRank === "IRON" || currentRank === "COPPER") return 1;
    if (currentRank === "BRONZE" || currentRank === "GOLD") return 2;
    return 3; // TITANIUM or APEX
  };

  const currentTier = getDifficultyTier(rank);
  const filteredEmails = EMAIL_DATABASE.filter(
    (email) => email.tier === currentTier
  );
  const activeEmail =
    filteredEmails[challengesCompleted % filteredEmails.length];

  // Dynamic Leaderboard
  const dynamicLeaderboard = [
    ...BASE_LEADERBOARD,
    {
      id: "me",
      name: username || "Guest_Investigator",
      xp: xp,
      acc: "100%",
      isMe: true,
    },
  ]
    .sort((a, b) => b.xp - a.xp)
    .map((user, index) => ({ ...user, rank: index + 1 }))
    .slice(0, 6);

  useEffect(() => {
    const getRank = (v) => {
      if (v < 200) return "IRON";
      if (v < 400) return "COPPER";
      if (v < 600) return "BRONZE";
      if (v < 800) return "GOLD";
      if (v < 1000) return "TITANIUM";
      return "APEX";
    };

    const newRank = getRank(xp);

    if (newRank !== rank && xp > 0) {
      setRank(newRank);
      setShowRankUp(true);
      const rankUpSound = new Audio(
        "https://actions.google.com/sounds/v1/science_fiction/power_up_flash.ogg"
      );
      rankUpSound.volume = 0.6;
      rankUpSound
        .play()
        .catch((error) => console.log("Audio playback failed:", error));
    }
  }, [xp, rank]);

  const handleDecision = (choice) => {
    const isCorrect =
      (choice === "PHISH" && activeEmail.isPhish) ||
      (choice === "SAFE" && !activeEmail.isPhish);
    if (isCorrect) {
      const xpGained = 100 * multiplier;
      setXp((prev) => prev + xpGained);
      setStreak((prev) => prev + 1);
      setFeedback({
        type: "success",
        text: `Correct! ${activeEmail.lesson} (+${xpGained} XP)`,
      });
    } else {
      setStreak(0);
      setFeedback({ type: "error", text: `Failed. ${activeEmail.lesson}` });
    }
  };

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-area">
          <Zap size={28} fill="currentColor" />
          <span
            style={{
              fontWeight: 900,
              fontSize: "1.5rem",
              letterSpacing: "-1px",
            }}
          >
            SKOPE_AWARE
          </span>
        </div>

        <div className="rank-section">
          <div className="rank-label">Investigator ID</div>
          <input
            type="text"
            className="username-input"
            placeholder="Enter Your Name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="rank-label">Current Rank</div>
          <h2 className="rank-title">{rank}</h2>

          <div className="xp-bar-container">
            <motion.div
              className="xp-bar-fill"
              animate={{ width: `${(xp % 200) / 2}%` }}
            />
          </div>

          {streak >= 3 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="streak-badge"
            >
              <Flame size={14} fill="currentColor" />
              <span>{multiplier}X MULTIPLIER</span>
            </motion.div>
          )}
          <div
            style={{
              fontSize: "10px",
              color: "#64748b",
              marginTop: "10px",
              fontWeight: 800,
            }}
          >
            STREAK: {streak} 🔥 | TOTAL: {xp} XP
          </div>
        </div>

        <button
          onClick={() => setInspectorActive(!inspectorActive)}
          className={`inspector-toggle ${
            inspectorActive ? "toggle-on" : "toggle-off"
          }`}
        >
          <Search size={20} />{" "}
          {inspectorActive ? "INSPECTOR ON" : "ENABLE INSPECTOR"}
        </button>

        <button
          onClick={() => setShowLeaderboard(true)}
          className="sidebar-btn-secondary"
        >
          <Trophy size={16} /> Global Leaderboard
        </button>
      </aside>

      {/* MAIN VIEW */}
      <main
        className="main-view"
        style={{ cursor: inspectorActive ? "none" : "default" }}
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        <header className="header">
          {/* 3. NEW THREAT LEVEL UI */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              color: "#64748b",
              fontSize: "0.875rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontWeight: 900,
                color:
                  currentTier === 1
                    ? "#10b981"
                    : currentTier === 2
                    ? "#f59e0b"
                    : "#ef4444",
              }}
            >
              <ShieldAlert size={16} />
              THREAT LEVEL:{" "}
              {currentTier === 1
                ? "EASY"
                : currentTier === 2
                ? "MEDIUM"
                : "HARD"}
            </div>
            <span>|</span>
            <div>
              Simulation:{" "}
              <strong style={{ color: "#0f172a" }}>{activeEmail.app}</strong>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              className="btn-base btn-safe"
              onClick={() => handleDecision("SAFE")}
            >
              Mark Safe
            </button>
            <button
              className="btn-base btn-phish"
              onClick={() => handleDecision("PHISH")}
            >
              Report Phish
            </button>
          </div>
        </header>

        <div className="reading-pane">
          <div className="email-paper">
            <h1 style={{ fontSize: "2rem", margin: "0 0 1.5rem 0" }}>
              {activeEmail.subject}
            </h1>
            <div
              style={{
                display: "flex",
                gap: "15px",
                borderBottom: "1px solid #f1f5f9",
                paddingBottom: "20px",
                marginBottom: "30px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background: "#f1f5f9",
                  borderRadius: "50%",
                }}
              />
              <div>
                <div style={{ fontWeight: 700 }}>{activeEmail.app} Support</div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    background: inspectorActive ? "#fef9c3" : "transparent",
                    color: inspectorActive ? "#854d0e" : "#64748b",
                  }}
                >
                  {inspectorActive ? activeEmail.hidden : activeEmail.sender}
                </div>
              </div>
            </div>
            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: "1.6",
                color: "#334155",
              }}
            >
              {activeEmail.body}
            </p>
          </div>

          {/* INSPECTOR MAGNIFIER */}
          {inspectorActive && (
            <motion.div
              className="magnifier"
              animate={{ x: mousePos.x - 120, y: mousePos.y - 120 }}
              transition={{ type: "tween", duration: 0 }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 900,
                  color: "#854d0e",
                  textTransform: "uppercase",
                }}
              >
                <Search size={24} style={{ marginBottom: "8px" }} />
                <br />
                Analyzing Trace Data...
              </div>
            </motion.div>
          )}
        </div>

        {/* FEEDBACK OVERLAY */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className={`feedback-banner ${
                feedback.type === "success" ? "bg-success" : "bg-error"
              }`}
            >
              <div
                style={{ display: "flex", gap: "20px", alignItems: "center" }}
              >
                {feedback.type === "success" ? (
                  <CheckCircle size={40} />
                ) : (
                  <AlertTriangle size={40} />
                )}
                <div>
                  <div style={{ fontWeight: 900, fontSize: "1.25rem" }}>
                    {feedback.type === "success"
                      ? "MISSION SUCCESS"
                      : "STREAK BROKEN"}
                  </div>
                  <div style={{ opacity: 0.9 }}>{feedback.text}</div>
                </div>
              </div>
              <button
                style={{
                  padding: "1rem 2rem",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: 800,
                  cursor: "pointer",
                  color: "#000",
                  background: "#fff",
                }}
                onClick={() => {
                  setFeedback(null);
                  setChallengesCompleted((prev) => prev + 1); // MOVE TO NEXT FILTERED EMAIL
                }}
              >
                Next Challenge
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* RANK UP OVERLAY */}
      <AnimatePresence>
        {showRankUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rank-up-overlay"
          >
            <motion.div
              style={{
                position: "absolute",
                width: "800px",
                height: "800px",
                background: "rgba(234, 179, 8, 0.15)",
                borderRadius: "50%",
                filter: "blur(100px)",
              }}
              animate={{ scale: [0.8, 1.2], opacity: [0.3, 0.8] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                repeatType: "reverse",
              }}
            />
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                color: "#eab308",
                fontWeight: 900,
                letterSpacing: "8px",
                textTransform: "uppercase",
                marginBottom: "1rem",
                zIndex: 10,
              }}
            >
              Rank Ascended
            </motion.p>
            <motion.h2
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.1,
              }}
              style={{
                color: "#ffffff",
                fontSize: "8rem",
                fontWeight: 900,
                fontStyle: "italic",
                textTransform: "uppercase",
                textShadow:
                  "0 0 50px rgba(234,179,8,0.8), 0 0 10px rgba(255,255,255,0.5)",
                margin: "0 0 3rem 0",
                zIndex: 10,
              }}
            >
              {rank}
            </motion.h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRankUp(false)}
              style={{
                padding: "1rem 3rem",
                background: "#eab308",
                color: "#000",
                border: "none",
                fontWeight: 900,
                fontSize: "1.2rem",
                cursor: "pointer",
                zIndex: 10,
                textTransform: "uppercase",
                letterSpacing: "2px",
                boxShadow: "0 0 20px rgba(234, 179, 8, 0.4)",
              }}
            >
              Accept Power
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL LEADERBOARD MODAL */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="leaderboard-overlay"
            onClick={() => setShowLeaderboard(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="leaderboard-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-btn"
                onClick={() => setShowLeaderboard(false)}
              >
                <X size={24} />
              </button>
              <div className="leaderboard-header">
                <h2 className="leaderboard-title">Apex Protocol</h2>
                <div className="leaderboard-subtitle">
                  Live Global Investigator Rankings
                </div>
              </div>

              <div className="leaderboard-list">
                {dynamicLeaderboard.map((user) => (
                  <motion.div
                    key={user.id}
                    className={`leaderboard-item ${user.isMe ? "is-me" : ""} ${
                      user.rank <= 3 && !user.isMe ? "elite" : ""
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: user.rank * 0.1 }}
                  >
                    <div className={`leaderboard-rank rank-${user.rank}`}>
                      #{user.rank}
                    </div>
                    <div className="leaderboard-name">
                      {user.name} {user.isMe && "(You)"}
                    </div>
                    <div className="leaderboard-stats">
                      <div className="leaderboard-xp">
                        {user.xp.toLocaleString()} XP
                      </div>
                      <div className="leaderboard-acc">{user.acc} Accuracy</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
