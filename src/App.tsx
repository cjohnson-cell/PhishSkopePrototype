import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle,
  Zap,
  AlertTriangle,
  Flame,
  Trophy,
  X,
  ShieldAlert,
  Target,
  Lock,
  MailOpen,
  Fingerprint,
} from "lucide-react";
import DOMPurify from "dompurify";
import "./styles.css";

// ==========================================
// UNIVERSAL EVIDENCE DATABASE
// 16 Cases (Mixed Tiers, Mixed Safe/Phish)
// ==========================================
const EMAIL_DATABASE = [
  // --- TIER 1: BEGINNER (4 IoCs - Very Sloppy) ---
  {
    id: 107,
    app: "Gmail",
    tier: 1,
    isPhish: true,
    sender: "security-alert@gmail-support-desk-update.info",
    subject: "WARNING: Your Inbox Has a Virus",
    body: `
      <div style="font-family: Roboto, Arial, sans-serif; max-width: 600px; border: 1px solid #dadce0; border-radius: 8px;">
        <div style="padding: 24px; border-bottom: 1px solid #dadce0;"><span style="color: #ea4335; font-size: 24px; font-weight: bold;">Google Support</span></div>
        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="font-size: 20px; color: #202124; margin-top: 0;">Infection Detected</h2>
          <p style="color: #3c4043; font-size: 14px;">
            <span data-ioc-id="ioc-greeting" data-ioc-text="Generic Greeting: Google will never address you as 'Dear Email Owner'.">Dear Email Owner,</span>
          </p>
          <p style="color: #3c4043; font-size: 14px;">
            <span data-ioc-id="ioc-urgency" data-ioc-text="Absurd Threat: Cloud-based inboxes do not 'catch viruses' that require you to download cleaner files.">Our servers detected a trojan virus in your inbox. You must download the cleaner tool immediately or your account will be deleted in 1 hour.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Payload: Link points to a raw IP address hosting an executable virus file (.exe)." style="display: inline-block; background-color: #ea4335; color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 4px; font-weight: 500;">Download Google_Cleaner.exe</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Spoofed Domain: Uses a fake '.info' domain instead of google.com.",
      },
      {
        id: "ioc-greeting",
        text: "Generic Greeting: Google will never address you as 'Dear Email Owner'.",
      },
      {
        id: "ioc-urgency",
        text: "Absurd Threat: Cloud-based inboxes do not 'catch viruses' that require you to download cleaner files.",
      },
      {
        id: "ioc-link",
        text: "Malicious Payload: Link points to a raw IP address hosting an executable virus file (.exe).",
      },
    ],
    lesson:
      "Beginner phishing relies on sheer panic, generic greetings, and obvious malicious file downloads.",
  },

  // --- TIER 2: EASY (3 IoCs - Safe Muscle Memory) ---
  {
    id: 108,
    app: "Sprout Social",
    tier: 2,
    isPhish: false,
    sender: "notifications@sproutsocial.com",
    subject: "Your Weekly Social Analytics Report is Ready",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e5e5e5; border-radius: 4px;">
        <div style="background-color: #00A650; padding: 20px;"><strong style="color: #ffffff; font-size: 22px;">Sprout Social</strong></div>
        <div style="padding: 20px; background-color: #ffffff;">
          <h2 style="font-size: 18px; color: #333333;">Weekly Performance Summary</h2>
          <p style="color: #555555; font-size: 14px;">
            <span data-ioc-id="ioc-context" data-ioc-text="Routine Workflow: Weekly automated performance summaries are a standard feature of social media management platforms.">Your social performance metrics for the past week have been compiled. Engagement is up 12% across all connected profiles.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Secure Link: Safely routes directly to your authenticated Sprout Social analytics dashboard." style="display: inline-block; background-color: #00A650; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Full Report</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Verified Domain: sproutsocial.com is the authorized corporate domain.",
      },
      {
        id: "ioc-context",
        text: "Routine Workflow: Weekly automated performance summaries are a standard feature of social media management platforms.",
      },
      {
        id: "ioc-link",
        text: "Secure Link: Safely routes directly to your authenticated Sprout Social analytics dashboard.",
      },
    ],
    lesson:
      "Safe, routine reporting emails lack urgency, use accurate domains, and route to trusted internal dashboards.",
  },

  // --- TIER 3: MEDIUM (3 IoCs - Standard Corporate Spoofs) ---
  {
    id: 109,
    app: "Marketo",
    tier: 3,
    isPhish: true,
    sender: "alerts@marketo-engages.com",
    subject: "Alert: Q3 Email Campaign Failed to Send",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e0e0e0;">
        <div style="background-color: #5C4C9F; padding: 15px 20px;"><strong style="color: #ffffff; font-size: 22px;">Marketo Engage</strong></div>
        <div style="padding: 25px;">
          <h2 style="font-size: 18px; margin-top: 0;">Campaign Sync Error</h2>
          <p style="color: #666666; font-size: 14px;">
            <span data-ioc-id="ioc-fear" data-ioc-text="Role-Specific Panic: Designed to terrify marketers that a major campaign has halted.">The scheduled deployment for "Q3 Enterprise Outreach" failed due to an expired API token.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Link: Connects to a fake login portal to steal marketing automation credentials." style="display: inline-block; background-color: #5C4C9F; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Re-Authenticate API</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Typosquatting: Domain adds an 's' and a hyphen (marketo-engages.com). Real domain is marketo.com.",
      },
      {
        id: "ioc-fear",
        text: "Role-Specific Panic: Designed to terrify marketers that a major campaign has halted.",
      },
      {
        id: "ioc-link",
        text: "Malicious Link: Connects to a fake login portal to steal marketing automation credentials.",
      },
    ],
    lesson:
      "Medium threats target specific job roles with tool-specific errors to bypass suspicion and force a hasty login.",
  },

  // --- TIER 4: ADVANCED (3 IoCs - Subtle Workflow Exploits) ---
  {
    id: 110,
    app: "6sense",
    tier: 4,
    isPhish: true,
    sender: "intelligence@6sense.com.data-sync.net",
    subject: "High Intent Alert: Target Account Surging",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #F37021; padding: 20px;"><strong style="color: #ffffff; font-size: 22px;">6sense</strong></div>
        <div style="padding: 20px;">
          <h2 style="font-size: 18px; color: #333333;">Account Surging</h2>
          <p style="color: #555555; font-size: 14px;">
             <span data-ioc-id="ioc-fomo" data-ioc-text="FOMO Trigger: Exploits a salesperson's fear of missing out on a hot lead to force a click.">A tier-1 target account has entered the 'Purchase' stage based on recent web activity. View their intent footprint immediately to engage.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Redirect: The button links to data-sync.net, a credential harvester, rather than 6sense.com." style="display: inline-block; background-color: #F37021; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Account Data</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Subdomain Masking: The real domain is data-sync.net. 6sense.com is just a fake subdomain prefix.",
      },
      {
        id: "ioc-fomo",
        text: "FOMO Trigger: Exploits a salesperson's fear of missing out on a hot lead to force a click.",
      },
      {
        id: "ioc-link",
        text: "Malicious Redirect: The button links to data-sync.net, a credential harvester, rather than 6sense.com.",
      },
    ],
    lesson:
      "Advanced threats clone workflows perfectly and use deep sub-domain masking to hide the true sender.",
  },

  // --- TIER 5: PRO (2 IoCs - Subtle Typosquatting) ---
  {
    id: 111,
    app: "FloQast",
    tier: 5,
    isPhish: true,
    sender: "system@fioqast.com",
    subject: "ERP Disconnect - Trial Balance Out of Sync",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 6px;">
        <div style="background-color: #2D3E50; padding: 20px; text-align: center;"><strong style="color: #ffffff; font-size: 24px;">FloQast</strong></div>
        <div style="padding: 25px; background-color: #ffffff;">
          <h2 style="font-size: 18px; color: #d9534f; margin-top: 0;">API Disconnected</h2>
          <p style="color: #333333; font-size: 14px;">
             <span data-ioc-id="ioc-context" data-ioc-text="High-Stress Exploitation: Targets accountants specifically during high-stress periods like month-end close.">An automated sync error occurred between your ERP and FloQast during the month-end close checklist.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Link: Connects to the typosquatted fioqast.com domain to steal financial credentials." style="display: inline-block; background-color: #d9534f; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Re-Authenticate ERP Token</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Visual Deception: Uses 'fioqast' (with an 'i') instead of 'floqast' (with an 'l').",
      },
      {
        id: "ioc-context",
        text: "High-Stress Exploitation: Targets accountants specifically during high-stress periods like month-end close.",
      },
    ],
    lesson:
      "Pro threats use flawless formatting and incredibly subtle typosquats (like an 'i' instead of an 'l') to trick professionals.",
  },

  // --- TIER 6: IMPOSSIBLE (2 IoCs - Subdomain Masking & Executive Panic) ---
  {
    id: 112,
    app: "Uptempo",
    tier: 6,
    isPhish: true,
    sender: "finance@uptempo.io.auth-sso.com",
    subject: "WARNING: Q4 Marketing Budget Frozen",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #00B36B; padding: 20px;"><strong style="color: #ffffff; font-size: 22px;">Uptempo</strong></div>
        <div style="padding: 20px;">
          <h2 style="font-size: 18px; color: #333333;">Spend Halt Initiated</h2>
          <p style="color: #555555; font-size: 14px;">
             <span data-ioc-id="ioc-context" data-ioc-text="Executive Panic: Threat actors simulate high-level executive actions (like budget freezes) to trigger sheer panic.">The CFO has mandated an immediate freeze on all uncommitted Q4 marketing spend. Please review the attached line items that have been flagged for cancellation.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Redirect: Button routes to auth-sso.com to hijack the user's active SSO session." style="display: inline-block; background-color: #00B36B; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Review Flagged Spend</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Subdomain Masking: The real domain is auth-sso.com. Uptempo.io is just a subdomain prefix.",
      },
      {
        id: "ioc-context",
        text: "Executive Panic: Threat actors simulate high-level executive actions (like budget freezes) to trigger sheer panic.",
      },
    ],
    lesson:
      "Impossible threats combine deep sub-domain masking with simulated executive actions to completely bypass your suspicion.",
  },

  {
    id: 101,
    app: "Microsoft 365",
    tier: 1,
    isPhish: true,
    sender: "security@m1cr0soft-alerts.com",
    subject: "URGENT: Password Expiry Notification",
    body: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #0078D4; padding: 20px;"><strong style="color: #ffffff; font-size: 22px;">Microsoft 365</strong></div>
        <div style="padding: 20px; background-color: #ffffff;">
          <h2 style="font-size: 18px; color: #333333;">Action Required: Password Expiry</h2>
          <p style="color: #555555; font-size: 14px;">
            <span data-ioc-id="ioc-greeting" data-ioc-text="Generic Greeting: Microsoft will never address you as 'Dear Mailbox User'.">Dear Mailbox User,</span>
          </p>
          <p style="color: #555555; font-size: 14px;">
            <span data-ioc-id="ioc-urgency" data-ioc-text="Urgency Hook: Forcing a 2-hour deadline creates panic to make you click without thinking.">Your corporate email password will expire in exactly 2 hours. If you do not update it, you will be permanently locked out of your inbox and Teams.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Link: The button points to a fake credential harvester, not login.microsoftonline.com." style="display: inline-block; background-color: #0078D4; color: #ffffff; padding: 12px 20px; text-decoration: none; font-weight: bold; border-radius: 4px;">Keep Same Password</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Spoofed Domain: 'm1cr0soft' uses a '1' and a '0' instead of 'i' and 'o'.",
      },
      {
        id: "ioc-greeting",
        text: "Generic Greeting: Microsoft will never address you as 'Dear Mailbox User'.",
      },
      {
        id: "ioc-urgency",
        text: "Urgency Hook: Forcing a 2-hour deadline creates panic to make you click without thinking.",
      },
      {
        id: "ioc-link",
        text: "Malicious Link: The button points to a fake credential harvester, not login.microsoftonline.com.",
      },
    ],
    lesson:
      "Beginner phishing relies on sheer panic, generic greetings, and obvious spelling errors in the sender address.",
  },

  // --- TIER 2: EASY (3 IoCs - Generic Lures) ---
  {
    id: 102,
    app: "Slack",
    tier: 2,
    isPhish: true,
    sender: "notifications@slack-messages.net",
    subject: "You have (3) unread direct messages",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e5e5e5; border-radius: 8px;">
        <div style="padding: 20px; border-bottom: 1px solid #e5e5e5;"><strong style="color: #4A154B; font-size: 24px;">slack</strong></div>
        <div style="padding: 20px; background-color: #ffffff;">
          <h2 style="font-size: 18px; color: #1D1C1D; margin-top: 0;">New messages are waiting</h2>
          <p style="color: #616061; font-size: 14px;">
            <span data-ioc-id="ioc-context" data-ioc-text="Vague Context: Attackers use vague 'important updates' to trigger FOMO (Fear of Missing Out).">You missed 3 direct messages regarding the new project updates. Please review them before the end of the day.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Link: Routes to a fake Slack login page to steal your SSO credentials." style="display: inline-block; background-color: #007A5A; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Messages</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Spoofed Domain: Slack uses slack.com, not slack-messages.net.",
      },
      {
        id: "ioc-context",
        text: "Vague Context: Attackers use vague 'important updates' to trigger FOMO (Fear of Missing Out).",
      },
      {
        id: "ioc-link",
        text: "Malicious Link: Routes to a fake Slack login page to steal your SSO credentials.",
      },
    ],
    lesson:
      "Easy threats spoof popular collaboration tools. Always check the sender domain before logging in to view 'missed' messages.",
  },

  // --- TIER 3: MEDIUM (3 IoCs - Safe Muscle Memory) ---
  {
    id: 103,
    app: "Workday",
    tier: 3,
    isPhish: false,
    sender: "myworkday@workday.com",
    subject: "Approved: Time Off Request",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e5e5e5; border-radius: 8px;">
        <div style="background-color: #005CB9; padding: 20px; text-align: center;"><strong style="color: #ffffff; font-size: 24px;">workday.</strong></div>
        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="font-size: 18px; color: #333333; margin-top: 0;">Absence Request Approved</h2>
          <p style="color: #555555; font-size: 14px;">
            <span data-ioc-id="ioc-context" data-ioc-text="Expected Workflow: PTO approvals are routine, automated HR notifications.">Your manager has approved your upcoming Paid Time Off (PTO) request. Your balance has been updated.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Secure Link: Safely routes directly to your authenticated Workday tenant." style="display: inline-block; background-color: #005CB9; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 20px; font-weight: bold;">View Absence Balance</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Verified Domain: workday.com is the authorized HR routing domain.",
      },
      {
        id: "ioc-context",
        text: "Expected Workflow: PTO approvals are routine, automated HR notifications.",
      },
      {
        id: "ioc-link",
        text: "Secure Link: Safely routes directly to your authenticated Workday tenant.",
      },
    ],
    lesson:
      "Safe, routine HR notifications use exact corporate domains and lack high-pressure urgency.",
  },

  // --- TIER 4: ADVANCED (3 IoCs - Workflow Exploits) ---
  {
    id: 104,
    app: "DocuSign",
    tier: 4,
    isPhish: true,
    sender: "dse@docusign.net.signature-auth.com",
    subject: "Please DocuSign: Employee Severance Agreement 2026.pdf",
    body: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; border: 1px solid #ECEAE5; border-radius: 4px;">
        <div style="padding: 20px; background-color: #000000; text-align: left;"><strong style="color: #FFCE00; font-size: 22px;">DocuSign</strong></div>
        <div style="padding: 30px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #333333;"><strong>HR Department</strong> sent you a document to review and sign.</p>
          <p style="font-size: 14px; color: #555555;">
             <span data-ioc-id="ioc-context" data-ioc-text="Psychological Trap: 'Severance Agreement' creates sheer terror, overriding logical thinking.">Please review the attached Severance Agreement and Non-Compete clause. Signature is required by EOD.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Redirect: Button routes to signature-auth.com to steal your Microsoft 365 login." style="display: inline-block; background-color: #005CB9; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 2px; font-weight: bold;">Review Document</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Subdomain Masking: The real domain is signature-auth.com, not docusign.net.",
      },
      {
        id: "ioc-context",
        text: "Psychological Trap: 'Severance Agreement' creates sheer terror, overriding logical thinking.",
      },
      {
        id: "ioc-link",
        text: "Malicious Redirect: Button routes to signature-auth.com to steal your Microsoft 365 login.",
      },
    ],
    lesson:
      "Advanced attackers weaponize HR documents (like severance packages) because the fear guarantees a click.",
  },

  // --- TIER 5: PRO (2 IoCs - Subtle Typosquatting) ---
  {
    id: 105,
    app: "Salesforce",
    tier: 5,
    isPhish: true,
    sender: "approvals@salesf0rce.com",
    subject: "Deal Approval Required: Enterprise Expansion",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #00A1E0; padding: 20px;"><strong style="color: #ffffff; font-size: 22px;">Salesforce</strong></div>
        <div style="padding: 20px;">
          <h2 style="font-size: 18px; color: #333333;">Discount Approval Requested</h2>
          <p style="color: #555555; font-size: 14px;">Your Sales Rep has requested a 25% discount approval for the Enterprise Expansion deal. The customer is waiting for the contract to sign today.</p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Link: Connects to the typosquatted salesf0rce.com domain to steal CRM access." style="display: inline-block; background-color: #00A1E0; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Review & Approve in CPQ</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Visual Deception: Uses 'salesf0rce' with a zero instead of an 'o'.",
      },
      {
        id: "ioc-link",
        text: "Malicious Link: Connects to the typosquatted salesf0rce.com domain to steal CRM access.",
      },
    ],
    lesson:
      "Pro threats use flawless formatting and incredibly subtle typosquats (like a zero instead of an 'o') to trick executives.",
  },

  // --- TIER 6: IMPOSSIBLE (2 IoCs - Vishing/Deepfake Lure) ---
  {
    id: 106,
    app: "Microsoft Teams",
    tier: 6,
    isPhish: true,
    sender: "voicemail@teams.microsoft.com.vmail-gateway.co",
    subject: "Missed Conversation with the CEO",
    body: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; border: 1px solid #e5e5e5; border-radius: 6px;">
        <div style="padding: 20px; text-align: center; border-bottom: 1px solid #e5e5e5; background-color: #F3F2F1;"><strong style="color: #6264A7; font-size: 24px;">Microsoft Teams</strong></div>
        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="font-size: 18px; color: #252423; margin-top: 0;">You have a new voice message</h2>
          <p style="color: #605E5C; font-size: 14px;">
            <span data-ioc-id="ioc-context" data-ioc-text="Vishing Lure: Attackers use fake audio messages from executives to bypass text-based filters.">The CEO attempted to reach you on Teams and left a 0:45s secure audio memo regarding the Q3 financials.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Payload: Clicking 'Play' downloads a malware executable masked as an audio file." style="display: inline-block; background-color: #6264A7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 600;">▶ Play Audio Message</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Subdomain Masking: The real domain is vmail-gateway.co. Microsoft Teams is just a prefix.",
      },
      {
        id: "ioc-context",
        text: "Vishing Lure: Attackers use fake audio messages from executives to bypass text-based filters.",
      },
    ],
    lesson:
      "Impossible threats simulate audio or video messages (Vishing) from high-ranking officials to completely bypass your suspicion.",
  },
  {
    id: 1,
    app: "Expensify",
    tier: 1,
    isPhish: false,
    sender: "receipts@expensify.com",
    subject: "Action Required: Unmapped Receipt",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="background-color: #02203c; padding: 24px; text-align: center;">
          <strong style="color: #46e89a; font-size: 28px;">Expensify</strong>
        </div>
        <div style="padding: 32px; background-color: #ffffff;">
          <h2 style="font-size: 20px; color: #0f172a; margin-top: 0;">A receipt is missing a category</h2>
          <p style="color: #475569; font-size: 15px;">
            <span data-ioc-id="ioc-context" data-ioc-text="Routine Notification: Missing categories are a standard automated alert in expense software.">A recent Uber receipt from March 12th could not be mapped to an active expense policy.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Standard Link: Destination URL correctly matches the secure expensify.com portal." style="display: inline-block; background-color: #46e89a; color: #02203c; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: 700;">Review Receipt</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Verified Domain: expensify.com is the official routing domain.",
      },
      {
        id: "ioc-context",
        text: "Routine Notification: Missing categories are a standard automated alert in expense software.",
      },
      {
        id: "ioc-link",
        text: "Standard Link: Destination URL correctly matches the secure expensify.com portal.",
      },
    ],
    lesson:
      "Authentic emails use precise domains, standard context, and route to known, secure application portals.",
  },
  {
    id: 2,
    app: "Navan",
    tier: 1,
    isPhish: true,
    sender: "support@navan-travel-update.com",
    subject: "Urgent: Flight Cancellation - ORD to SFO",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #F26D64; padding: 20px;"><h1 style="color: #ffffff; margin: 0; font-size: 24px;">Navan</h1></div>
        <div style="padding: 20px; background-color: #ffffff;">
          <h2 style="font-size: 18px; color: #333333;">Action Required: Itinerary Change</h2>
          <p style="color: #555555; font-size: 14px;">
            <span data-ioc-id="ioc-urgency" data-ioc-text="Urgency Hook: Travel disruptions create immediate panic to force a quick click.">Your upcoming flight (UA 1204) from Chicago (ORD) to San Francisco (SFO) has been canceled.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Link: Destination URL routes to a fake rebooking portal to steal credentials." style="display: inline-block; background-color: #F26D64; color: #ffffff; padding: 12px 20px; text-decoration: none; font-weight: bold; border-radius: 4px;">Rebook Flight</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Spoofed Domain: navan-travel-update.com is fake. Navan officially uses navan.com.",
      },
      {
        id: "ioc-urgency",
        text: "Urgency Hook: Travel disruptions create immediate panic to force a quick click.",
      },
      {
        id: "ioc-link",
        text: "Malicious Link: Destination URL routes to a fake rebooking portal to steal credentials.",
      },
    ],
    lesson:
      'Travel disruptions create immediate panic. Always verify the sender domain before clicking "Rebook".',
  },
  {
    id: 3,
    app: "Zoom",
    tier: 1,
    isPhish: false,
    sender: "no-reply@zoom.us",
    subject: "Meeting Summary: Weekly Sync",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e5e5e5; border-radius: 6px;">
        <div style="padding: 20px; text-align: center; border-bottom: 1px solid #e5e5e5;"><strong style="color: #0B5CFF; font-size: 26px;">zoom</strong></div>
        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="font-size: 18px; color: #222222; margin-top: 0;">Your cloud recording is ready</h2>
          <p style="color: #666666; font-size: 14px;">
            <span data-ioc-id="ioc-context" data-ioc-text="Routine Notification: Automated retention warnings are standard practice and expected.">The cloud recording for "Weekly Product Sync" is now available for 30 days.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Secure Link: Destination URL matches the authenticated zoom.us domain." style="display: inline-block; background-color: #0B5CFF; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">View Recording</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Verified Domain: zoom.us is the official Zoom routing domain.",
      },
      {
        id: "ioc-context",
        text: "Routine Notification: Automated retention warnings are standard practice and expected.",
      },
      {
        id: "ioc-link",
        text: "Secure Link: Destination URL matches the authenticated zoom.us domain.",
      },
    ],
    lesson:
      "Automated platform emails from verified root domains with standard retention warnings are generally safe.",
  },
  {
    id: 10,
    app: "Netskope Store",
    tier: 1,
    isPhish: false,
    sender: "orders@netskope.com",
    subject: "Your Order #4992 has Shipped",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #FF8F1C; padding: 20px;"><strong style="color: #ffffff; font-size: 22px;">Netskope Store</strong></div>
        <div style="padding: 20px; background-color: #ffffff;">
          <p style="color: #333333; font-size: 15px;">
            <span data-ioc-id="ioc-context" data-ioc-text="Standard Notification: Routine e-commerce shipment updates are expected.">Great news! Your recent company swag order has been shipped via FedEx.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Secure Link: Routes directly to the official FedEx tracking portal." style="display: inline-block; background-color: #FF8F1C; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Track Package</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Verified Domain: netskope.com is the official corporate domain.",
      },
      {
        id: "ioc-context",
        text: "Standard Notification: Routine e-commerce shipment updates are expected.",
      },
      {
        id: "ioc-link",
        text: "Secure Link: Routes directly to the official FedEx tracking portal.",
      },
    ],
    lesson:
      "Shipping notifications from verified corporate domains are typical, safe operations.",
  },
  {
    id: 11,
    app: "Gemini",
    tier: 1,
    isPhish: true,
    sender: "billing@gemini-ai-upgrade.com",
    subject: "Gemini Advanced Subscription Expired",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #dadce0; border-radius: 8px;">
        <div style="padding: 20px; border-bottom: 1px solid #dadce0;"><strong style="color: #1a73e8; font-size: 22px;">Gemini</strong></div>
        <div style="padding: 20px; background-color: #ffffff;">
          <p style="color: #3c4043; font-size: 14px;">
            <span data-ioc-id="ioc-threat" data-ioc-text="Payment Threat: False claims about failed payments trick users into entering credit card info.">Your access to Gemini Advanced has expired due to a failed payment method on your corporate card.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Link: Connects to a fraudulent payment processing screen." style="display: inline-block; background-color: #1a73e8; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Update Payment Info</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Spoofed Domain: gemini-ai-upgrade.com is fake. Official communications use google.com.",
      },
      {
        id: "ioc-threat",
        text: "Payment Threat: False claims about failed payments trick users into entering credit card info.",
      },
      {
        id: "ioc-link",
        text: "Malicious Link: Connects to a fraudulent payment processing screen.",
      },
    ],
    lesson:
      "Attackers target popular AI tool subscriptions to steal corporate credit card numbers.",
  },

  // --- TIER 2 ---
  {
    id: 4,
    app: "Asana",
    tier: 2,
    isPhish: true,
    sender: "notifications@asana-workspace.net",
    subject: 'Alex assigned you a task: "Q3 Budget Review"',
    body: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; border: 1px solid #ECEAE5; border-radius: 8px;">
        <div style="padding: 30px; text-align: center; border-bottom: 1px solid #ECEAE5;"><h2 style="color: #F06A6A; margin: 0; font-size: 28px;">asana</h2></div>
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #1E1F21;"><strong>Alex</strong> assigned you a new task in the <strong>Finance Leadership</strong> project.</p>
          <p style="font-size: 14px; color: #555555;">
             <span data-ioc-id="ioc-attachment" data-ioc-text="Suspicious Payload: Task notification emails do not typically contain executable file downloads.">Please review the attached Q3_Budget_Draft.exe file before commenting.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Link: Button triggers a malware download instead of opening the Asana app." style="display: inline-block; background-color: #F06A6A; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Download Budget File</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Spoofed Domain: asana-workspace.net is fake. Official Asana uses asana.com.",
      },
      {
        id: "ioc-attachment",
        text: "Suspicious Payload: Task notification emails do not typically contain executable file downloads.",
      },
      {
        id: "ioc-link",
        text: "Malicious Link: Button triggers a malware download instead of opening the Asana app.",
      },
    ],
    lesson:
      "Project management tool notifications often trigger immediate action. Verify the sender domain and never download .exe files.",
  },
  {
    id: 5,
    app: "Greenhouse",
    tier: 2,
    isPhish: false,
    sender: "no-reply@greenhouse.io",
    subject: "Reminder: Submit Feedback for Software Engineer candidate",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #d9d9d9; border-radius: 4px;">
        <div style="background-color: #00B2A9; padding: 20px; text-align: center;"><strong style="color: #ffffff; font-size: 22px;">greenhouse</strong></div>
        <div style="padding: 25px;">
          <p style="color: #333333; font-size: 15px;">
             <span data-ioc-id="ioc-context" data-ioc-text="Expected Workflow: Interview scorecards are a standard follow-up after a candidate meeting.">You recently interviewed a candidate for the Software Engineer role. Please take a few minutes to complete your scorecard.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Secure Link: Routes correctly to the internal Greenhouse applicant tracking system." style="display: inline-block; background-color: #00B2A9; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Fill Out Scorecard</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Verified Domain: greenhouse.io is the official application domain.",
      },
      {
        id: "ioc-context",
        text: "Expected Workflow: Interview scorecards are a standard follow-up after a candidate meeting.",
      },
      {
        id: "ioc-link",
        text: "Secure Link: Routes correctly to the internal Greenhouse applicant tracking system.",
      },
    ],
    lesson:
      "Standard HR workflow reminders from verified root domains are safe and should not be flagged.",
  },
  {
    id: 9,
    app: "Jira",
    tier: 2,
    isPhish: true,
    sender: "jira@atlassian.net.task-update.com",
    subject: "[JIRA] (SEC-409) Urgent: Rotate Production API Keys",
    body: `
      <div style="font-family: -apple-system, sans-serif; color: #172b4d; padding: 20px; border: 1px solid #dfe1e6; border-radius: 3px; max-width: 600px;">
        <div style="border-bottom: 1px solid #dfe1e6; padding-bottom: 15px; margin-bottom: 15px;"><h1 style="color: #0052cc; margin: 0; font-size: 24px;">ATLASSIAN</h1></div>
        <h2 style="font-size: 20px; margin-top: 0;">Sarah Jenkins mentioned you on SEC-409</h2>
        <p style="background: #f4f5f7; padding: 12px; border-left: 2px solid #0052cc;">
          <span data-ioc-id="ioc-context" data-ioc-text="High-Value Target Hook: Attackers simulate internal figures to bypass suspicion with social proof.">"Hey, AWS alerted us that our staging keys might have leaked. Can you rotate the production keys immediately?"</span>
        </p>
        <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Redirect: The button links to task-update.com, a credential harvester, rather than atlassian.net." style="display: inline-block; background: #0052cc; color: #ffffff; padding: 10px 16px; text-decoration: none; border-radius: 3px;">View Issue & Rotate Keys</a>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Spoofed Sender: The root domain is task-update.com. Official Atlassian mail comes from atlassian.net.",
      },
      {
        id: "ioc-context",
        text: "High-Value Target Hook: Attackers simulate internal figures to bypass suspicion with social proof.",
      },
      {
        id: "ioc-link",
        text: "Malicious Redirect: The button links to task-update.com, a credential harvester, rather than atlassian.net.",
      },
    ],
    lesson:
      "The interface perfectly clones the Jira design, but the sender domain and button destination reveal the credential harvesting attempt.",
  },
  {
    id: 12,
    app: "BriefingSource",
    tier: 2,
    isPhish: false,
    sender: "scheduler@briefingsource.com",
    subject: "New Briefing Added to Your Calendar",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="padding: 20px; border-bottom: 2px solid #0056b3;"><strong style="color: #0056b3; font-size: 22px;">BriefingSource</strong></div>
        <div style="padding: 20px; background-color: #ffffff;">
          <p style="color: #333333; font-size: 14px;">
            <span data-ioc-id="ioc-context" data-ioc-text="Routine Scheduling: Automated calendar notifications for events are safe standard practice.">You have been added as a presenter for the upcoming Executive Briefing Center (EBC) visit on Thursday.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Secure Link: Points to the verified briefing calendar platform." style="display: inline-block; background-color: #0056b3; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Agenda</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Verified Domain: briefingsource.com is the authorized scheduling domain.",
      },
      {
        id: "ioc-context",
        text: "Routine Scheduling: Automated calendar notifications for events are safe standard practice.",
      },
      {
        id: "ioc-link",
        text: "Secure Link: Points to the verified briefing calendar platform.",
      },
    ],
    lesson:
      "Calendar and scheduling alerts from verified domains are typical, safe corporate workflows.",
  },
  {
    id: 13,
    app: "Marketo",
    tier: 2,
    isPhish: true,
    sender: "alerts@marketo.com.campaign-sync.net",
    subject: "Alert: Q3 Email Campaign Failed to Send",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e0e0e0;">
        <div style="background-color: #5C4C9F; padding: 15px 20px;"><strong style="color: #ffffff; font-size: 22px;">Marketo Engage</strong></div>
        <div style="padding: 25px;">
          <h2 style="font-size: 18px; margin-top: 0;">Campaign Sync Error</h2>
          <p style="color: #666666; font-size: 14px;">
            <span data-ioc-id="ioc-fear" data-ioc-text="Role-Specific Panic: Designed to terrify marketers that a major campaign has halted.">The scheduled deployment for "Q3 Enterprise Outreach" failed due to an expired Salesforce API token.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Link: Connects to campaign-sync.net to steal marketing API credentials." style="display: inline-block; background-color: #5C4C9F; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Re-Authenticate API</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Subdomain Masking: Domain is campaign-sync.net, not marketo.com.",
      },
      {
        id: "ioc-fear",
        text: "Role-Specific Panic: Designed to terrify marketers that a major campaign has halted.",
      },
      {
        id: "ioc-link",
        text: "Malicious Link: Connects to campaign-sync.net to steal marketing API credentials.",
      },
    ],
    lesson:
      "Attackers target specific roles with tool-specific errors to force a hasty, panicked login.",
  },

  // --- TIER 3 ---
  {
    id: 6,
    app: "Okta",
    tier: 3,
    isPhish: true,
    sender: "system@okta.com.auth-sync.co",
    subject: "Okta Verify: Background Sync Initiated",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e5e5e5; border-radius: 4px;">
        <div style="background-color: #f5f5f6; padding: 20px; border-bottom: 1px solid #e5e5e5;"><h1 style="color: #007dc1; margin: 0; font-size: 22px;">okta</h1></div>
        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="font-size: 18px; margin-top: 0;">MFA Background Sync in Progress</h2>
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0;">
            <p style="margin: 0; color: #856404; font-size: 14px; font-weight: 500;">
              <span data-ioc-id="ioc-fatigue" data-ioc-text="MFA Fatigue Trap: Instructing users to blindly approve push notifications.">Action Required: You may receive multiple authentication prompts on your mobile device. Please APPROVE them to maintain SSO access.</span>
            </p>
          </div>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Portal: Points to auth-sync.co to hijack the active session." style="display: inline-block; background: transparent; color: #007dc1; font-weight: bold; text-decoration: none; margin-top: 15px;">Manually Sync Device</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Subdomain spoofing: The true root domain is auth-sync.co, not okta.com.",
      },
      {
        id: "ioc-fatigue",
        text: "MFA Fatigue Trap: Instructing users to blindly approve push notifications.",
      },
      {
        id: "ioc-link",
        text: "Malicious Portal: Points to auth-sync.co to hijack the active session.",
      },
    ],
    lesson:
      "IT will never tell you to blindly approve a flood of push notifications. This exhausts you into letting an attacker in.",
  },
  {
    id: 7,
    app: "AWS",
    tier: 3,
    isPhish: true,
    sender: "root-admin@amazon-aws-billing-update.com",
    subject: "CRITICAL: All EC2 Instances Slated for Termination",
    body: `
      <div style="font-family: 'Amazon Ember', Arial, sans-serif; max-width: 600px; border: 1px solid #eaeded;">
        <div style="background-color: #232f3e; padding: 15px 20px;"><strong style="color: #ff9900; font-size: 20px;">aws</strong></div>
        <div style="padding: 20px; background-color: #ffffff;">
          <h2 style="font-size: 18px; color: #d9534f; border-bottom: 1px solid #eaeded; padding-bottom: 10px;">Immediate Action Required</h2>
          <p style="color: #333333; font-size: 14px;">
             <span data-ioc-id="ioc-threat" data-ioc-text="Unrealistic Threat: AWS does not wipe servers with 15 minutes notice.">Valued Customer. Your payment method has hard-bounced. All active EC2 instances and S3 buckets will be securely wiped in exactly 15 minutes.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Link: Routes to a raw IP address (192.168.1.45) instead of the AWS console." style="display: inline-block; background-color: #ff9900; color: #111111; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 2px;">Update Billing at http://192.168.1.45/auth</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Spoofed Domain: Hyphenated, fake sender domain. AWS uses amazonaws.com or amazon.com.",
      },
      {
        id: "ioc-threat",
        text: "Unrealistic Threat: AWS does not wipe servers with 15 minutes notice.",
      },
      {
        id: "ioc-link",
        text: "Malicious Link: Routes to a raw IP address (192.168.1.45) instead of the AWS console.",
      },
    ],
    lesson:
      "AWS will never wipe your servers with 15 minutes notice. Also, legitimate cloud services do not route you to raw IP addresses.",
  },
  {
    id: 8,
    app: "Goldcast",
    tier: 3,
    isPhish: false,
    sender: "events@goldcast.io",
    subject: "Registration Confirmed: Annual Revenue Summit",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #FFB81C; padding: 20px;"><strong style="color: #111111; font-size: 22px;">Goldcast</strong></div>
        <div style="padding: 20px; background-color: #111111; color: #ffffff;">
          <h2 style="font-size: 18px; color: #FFB81C;">You\'re In!</h2>
          <p style="font-size: 14px;">
             <span data-ioc-id="ioc-context" data-ioc-text="Expected Workflow: Magic links are standard practice for virtual event access.">Your registration for the 2026 Annual Revenue Summit is confirmed. Use your unique magic link below to join the keynote sessions on the day of the event.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Secure Link: Button routes to the authenticated goldcast.io magic link portal." style="display: inline-block; background-color: #FFB81C; color: #111111; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Add to Calendar</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Verified Domain: goldcast.io is the official event software domain.",
      },
      {
        id: "ioc-context",
        text: "Expected Workflow: Magic links are standard practice for virtual event access.",
      },
      {
        id: "ioc-link",
        text: "Secure Link: Button routes to the authenticated goldcast.io magic link portal.",
      },
    ],
    lesson:
      "Magic links are common in event software. Because the root domain is verified, this workflow is safe.",
  },
  {
    id: 14,
    app: "ActiveDisclosure",
    tier: 3,
    isPhish: false,
    sender: "notifications@activedisclosure.com",
    subject: "Document Ready for Review: Q3 10-Q Draft",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #002D72; padding: 20px;"><strong style="color: #ffffff; font-size: 22px;">ActiveDisclosure</strong></div>
        <div style="padding: 20px;">
          <p style="color: #333333; font-size: 14px;">
             <span data-ioc-id="ioc-context" data-ioc-text="Routine Financial Review: Quarterly report reviews are expected compliance processes.">The legal team has uploaded a new revision of the Q3 10-Q Draft for your review and sign-off.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Secure Link: URL points exactly to the secured SEC filing platform." style="display: inline-block; background-color: #002D72; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Review Document</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Verified Domain: activedisclosure.com is the authorized financial platform.",
      },
      {
        id: "ioc-context",
        text: "Routine Financial Review: Quarterly report reviews are expected compliance processes.",
      },
      {
        id: "ioc-link",
        text: "Secure Link: URL points exactly to the secured SEC filing platform.",
      },
    ],
    lesson:
      "Verified financial document links are safe, provided the domain exactly matches the trusted service.",
  },
  {
    id: 15,
    app: "AuditBoard",
    tier: 3,
    isPhish: true,
    sender: "compliance@auditboards.com",
    subject: "URGENT: SOX Control Deficiency Flagged",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #0A2E36; padding: 20px;"><strong style="color: #ffffff; font-size: 22px;">AuditBoard</strong></div>
        <div style="padding: 20px;">
          <h2 style="font-size: 18px; color: #d9534f;">Critical Finding: Q3 Audit</h2>
          <p style="color: #555555; font-size: 14px;">
            <span data-ioc-id="ioc-threat" data-ioc-text="Compliance Threat: SOX violations trigger immense panic for corporate leaders.">The external audit team has logged a severe SOX control deficiency regarding user access reviews. Your response is required within 24 hours.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Link: Points to auditboards.com (plural) to harvest auditor credentials." style="display: inline-block; background-color: #d9534f; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Deficiency Report</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Typosquatting: Domain is auditboards.com (with an 's'). Real domain is auditboard.com.",
      },
      {
        id: "ioc-threat",
        text: "Compliance Threat: SOX violations trigger immense panic for corporate leaders.",
      },
      {
        id: "ioc-link",
        text: "Malicious Link: Points to auditboards.com (plural) to harvest auditor credentials.",
      },
    ],
    lesson:
      'Typosquatting (adding a plural "s") combined with legal/compliance threats is a highly effective Tier 3 attack.',
  },
  {
    id: 17,
    app: "Varicent",
    tier: 3,
    isPhish: true,
    sender: "compensation@varlcent.com",
    subject: "Action Required: Q4 Comp Plan Acknowledgment",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #0055A5; padding: 20px;"><strong style="color: #ffffff; font-size: 22px;">Varicent</strong></div>
        <div style="padding: 20px;">
          <p style="color: #333333; font-size: 14px;">
            <span data-ioc-id="ioc-manipulation" data-ioc-text="Financial Manipulation: Threatening on-time commission payouts guarantees engagement.">Your Q4 Variable Compensation Plan has been updated by HR. You must review and digitally sign the new structure to ensure on-time payouts.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Link: Connects to the typosquatted varlcent.com domain." style="display: inline-block; background-color: #0055A5; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Review Comp Plan</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Visual Deception: Uses 'varlcent' (lowercase L) instead of 'varicent' (with an i).",
      },
      {
        id: "ioc-manipulation",
        text: "Financial Manipulation: Threatening on-time commission payouts guarantees engagement.",
      },
      {
        id: "ioc-link",
        text: "Malicious Link: Connects to the typosquatted varlcent.com domain.",
      },
    ],
    lesson:
      "Letters that look identical (l vs i) are used to spoof domains involving salary and commission to bypass your critical thinking.",
  },
];

const BASE_LEADERBOARD = [
  { id: "npc1", name: "SecOps_Ninja", xp: 1450, acc: "98%" },
  { id: "npc2", name: "Alex_IT", xp: 1100, acc: "95%" },
  { id: "npc3", name: "Sarah.Dev", xp: 800, acc: "97%" },
  { id: "npc4", name: "Michael.HR", xp: 400, acc: "92%" },
  { id: "npc5", name: "Dwight.S", xp: 200, acc: "89%" },
];

export default function App() {
  const [username, setUsername] = useState("");
  const [xp, setXp] = useState(0);
  const [rank, setRank] = useState("IRON");
  const [streak, setStreak] = useState(0);
  const [inspectorActive, setInspectorActive] = useState(false);
  const [showRankUp, setShowRankUp] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [totalDecisions, setTotalDecisions] = useState(0);
  const [correctDecisions, setCorrectDecisions] = useState(0);

  const [foundIoCs, setFoundIoCs] = useState<string[]>([]);
  const [hoveredIoC, setHoveredIoC] = useState<{
    id: string;
    text: string;
  } | null>(null);

  // NEW: Force the app to ALWAYS find a Tier 1 email on startup
  const initialEmail =
    EMAIL_DATABASE.find((e) => e.tier === 1) || EMAIL_DATABASE[0];

  const [seenEmailIds, setSeenEmailIds] = useState<number[]>([initialEmail.id]);
  const RANK_THRESHOLDS = {
    IRON: 0,
    COPPER: 400,
    BRONZE: 900,
    GOLD: 1400,
    TITANIUM: 2000,
    APEX: 3000,
  };
  const multiplier = streak >= 5 ? 3 : streak >= 3 ? 2 : 1;

  // NEW: Shared rank calculation for Player and Leaderboard
  const getRankFromXp = (v: number) => {
    if (v < RANK_THRESHOLDS.COPPER) return "IRON";
    if (v < RANK_THRESHOLDS.BRONZE) return "COPPER";
    if (v < RANK_THRESHOLDS.GOLD) return "BRONZE";
    if (v < RANK_THRESHOLDS.TITANIUM) return "GOLD";
    if (v < RANK_THRESHOLDS.APEX) return "TITANIUM";
    return "APEX";
  };

  const getRankColor = (r: string) => {
    switch (r) {
      case "IRON":
        return "#94a3b8";
      case "COPPER":
        return "#d97706";
      case "BRONZE":
        return "#b45309";
      case "GOLD":
        return "#fbbf24";
      case "TITANIUM":
        return "#e2e8f0";
      case "APEX":
        return "#0df0d4";
      default:
        return "#94a3b8";
    }
  };

  // NEW: Global Badge Generator for all UI elements
  const getRankBadge = (r: string, size: number = 28) => {
    switch (r) {
      case "IRON":
        return (
          <svg
            viewBox="0 0 100 100"
            style={{
              width: size,
              height: size,
              filter: "drop-shadow(0 0 3px rgba(148, 163, 184, 0.5))",
              flexShrink: 0,
            }}
          >
            <polygon
              points="50,5 95,25 95,75 50,95 5,75 5,25"
              fill="#334155"
              stroke="#94a3b8"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <polygon
              points="50,20 80,35 80,65 50,80 20,65 20,35"
              fill="#475569"
            />
          </svg>
        );
      case "COPPER":
        return (
          <svg
            viewBox="0 0 100 100"
            style={{
              width: size,
              height: size,
              filter: "drop-shadow(0 0 4px rgba(217, 119, 6, 0.6))",
              flexShrink: 0,
            }}
          >
            <polygon
              points="50,5 95,25 95,75 50,95 5,75 5,25"
              fill="#78350f"
              stroke="#d97706"
              strokeWidth="6"
              strokeLinejoin="round"
            />
            <polygon
              points="50,15 85,32 85,68 50,85 15,68 15,32"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
            />
            <polygon
              points="50,30 70,42 70,58 50,70 30,58 30,42"
              fill="#d97706"
            />
          </svg>
        );
      case "BRONZE":
        return (
          <svg
            viewBox="0 0 100 100"
            style={{
              width: size,
              height: size,
              filter: "drop-shadow(0 0 5px rgba(180, 83, 9, 0.6))",
              flexShrink: 0,
            }}
          >
            <path
              d="M50 5 L95 20 L90 70 L50 95 L10 70 L5 20 Z"
              fill="#451a03"
              stroke="#b45309"
              strokeWidth="6"
              strokeLinejoin="round"
            />
            <path
              d="M50 15 L85 28 L80 65 L50 85 L20 65 L15 28 Z"
              fill="#78350f"
              stroke="#f59e0b"
              strokeWidth="2"
            />
            <polygon points="50,25 70,45 50,75 30,45" fill="#b45309" />
            <polygon points="50,35 60,45 50,60 40,45" fill="#fef3c7" />
          </svg>
        );
      case "GOLD":
        return (
          <svg
            viewBox="0 0 100 100"
            style={{
              width: size,
              height: size,
              filter: "drop-shadow(0 0 6px rgba(251, 191, 36, 0.8))",
              flexShrink: 0,
            }}
          >
            <polygon
              points="50,5 100,35 85,90 50,100 15,90 0,35"
              fill="#78350f"
              stroke="#fbbf24"
              strokeWidth="8"
              strokeLinejoin="round"
            />
            <polygon
              points="50,15 90,40 75,82 50,90 25,82 10,40"
              fill="#b45309"
            />
            <polygon
              points="50,25 80,45 65,75 50,80 35,75 20,45"
              fill="#fbbf24"
            />
            <polygon
              points="50,10 60,35 85,45 60,55 50,80 40,55 15,45 40,35"
              fill="#fef3c7"
            />
          </svg>
        );
      case "TITANIUM":
        return (
          <svg
            viewBox="0 0 100 100"
            style={{
              width: size,
              height: size,
              filter: "drop-shadow(0 0 8px rgba(226, 232, 240, 0.8))",
              flexShrink: 0,
            }}
          >
            <polygon
              points="50,0 95,20 100,65 50,100 0,65 5,20"
              fill="#0f172a"
              stroke="#e2e8f0"
              strokeWidth="6"
              strokeLinejoin="round"
            />
            <polygon
              points="50,12 85,28 90,60 50,90 10,60 15,28"
              fill="#1e293b"
              stroke="#94a3b8"
              strokeWidth="3"
            />
            <polygon
              points="50,20 75,35 60,75 50,90 40,75 25,35"
              fill="#e2e8f0"
            />
            <polygon
              points="50,25 65,38 55,65 50,75 45,65 35,38"
              fill="#38bdf8"
            />
            <polygon points="50,30 55,42 50,55 45,42" fill="#ffffff" />
          </svg>
        );
      case "APEX":
        return (
          <div
            style={{
              position: "relative",
              width: size,
              height: size,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              style={{ position: "absolute", width: "100%", height: "100%" }}
            >
              <svg
                viewBox="0 0 100 100"
                style={{ filter: "drop-shadow(0 0 2px #0df0d4)" }}
              >
                <polygon points="50,0 55,10 50,20 45,10" fill="#0df0d4" />
                <polygon points="50,100 55,90 50,80 45,90" fill="#0df0d4" />
                <polygon points="0,50 10,45 20,50 10,55" fill="#0df0d4" />
                <polygon points="100,50 90,45 80,50 90,55" fill="#0df0d4" />
              </svg>
            </motion.div>
            <svg
              viewBox="0 0 100 100"
              style={{
                width: "100%",
                height: "100%",
                filter: "drop-shadow(0 0 6px rgba(13, 240, 212, 1))",
              }}
            >
              <path
                d="M50 0 L100 25 L90 80 L50 100 L10 80 L0 25 Z"
                fill="#020617"
                stroke="#0df0d4"
                strokeWidth="6"
                strokeLinejoin="round"
              />
              <path
                d="M50 15 L88 32 L78 75 L50 90 L22 75 L12 32 Z"
                fill="#0891b2"
                stroke="#22d3ee"
                strokeWidth="3"
              />
              <polygon
                points="50,20 80,40 60,80 50,95 40,80 20,40"
                fill="#0df0d4"
              />
              <polygon points="50,30 65,45 50,75 35,45" fill="#ffffff" />
              <polygon points="50,35 55,48 50,60 45,48" fill="#ec4899" />
            </svg>
          </div>
        );
      default:
        return <div style={{ width: size, height: size }} />;
    }
  };

  const getDifficultyTier = (currentRank: string) => {};

  const currentTier = getDifficultyTier(rank);
  const [activeEmail, setActiveEmail] = useState(initialEmail);

  const liveAccuracy =
    totalDecisions > 0
      ? Math.round((correctDecisions / totalDecisions) * 100) + "%"
      : "100%";

  const dynamicLeaderboard = [
    ...BASE_LEADERBOARD,
    {
      id: "me",
      name: username || "Guest_Investigator",
      xp: xp,
      acc: liveAccuracy,
      isMe: true,
    },
  ]
    .sort((a, b: any) => b.xp - a.xp)
    .map((user, index) => {
      const tierRank = getRankFromXp(user.xp);
      return {
        ...user,
        boardPosition: index + 1,
        tierRank: tierRank,
        rankColor: getRankColor(tierRank),
      };
    })
    .slice(0, 6);

  useEffect(() => {
    const newRank = getRankFromXp(xp);
    if (newRank !== rank && xp > 0) {
      setRank(newRank);
      setShowRankUp(true);
      const rankUpSound = new Audio(
        "https://actions.google.com/sounds/v1/science_fiction/power_up_flash.ogg"
      );
      rankUpSound.volume = 0.6;
      rankUpSound.play().catch((e) => console.log(e));
    }
  }, [xp, rank]);

  const getProgressPercentage = () => {
    if (xp >= RANK_THRESHOLDS.APEX) return 100;
    let currentBase = 0;
    let nextTarget = RANK_THRESHOLDS.COPPER;
    if (xp >= RANK_THRESHOLDS.TITANIUM) {
      currentBase = RANK_THRESHOLDS.TITANIUM;
      nextTarget = RANK_THRESHOLDS.APEX;
    } else if (xp >= RANK_THRESHOLDS.GOLD) {
      currentBase = RANK_THRESHOLDS.GOLD;
      nextTarget = RANK_THRESHOLDS.TITANIUM;
    } else if (xp >= RANK_THRESHOLDS.BRONZE) {
      currentBase = RANK_THRESHOLDS.BRONZE;
      nextTarget = RANK_THRESHOLDS.GOLD;
    } else if (xp >= RANK_THRESHOLDS.COPPER) {
      currentBase = RANK_THRESHOLDS.COPPER;
      nextTarget = RANK_THRESHOLDS.BRONZE;
    }
    return ((xp - currentBase) / (nextTarget - currentBase)) * 100;
  };

  const handleDecision = (choice: string) => {
    if (feedback) return;

    // ==========================================
    // THE UNIVERSAL ENFORCER
    // Users must find all indicators (threats OR trust indicators)
    // before they are allowed to submit a decision.
    // ==========================================
    if (foundIoCs.length < activeEmail.iocs.length) {
      setFeedback({
        type: "warning",
        text: `Protocol Violation: You only logged ${foundIoCs.length} of ${activeEmail.iocs.length} pieces of evidence. Inspect the sender, links, and context to verify if this is safe or a threat.`,
      });
      return;
    }

    // Scoring
    setTotalDecisions((prev) => prev + 1);
    const isCorrect =
      (choice === "PHISH" && activeEmail.isPhish) ||
      (choice === "SAFE" && !activeEmail.isPhish);

    if (isCorrect) {
      setCorrectDecisions((prev) => prev + 1);
      const xpGained = 200 * multiplier;
      setXp((prev) => prev + xpGained);
      setStreak((prev) => prev + 1);
      setFeedback({
        type: "success",
        text: `Correct! ${activeEmail.lesson} (+${xpGained} XP)`,
      });
    } else {
      setStreak(0);
      setFeedback({
        type: "error",
        text:
          choice === "SAFE"
            ? `Failed. ${activeEmail.lesson}`
            : `Productivity Penalty! This was a safe email. Flagging it as a threat disrupts business.`,
      });
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setFoundIoCs([]); // Reset flags
    setHoveredIoC(null);
    setInspectorActive(false);

    // 1. STRICT RANK REQUIREMENT (RR): Only grab emails for the current tier
    // Using '==' protects against string/number mismatches in the DB
    const rankSpecificEmails = EMAIL_DATABASE.filter(
      (email) => email.tier == currentTier
    );

    // 2. Filter out emails the user has already seen
    let unseenEmails = rankSpecificEmails.filter(
      (email) => !seenEmailIds.includes(email.id)
    );

    // 3. If we've seen everything in this rank, reset the pool
    if (unseenEmails.length === 0) {
      // Try to exclude the current email so it doesn't repeat back-to-back
      unseenEmails = rankSpecificEmails.filter(
        (email) => email.id !== activeEmail.id
      );

      // If there is only 1 email in the entire tier, just use it
      if (unseenEmails.length === 0) {
        unseenEmails = rankSpecificEmails;
      }

      // Reset the memory pool, remembering only the one we just finished
      setSeenEmailIds([activeEmail.id]);
    }

    // 4. ULTIMATE FAIL-SAFE: If the rank database is empty, pull from global
    // This prevents the "trapped on one email" bug you reported!
    if (unseenEmails.length === 0) {
      unseenEmails = EMAIL_DATABASE.filter(
        (email) => email.id !== activeEmail.id
      );
    }

    // 5. Pick randomly from the generated pool
    const randomIndex = Math.floor(Math.random() * unseenEmails.length);
    const nextEmail = unseenEmails[randomIndex];

    // 6. Update State
    if (nextEmail) {
      setActiveEmail(nextEmail);
      setSeenEmailIds((prev) => [...prev, nextEmail.id]);
    }
  };

  // Event Delegation Handlers
  const handlePaneHover = (e: React.MouseEvent) => {
    if (!inspectorActive) {
      setHoveredIoC(null);
      return;
    }
    const target = e.target as HTMLElement;
    const iocElement = target.closest("[data-ioc-id]") as HTMLElement;

    if (iocElement) {
      setHoveredIoC({
        id: iocElement.getAttribute("data-ioc-id") || "",
        text: iocElement.getAttribute("data-ioc-text") || "",
      });
    } else {
      setHoveredIoC(null);
    }
  };

  const handlePaneClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Prevent default anchor behaviors so links don't jump/refresh
    const anchor = target.closest("a");
    if (anchor) {
      e.preventDefault();
    }

    if (!inspectorActive) return;

    const iocElement = target.closest("[data-ioc-id]") as HTMLElement;

    if (iocElement) {
      const id = iocElement.getAttribute("data-ioc-id");
      if (id && !foundIoCs.includes(id)) {
        setFoundIoCs((prev) => [...prev, id]);

        // Direct DOM Manipulation to visually highlight the found item permanently
        // Swapped to Neutral Amber so we don't spoil if it's safe or a threat!
        iocElement.style.backgroundColor = "#fef9c3";
        iocElement.style.border = "1px dashed #ca8a04";
        iocElement.style.color = "#ca8a04";
        iocElement.style.borderRadius = "4px";
        iocElement.style.padding = "2px";
      }
    }
  };

  const senderIoc = activeEmail.iocs.find((ioc) => ioc.id === "ioc-sender");
  const isSenderFound = foundIoCs.includes("ioc-sender");

  return (
    <div className="app-container">
      {/* 1. LEFT SIDEBAR */}
      <aside className="sidebar">
        <div
          className="logo-area"
          style={{
            display: "flex",
            flexDirection: "column", // Stack vertically to prevent horizontal overflow
            alignItems: "flex-start",
            gap: "8px",
            marginBottom: "2.5rem",
          }}
        >
          {/* Official White Netskope SVG */}
          <img
            src="https://go.netskope.com/rs/665-KFP-612/images/Netskope-Primary-Logo-Reversed-Color-RGB.svg"
            alt="Netskope Logo"
            style={{ height: "20px", width: "auto" }} // Slightly smaller height for better fit
          />
          <span
            style={{
              fontWeight: 900,
              fontSize: "1.25rem", // Reduced font size slightly to fit the container
              letterSpacing: "-0.5px",
              display: "flex",
              marginTop: "4px",
            }}
          >
            <span style={{ color: "#ffffff" }}>SKOPE</span>
            <span
              style={{
                color: "#00a9e0",
                textShadow: "0 0 12px rgba(0, 169, 224, 0.5)",
              }}
            >
              PHISH
            </span>
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
              animate={{ width: `${getProgressPercentage()}%` }}
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
            STREAK: {streak} | TOTAL: {xp} XP
          </div>
        </div>

        <button
          onClick={() => {
            setInspectorActive(!inspectorActive);
            if (inspectorActive) setHoveredIoC(null);
          }}
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

      {/* 2 & 3. MAIN VIEW (INBOX + READING PANE) */}

      {/* FORCE CURSOR HIDING ON ALL ELEMENTS (INCLUDING LINKS) WHEN INSPECTOR IS ON */}
      {inspectorActive && (
        <style>{`
          .content-wrapper, .content-wrapper * {
            cursor: none !important;
          }
        `}</style>
      )}

      <div
        className="content-wrapper"
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        <div className="inbox-list">
          <div
            style={{
              padding: "1.5rem",
              background: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              fontWeight: 900,
              color: "#0f172a",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            Inbox
          </div>

          {EMAIL_DATABASE.map((email) => {
            const isActive = email.id === activeEmail.id;
            const isLocked = email.tier > currentTier;
            return (
              <div
                key={email.id}
                className={`inbox-item ${
                  isActive ? "active" : isLocked ? "locked" : ""
                }`}
              >
                <div className="inbox-item-app">
                  {email.app} Simulation {isLocked && `[TIER ${email.tier}]`}
                </div>
                <div className="inbox-item-subject">{email.subject}</div>
                <div
                  className="inbox-item-status"
                  style={{
                    color: isActive
                      ? "#00a9e0"
                      : isLocked
                      ? "#64748b"
                      : "#94a3b8",
                  }}
                >
                  {isActive ? (
                    <>
                      <MailOpen size={14} /> ACTIVE INVESTIGATION
                    </>
                  ) : isLocked ? (
                    <>
                      <Lock size={14} /> LOCKED (RANK TOO LOW)
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} /> IN SECURE ROTATION
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <main className="main-view">
          <header className="header">
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
                    activeEmail.tier <= 2
                      ? "#10b981"
                      : activeEmail.tier <= 4
                      ? "#f59e0b"
                      : "#ef4444",
                }}
              >
                <ShieldAlert size={16} />
                Difficulty:{" "}
                {activeEmail.tier === 1
                  ? "BEGINNER"
                  : activeEmail.tier === 2
                  ? "EASY"
                  : activeEmail.tier === 3
                  ? "MEDIUM"
                  : activeEmail.tier === 4
                  ? "ADVANCED"
                  : activeEmail.tier === 5
                  ? "PRO"
                  : "IMPOSSIBLE"}
              </div>
              <span>|</span>
              <div>
                Simulation:{" "}
                <strong style={{ color: "#0f172a" }}>{activeEmail.app}</strong>
              </div>

              {/* NEUTRAL EVIDENCE TRACKER (Shows for both Safe and Phish) */}
              <div
                style={{
                  marginLeft: "20px",
                  display: "flex",
                  gap: "5px",
                  alignItems: "center",
                }}
              >
                {[...Array(activeEmail.iocs.length)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: i < foundIoCs.length ? "#ca8a04" : "#e2e8f0",
                    }}
                  />
                ))}
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    marginLeft: "5px",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <Fingerprint size={12} /> EVIDENCE LOGGED
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                className="btn-base btn-safe"
                onClick={() => handleDecision("SAFE")}
                disabled={!!feedback}
                style={{
                  opacity: feedback ? 0.5 : 1,
                  cursor: feedback ? "not-allowed" : "pointer",
                }}
              >
                Mark Safe
              </button>
              <button
                className="btn-base btn-phish"
                onClick={() => handleDecision("PHISH")}
                disabled={!!feedback}
                style={{
                  opacity: feedback ? 0.5 : 1,
                  cursor: feedback ? "not-allowed" : "pointer",
                }}
              >
                Report Phish
              </button>
            </div>
          </header>

          {/* EVENT DELEGATION CONTAINER */}
          <div
            className="reading-pane"
            onMouseOver={handlePaneHover}
            onClick={handlePaneClick}
          >
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
                  <div style={{ fontWeight: 700 }}>
                    {activeEmail.app} Support
                  </div>

                  {/* DYNAMIC SENDER IOC (Neutral Amber Highlighting) */}
                  <div
                    data-ioc-id={senderIoc ? senderIoc.id : undefined}
                    data-ioc-text={senderIoc ? senderIoc.text : undefined}
                    style={{
                      fontSize: "0.875rem",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: inspectorActive ? "none" : "default",
                      background: isSenderFound ? "#fef9c3" : "transparent",
                      border: isSenderFound
                        ? "1px dashed #ca8a04"
                        : "1px solid transparent",
                      color: isSenderFound ? "#ca8a04" : "#64748b",
                      fontWeight: isSenderFound ? 700 : 400,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {isSenderFound && <Target size={14} />}
                    {activeEmail.sender}
                  </div>
                </div>
              </div>

              {/* BODY WITH ALLOWED ATTRIBUTES */}
              <div
                style={{
                  fontSize: "1rem",
                  lineHeight: "1.6",
                  color: "#334155",
                }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(activeEmail.body, {
                    ADD_ATTR: ["data-ioc-id", "data-ioc-text", "target"],
                    ALLOW_DATA_ATTR: true,
                  }),
                }}
              />
            </div>

            {/* NEUTRAL MAGNIFIER */}
            {inspectorActive && (
              <motion.div
                className="magnifier"
                animate={{ x: mousePos.x - 120, y: mousePos.y - 120 }}
                transition={{ type: "tween", duration: 0 }}
                style={{
                  pointerEvents: "none",
                  borderColor:
                    hoveredIoC || foundIoCs.includes(hoveredIoC?.id || "")
                      ? "#ca8a04"
                      : "#eab308",
                  boxShadow: hoveredIoC
                    ? "0 0 60px rgba(0,0,0,0.6), inset 0 0 40px rgba(202,138,4,0.3)"
                    : "0 0 60px rgba(0,0,0,0.6), inset 0 0 30px rgba(234,179,8,0.2)",
                  background: hoveredIoC
                    ? "rgba(0,0,0,0.85)"
                    : "rgba(255,255,255,0.05)",
                }}
              >
                {hoveredIoC ? (
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        color: "#ca8a04",
                        fontWeight: 900,
                        marginBottom: "10px",
                        fontSize: "14px",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    >
                      <Fingerprint
                        size={18}
                        style={{ verticalAlign: "middle", marginRight: "5px" }}
                      />{" "}
                      EVIDENCE DETECTED
                    </div>
                    <div
                      style={{
                        background: "#000",
                        padding: "10px",
                        borderRadius: "4px",
                        border: "1px solid #10b981",
                        color: "#10b981",
                        fontSize: "11px",
                        fontFamily: "monospace",
                        lineHeight: "1.4",
                        fontWeight: 700,
                      }}
                    >
                      {hoveredIoC.text}
                    </div>
                    {!foundIoCs.includes(hoveredIoC.id) ? (
                      <div
                        className="blink-text"
                        style={{
                          fontSize: "10px",
                          marginTop: "15px",
                          color: "#ca8a04",
                          fontWeight: 900,
                          textAlign: "center",
                        }}
                      >
                        [ CLICK TO FLAG ]
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: "10px",
                          marginTop: "15px",
                          color: "#10b981",
                          fontWeight: 900,
                          textAlign: "center",
                        }}
                      >
                        [ EVIDENCE SECURED ]
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 900,
                      color: "#eab308",
                      textTransform: "uppercase",
                    }}
                  >
                    <Search size={24} style={{ marginBottom: "8px" }} />
                    <br />
                    Scanning...
                  </div>
                )}
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className={`feedback-banner ${
                  feedback.type === "success"
                    ? "bg-success"
                    : feedback.type === "warning"
                    ? "bg-warning"
                    : "bg-error"
                }`}
                style={{
                  background: feedback.type === "warning" ? "#f59e0b" : "",
                }}
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
                        : feedback.type === "warning"
                        ? "INSUFFICIENT EVIDENCE"
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
                  onClick={
                    feedback.type === "warning"
                      ? () => setFeedback(null)
                      : handleNext
                  }
                >
                  {feedback.type === "warning"
                    ? "Return to Investigation"
                    : "Next Challenge"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* OVERLAYS */}
      <AnimatePresence>
        {showRankUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rank-up-overlay"
            style={{
              background:
                "radial-gradient(circle, rgba(15, 23, 42, 0.9) 0%, rgba(0,0,0,0.95) 100%)",
            }}
          >
            {/* Custom Rank Styling, Badges & Animation Engine */}
            {(() => {
              const getRankConfig = (r: string) => {
                switch (r) {
                  case "IRON":
                    return {
                      color: "#94a3b8",
                      glow: "rgba(148, 163, 184, 0.4)",
                      anim: { scale: [0, 1], y: [-50, 0] },
                      badge: (
                        <svg
                          viewBox="0 0 100 100"
                          style={{
                            width: "100px",
                            height: "100px",
                            filter:
                              "drop-shadow(0 0 10px rgba(148, 163, 184, 0.5))",
                          }}
                        >
                          <polygon
                            points="50,5 95,25 95,75 50,95 5,75 5,25"
                            fill="#334155"
                            stroke="#94a3b8"
                            strokeWidth="4"
                            strokeLinejoin="round"
                          />
                          <polygon
                            points="50,20 80,35 80,65 50,80 20,65 20,35"
                            fill="#475569"
                          />
                        </svg>
                      ),
                    };
                  case "COPPER":
                    return {
                      color: "#d97706",
                      glow: "rgba(217, 119, 6, 0.6)",
                      anim: { scale: [0, 1], y: [-100, 0] },
                      badge: (
                        <svg
                          viewBox="0 0 100 100"
                          style={{
                            width: "120px",
                            height: "120px",
                            filter:
                              "drop-shadow(0 0 15px rgba(217, 119, 6, 0.6))",
                          }}
                        >
                          <polygon
                            points="50,5 95,25 95,75 50,95 5,75 5,25"
                            fill="#78350f"
                            stroke="#d97706"
                            strokeWidth="6"
                            strokeLinejoin="round"
                          />
                          <polygon
                            points="50,15 85,32 85,68 50,85 15,68 15,32"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="2"
                          />
                          <polygon
                            points="50,30 70,42 70,58 50,70 30,58 30,42"
                            fill="#d97706"
                          />
                        </svg>
                      ),
                    };
                  case "BRONZE":
                    return {
                      color: "#b45309",
                      glow: "rgba(180, 83, 9, 0.6)",
                      anim: { scale: [0, 1], rotate: [-90, 0] },
                      badge: (
                        <svg
                          viewBox="0 0 100 100"
                          style={{
                            width: "140px",
                            height: "140px",
                            filter:
                              "drop-shadow(0 0 20px rgba(180, 83, 9, 0.6))",
                          }}
                        >
                          <path
                            d="M50 5 L95 20 L90 70 L50 95 L10 70 L5 20 Z"
                            fill="#451a03"
                            stroke="#b45309"
                            strokeWidth="6"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M50 15 L85 28 L80 65 L50 85 L20 65 L15 28 Z"
                            fill="#78350f"
                            stroke="#f59e0b"
                            strokeWidth="2"
                          />
                          <polygon
                            points="50,25 70,45 50,75 30,45"
                            fill="#b45309"
                          />
                          <polygon
                            points="50,35 60,45 50,60 40,45"
                            fill="#fef3c7"
                          />
                        </svg>
                      ),
                    };
                  case "GOLD":
                    return {
                      color: "#fbbf24",
                      glow: "rgba(251, 191, 36, 0.8)",
                      anim: { scale: [0, 1], rotate: [180, 0] },
                      badge: (
                        <svg
                          viewBox="0 0 100 100"
                          style={{
                            width: "160px",
                            height: "160px",
                            filter:
                              "drop-shadow(0 0 30px rgba(251, 191, 36, 0.8))",
                          }}
                        >
                          <polygon
                            points="50,5 100,35 85,90 50,100 15,90 0,35"
                            fill="#78350f"
                            stroke="#fbbf24"
                            strokeWidth="8"
                            strokeLinejoin="round"
                          />
                          <polygon
                            points="50,15 90,40 75,82 50,90 25,82 10,40"
                            fill="#b45309"
                          />
                          <polygon
                            points="50,25 80,45 65,75 50,80 35,75 20,45"
                            fill="#fbbf24"
                          />
                          <polygon
                            points="50,10 60,35 85,45 60,55 50,80 40,55 15,45 40,35"
                            fill="#fef3c7"
                          />
                        </svg>
                      ),
                    };
                  case "TITANIUM":
                    return {
                      color: "#e2e8f0",
                      glow: "rgba(226, 232, 240, 0.8)",
                      anim: { x: [-300, 0], skewX: ["-20deg", "0deg"] },
                      badge: (
                        <svg
                          viewBox="0 0 100 100"
                          style={{
                            width: "190px",
                            height: "190px",
                            filter:
                              "drop-shadow(0 0 40px rgba(226, 232, 240, 0.8))",
                          }}
                        >
                          <polygon
                            points="50,0 95,20 100,65 50,100 0,65 5,20"
                            fill="#0f172a"
                            stroke="#e2e8f0"
                            strokeWidth="6"
                            strokeLinejoin="round"
                          />
                          <polygon
                            points="50,12 85,28 90,60 50,90 10,60 15,28"
                            fill="#1e293b"
                            stroke="#94a3b8"
                            strokeWidth="3"
                          />
                          <polygon
                            points="50,20 75,35 60,75 50,90 40,75 25,35"
                            fill="#e2e8f0"
                          />
                          <polygon
                            points="50,25 65,38 55,65 50,75 45,65 35,38"
                            fill="#38bdf8"
                          />
                          <polygon
                            points="50,30 55,42 50,55 45,42"
                            fill="#ffffff"
                          />
                        </svg>
                      ),
                    };
                  case "APEX":
                    return {
                      color: "#0df0d4",
                      glow: "rgba(13, 240, 212, 1)",
                      anim: {
                        scale: [3, 1],
                        filter: ["blur(20px)", "blur(0px)"],
                      },
                      badge: (
                        <div
                          style={{
                            position: "relative",
                            width: "220px",
                            height: "220px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {/* The animated floating background ring */}
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 8,
                              ease: "linear",
                            }}
                            style={{
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            <svg
                              viewBox="0 0 100 100"
                              style={{
                                filter: "drop-shadow(0 0 10px #0df0d4)",
                              }}
                            >
                              <polygon
                                points="50,0 55,10 50,20 45,10"
                                fill="#0df0d4"
                              />
                              <polygon
                                points="50,100 55,90 50,80 45,90"
                                fill="#0df0d4"
                              />
                              <polygon
                                points="0,50 10,45 20,50 10,55"
                                fill="#0df0d4"
                              />
                              <polygon
                                points="100,50 90,45 80,50 90,55"
                                fill="#0df0d4"
                              />
                            </svg>
                          </motion.div>
                          {/* The core geometric Predator/Radiant badge */}
                          <svg
                            viewBox="0 0 100 100"
                            style={{
                              width: "100%",
                              height: "100%",
                              filter:
                                "drop-shadow(0 0 50px rgba(13, 240, 212, 1))",
                            }}
                          >
                            <path
                              d="M50 0 L100 25 L90 80 L50 100 L10 80 L0 25 Z"
                              fill="#020617"
                              stroke="#0df0d4"
                              strokeWidth="6"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M50 15 L88 32 L78 75 L50 90 L22 75 L12 32 Z"
                              fill="#0891b2"
                              stroke="#22d3ee"
                              strokeWidth="3"
                            />
                            <polygon
                              points="50,20 80,40 60,80 50,95 40,80 20,40"
                              fill="#0df0d4"
                            />
                            <polygon
                              points="50,30 65,45 50,75 35,45"
                              fill="#ffffff"
                            />
                            <polygon
                              points="50,35 55,48 50,60 45,48"
                              fill="#ec4899"
                            />
                          </svg>
                        </div>
                      ),
                    };
                  default:
                    return {
                      color: "#cbd5e1",
                      glow: "rgba(203, 213, 225, 0.5)",
                      anim: { scale: [0.5, 1], opacity: [0, 1] },
                      badge: <div />,
                    };
                }
              };

              const config = getRankConfig(rank);

              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* ITEM 1: "Rank Ascended" */}
                  <motion.p
                    initial={{ opacity: 0, y: -20, letterSpacing: "0px" }}
                    animate={{ opacity: 1, y: 0, letterSpacing: "8px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    style={{
                      color: "#94a3b8",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      zIndex: 10,
                      fontSize: "1.2rem",
                      margin: "0 0 2rem 0",
                    }}
                  >
                    Rank Ascended
                  </motion.p>

                  {/* ITEM 2: The Gaming Badge (Explodes in at 0.6s) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: -30 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      bounce: 0.6,
                      duration: 1.0,
                      delay: 0.6,
                    }}
                    style={{ zIndex: 10 }}
                  >
                    {config.badge}
                  </motion.div>

                  {/* ITEM 3: Dynamic Rank Name (Hits at 1.2s) */}
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, ...config.anim }}
                    transition={{
                      type: "spring",
                      bounce: 0.5,
                      duration: 1.2,
                      delay: 1.2,
                    }}
                    style={{
                      color: config.color,
                      fontSize: "6rem",
                      fontWeight: 900,
                      fontStyle: "italic",
                      textTransform: "uppercase",
                      zIndex: 10,
                      margin: "2rem 0 3rem 0",
                      textShadow: `0 0 50px ${config.glow}, 0 0 15px ${config.color}`,
                      letterSpacing: "5px",
                    }}
                  >
                    {rank}
                  </motion.h2>

                  {/* ITEM 4: "Continue" Button (Hits at 2.4s) */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.5, delay: 2.4 }}
                    onClick={() => setShowRankUp(false)}
                    style={{
                      padding: "1rem 4rem",
                      background: config.color,
                      color: "#000",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: 900,
                      fontSize: "1.2rem",
                      cursor: "pointer",
                      zIndex: 10,
                      textTransform: "uppercase",
                      boxShadow: `0 0 30px ${config.glow}`,
                      letterSpacing: "2px",
                    }}
                  >
                    Continue
                  </motion.button>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

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
              </div>
              <div className="leaderboard-list">
                {dynamicLeaderboard.map((user) => (
                  <motion.div
                    key={user.id}
                    className={`leaderboard-item ${user.isMe ? "is-me" : ""}`}
                  >
                    <div
                      className={`leaderboard-rank rank-${user.boardPosition}`}
                    >
                      #{user.boardPosition}
                    </div>

                    <div
                      className="leaderboard-name"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      {/* Flex container pairs the newly generated badge with the name */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        {getRankBadge(user.tierRank, 28)}
                        <span style={{ fontSize: "14px", fontWeight: 700 }}>
                          {user.name} {user.isMe && "(You)"}
                        </span>
                      </div>
                      <span
                        style={{
                          color: user.rankColor,
                          fontSize: "10px",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          textShadow:
                            user.tierRank === "APEX"
                              ? "0 0 8px rgba(13, 240, 212, 0.8)"
                              : "none",
                        }}
                      >
                        {user.tierRank}
                      </span>
                    </div>

                    <div className="leaderboard-stats">
                      <div
                        className="leaderboard-xp"
                        style={{ color: "#eab308", fontWeight: 900 }}
                      >
                        {user.xp.toLocaleString()} XP
                      </div>
                      <div
                        className="leaderboard-acc"
                        style={{
                          fontSize: "11px",
                          color: "#10b981",
                          fontWeight: 800,
                        }}
                      >
                        {user.acc} Acc
                      </div>
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
