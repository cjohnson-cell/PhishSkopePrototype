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
  HelpCircle,
  Medal,
  ShoppingCart,
  Coins,
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
  // --- NEW TIER 1: BEGINNER BATCH ---

  {
    id: 301,
    app: "Staffbase",
    tier: 1,
    isPhish: true,
    sender: "hr@staffbase-employee-portal.com",
    subject: "MANDATORY: Updated 2026 Employee Handbook",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #0028FF; padding: 20px;"><strong style="color: #ffffff; font-size: 22px;">Staffbase</strong></div>
        <div style="padding: 20px; background-color: #ffffff;">
          <h2 style="font-size: 18px; color: #333333;">Action Required: Signature Needed</h2>
          <p style="color: #555555; font-size: 14px;">
            <span data-ioc-id="ioc-greeting" data-ioc-text="Generic Greeting: Authentic HR platforms usually populate your actual first and last name.">Dear Employee,</span>
          </p>
          <p style="color: #555555; font-size: 14px;">
            <span data-ioc-id="ioc-urgency" data-ioc-text="Absurd Threat: HR does not suspend payroll for reading a handbook a few hours late.">Please review and sign the updated Employee Conduct Policy. Failure to sign within 4 hours will result in immediate payroll suspension.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Payload: Connects to a credential harvesting site rather than your internal intranet." style="display: inline-block; background-color: #0028FF; color: #ffffff; padding: 12px 20px; text-decoration: none; font-weight: bold; border-radius: 4px;">Sign Document Now</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Spoofed Domain: Uses a hyphenated, fake '.com' instead of the official staffbase.com.",
      },
      {
        id: "ioc-greeting",
        text: "Generic Greeting: Authentic HR platforms usually populate your actual first and last name.",
      },
      {
        id: "ioc-urgency",
        text: "Absurd Threat: HR does not suspend payroll for reading a handbook a few hours late.",
      },
      {
        id: "ioc-link",
        text: "Malicious Payload: Connects to a credential harvesting site rather than your internal intranet.",
      },
    ],
    lesson:
      "Beginner threats rely on raw panic and generic greetings. HR will never threaten your payroll over a routine handbook update.",
  },

  {
    id: 302,
    app: "Asana",
    tier: 1,
    isPhish: false,
    sender: "no-reply@asana.com",
    subject: "Task Completed: Q1 Marketing Launch",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #ECEAE5; border-radius: 8px;">
        <div style="padding: 30px; text-align: center; border-bottom: 1px solid #ECEAE5;"><h2 style="color: #273347; margin: 0; font-size: 28px;">asana</h2></div>
        <div style="padding: 30px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #1E1F21;">
             <span data-ioc-id="ioc-context" data-ioc-text="Routine Workflow: Automated task completion emails are a standard feature of project management tools."><strong>Sarah Jenkins</strong> marked the task <strong>"Finalize Ad Copy"</strong> as complete in the Q1 Marketing Launch project.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Secure Link: Safely routes directly to your authenticated Asana workspace." style="display: inline-block; background-color: #F06A6A; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View in Asana</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Verified Domain: asana.com is the authorized corporate domain.",
      },
      {
        id: "ioc-context",
        text: "Routine Workflow: Automated task completion emails are a standard feature of project management tools.",
      },
      {
        id: "ioc-link",
        text: "Secure Link: Safely routes directly to your authenticated Asana workspace.",
      },
    ],
    lesson:
      "Routine project management notifications from exact root domains without aggressive urgency are safe.",
  },

  {
    id: 303,
    app: "Knak",
    tier: 1,
    isPhish: true,
    sender: "alerts@knak-builder-app.io",
    subject: "WARNING: Account Suspension Pending",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #FF4A5A; padding: 20px;"><strong style="color: #ffffff; font-size: 22px;">Knak</strong></div>
        <div style="padding: 20px; background-color: #ffffff;">
          <h2 style="font-size: 18px; color: #333333;">Subscription Error</h2>
          <p style="color: #555555; font-size: 14px;">
            <span data-ioc-id="ioc-urgency" data-ioc-text="Destructive Threat: B2B SaaS platforms do not permanently delete your assets with a 1-hour notice.">We were unable to process the renewal for your Knak enterprise seat. All unsaved email campaigns will be permanently deleted in 1 hour.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Link: Points to a fake portal designed to steal your marketing credentials." style="display: inline-block; background-color: #FF4A5A; color: #ffffff; padding: 12px 20px; text-decoration: none; font-weight: bold; border-radius: 4px;">Update Billing Info</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Spoofed Domain: knak-builder-app.io is fake. Official communications use knak.com.",
      },
      {
        id: "ioc-urgency",
        text: "Destructive Threat: B2B SaaS platforms do not permanently delete your assets with a 1-hour notice.",
      },
      {
        id: "ioc-link",
        text: "Malicious Link: Points to a fake portal designed to steal your marketing credentials.",
      },
    ],
    lesson:
      "Legitimate enterprise software will never threaten to delete your hard work with a 1-hour notice to force a login.",
  },

  {
    id: 304,
    app: "Common Room",
    tier: 1,
    isPhish: false,
    sender: "digest@commonroom.io",
    subject: "Your Weekly Community Insights",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e5e5e5; border-radius: 6px;">
        <div style="background-color: #5C27E5; padding: 20px; text-align: center;"><strong style="color: #ffffff; font-size: 22px;">Common Room</strong></div>
        <div style="padding: 25px; background-color: #ffffff;">
          <h2 style="font-size: 18px; color: #333333; margin-top: 0;">Weekly Digest</h2>
          <p style="color: #555555; font-size: 14px;">
            <span data-ioc-id="ioc-context" data-ioc-text="Informational Content: Automated weekly digests are non-urgent, standard reports.">Here is your summary of community activity for the past 7 days. You have 12 new active members across your connected Slack and Discord channels.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Secure Link: Safely routes directly to your authenticated Common Room dashboard." style="display: inline-block; background-color: #5C27E5; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Full Report</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Verified Domain: commonroom.io is the official corporate domain.",
      },
      {
        id: "ioc-context",
        text: "Informational Content: Automated weekly digests are non-urgent, standard reports.",
      },
      {
        id: "ioc-link",
        text: "Secure Link: Safely routes directly to your authenticated Common Room dashboard.",
      },
    ],
    lesson:
      "Automated weekly digests from authorized root domains are standard, safe communications.",
  },

  {
    id: 305,
    app: "Lyra",
    tier: 1,
    isPhish: true,
    sender: "benefits@lyrahealth-update.net",
    subject: "URGENT: Your Mental Health Benefits are Expiring",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e5e5e5; border-radius: 8px;">
        <div style="padding: 20px; border-bottom: 1px solid #e5e5e5;"><strong style="color: #007D8A; font-size: 24px;">Lyra Health</strong></div>
        <div style="padding: 20px; background-color: #ffffff;">
          <h2 style="font-size: 18px; color: #333333; margin-top: 0;">Coverage Status Notice</h2>
          <p style="color: #555555; font-size: 14px;">
             <span data-ioc-id="ioc-manipulation" data-ioc-text="Emotional Exploitation: Attackers weaponize highly sensitive topics like healthcare access to force an immediate reaction.">Your corporate sponsored mental health coverage requires a mandatory profile recertification. If you do not verify your identity, your therapy sessions will be canceled.</span>
          </p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Redirect: Routes to a fake portal designed to harvest both corporate credentials and personal data." style="display: inline-block; background-color: #007D8A; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Identity</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Spoofed Domain: lyrahealth-update.net is fake. Official communications use lyrahealth.com.",
      },
      {
        id: "ioc-manipulation",
        text: "Emotional Exploitation: Attackers weaponize highly sensitive topics like healthcare access to force an immediate reaction.",
      },
      {
        id: "ioc-link",
        text: "Malicious Redirect: Routes to a fake portal designed to harvest both corporate credentials and personal data.",
      },
    ],
    lesson:
      "Attackers aggressively target HR and healthcare benefits to trigger panic. Always verify the sender domain on benefit emails.",
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
  // ==========================================
  // NEW TIER 6: IMPOSSIBLE CHALLENGES
  // ==========================================

  {
    id: 201,
    app: "GitHub",
    tier: 6,
    isPhish: true,
    sender: "security@github-security-alerts.com",
    subject: "[URGENT] Dependabot: Critical RCE Vulnerability",
    body: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; border: 1px solid #e1e4e8; border-radius: 6px;">
        <div style="background-color: #24292e; padding: 20px; border-top-left-radius: 6px; border-top-right-radius: 6px;"><strong style="color: #ffffff; font-size: 20px;">GitHub</strong></div>
        <div style="padding: 24px; background-color: #ffffff;">
          <h2 style="font-size: 18px; color: #cb2431; margin-top: 0;">Critical Security Alert</h2>
          <p style="color: #24292e; font-size: 14px;">
            <span data-ioc-id="ioc-context" data-ioc-text="Behavioral Exploit: Targets developer reflexes. Devs are trained to panic and patch Critical Dependabot alerts immediately to avoid breaches.">Dependabot has detected a Critical Remote Code Execution (RCE) vulnerability in a core dependency for the repository <strong>core-infrastructure</strong>.</span>
          </p>
          <div style="background-color: #f6f8fa; padding: 12px; border-radius: 6px; margin: 16px 0; border: 1px solid #e1e4e8;">
             <code style="font-family: monospace; font-size: 12px; color: #24292e;">
               <span data-ioc-id="ioc-payload" data-ioc-text="Supply Chain Attack: The attacker is tricking the developer into running a malicious script by pointing the npm registry to a compromised domain.">npm install @patched/core-infrastructure --registry=https://npm-registry-patch.com</span>
             </code>
          </div>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Malicious Redirect: The button routes to a fake login portal to harvest developer credentials and bypass MFA." style="display: inline-block; background-color: #2ea44f; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600;">Review Vulnerability</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Spoofed Sender: The domain is github-security-alerts.com, which is fake. GitHub uses github.com.",
      },
      {
        id: "ioc-context",
        text: "Behavioral Exploit: Targets developer reflexes. Devs are trained to panic and patch Critical Dependabot alerts immediately to avoid breaches.",
      },
      {
        id: "ioc-payload",
        text: "Supply Chain Attack: The attacker is tricking the developer into running a malicious script by pointing the npm registry to a compromised domain.",
      },
      {
        id: "ioc-link",
        text: "Malicious Redirect: The button routes to a fake login portal to harvest developer credentials and bypass MFA.",
      },
    ],
    lesson:
      "Impossible threats target highly technical users (like developers) using Supply Chain attacks and fake dependency patches.",
  },

  {
    id: 202,
    app: "Microsoft 365",
    tier: 6,
    isPhish: true,
    sender: "no-reply@microsoft-admin-consent.com",
    subject: "Action Required: Re-authorize Netskope Security Integration",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e5e5e5; border-radius: 8px;">
        <div style="padding: 20px; text-align: center; border-bottom: 1px solid #e5e5e5; background-color: #f8fafc;"><strong style="color: #00a9e0; font-size: 24px;">Netskope Cloud Security</strong></div>
        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="font-size: 18px; color: #0f172a; margin-top: 0;">Authorization Required</h2>
          <p style="color: #475569; font-size: 14px;">
            <span data-ioc-id="ioc-context" data-ioc-text="OAuth Consent Phishing: By tricking you into granting permissions, attackers don't need your password. They just use the permissions you gave them.">The Netskope DLP integration requires updated permissions to scan your Microsoft 365 OneDrive files for sensitive data compliance.</span>
          </p>
          <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #00a9e0; background: #f1f5f9;">
            <p style="margin: 0; font-size: 12px; color: #334155; font-weight: bold;">Requested Permissions:</p>
            <ul style="margin: 10px 0 0 0; font-size: 12px; color: #475569; padding-left: 20px;">
              <li>Read and write all files in all site collections</li>
              <li>Maintain access to data you have given it access to (Offline Access)</li>
            </ul>
          </div>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Illicit App Consent: The URL is technically a real Microsoft login link, but it authorizes a malicious third-party app controlled by the attacker." style="display: inline-block; background-color: #00a9e0; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: 600;">Grant App Permissions</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Spoofed Domain: Official Microsoft consent requests do not come from hyphenated domains like microsoft-admin-consent.com.",
      },
      {
        id: "ioc-context",
        text: "OAuth Consent Phishing: By tricking you into granting permissions, attackers don't need your password. They just use the permissions you gave them.",
      },
      {
        id: "ioc-link",
        text: "Illicit App Consent: The URL is technically a real Microsoft login link, but it authorizes a malicious third-party app controlled by the attacker.",
      },
    ],
    lesson:
      "OAuth Consent Phishing is incredibly dangerous. The login screen is real, but the application you are granting permissions to is malicious.",
  },

  {
    id: 203,
    app: "Netskope Admin",
    tier: 6,
    isPhish: false,
    sender: "system@netskope.com",
    subject: "Tenant Upgrade Completed: Release 115",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e5e5e5; border-radius: 8px;">
        <div style="padding: 20px; background-color: #001a47;"><strong style="color: #00a9e0; font-size: 22px;">Netskope</strong></div>
        <div style="padding: 24px; background-color: #ffffff;">
          <h2 style="font-size: 18px; color: #0f172a; margin-top: 0;">Tenant Upgrade Completed</h2>
          <p style="color: #475569; font-size: 14px;">
            <span data-ioc-id="ioc-context" data-ioc-text="Standard Administrative Notification: Automated platform maintenance updates are safe, routine events for security admins.">Your Netskope Security Cloud tenant has been successfully updated to Release 115. No downtime was experienced.</span>
          </p>
          <p style="color: #475569; font-size: 14px;">New features including Advanced RBI and SaaS Security Posture Management (SSPM) enhancements are now available.</p>
          <a href="#" data-ioc-id="ioc-link" data-ioc-text="Secure Link: Safely routes directly to your authenticated Netskope Admin console." style="display: inline-block; background-color: #00a9e0; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Release Notes</a>
        </div>
      </div>
    `,
    iocs: [
      {
        id: "ioc-sender",
        text: "Verified Domain: The email originated from the official netskope.com root domain.",
      },
      {
        id: "ioc-context",
        text: "Standard Administrative Notification: Automated platform maintenance updates are safe, routine events for security admins.",
      },
      {
        id: "ioc-link",
        text: "Secure Link: Safely routes directly to your authenticated Netskope Admin console.",
      },
    ],
    lesson:
      "At high tiers, you must fight paranoia! Routine system updates from exact root domains with no urgency are completely safe.",
  },
];

// ==========================================
// FORENSIC MAGNIFIER SKINS (LOOT TABLE)
// ==========================================
const MAGNIFIER_SKINS: Record<string, any> = {
  // --- UPGRADED ORIGINAL SKINS ---
  STANDARD: {
    id: "STANDARD",
    name: "Standard Issue",
    rarity: "Common",
    color: "#00a9e0",
    filter: "blur(12px) brightness(1.1)",
    shadow: "rgba(0, 169, 224, 0.2)",
    handleBackground: "linear-gradient(90deg, #001a47, #003380, #001a47)",
    handleWidth: "26px",
    borderWidth: "6px",
    handleRadius: "8px",
    handleGlow: "none",
  },
  AMBER: {
    id: "AMBER",
    name: "Amber Alert",
    rarity: "Common",
    color: "#ff7b00",
    filter: "blur(12px) brightness(1.1)",
    shadow: "rgba(255, 123, 0, 0.2)",
    handleBackground:
      "repeating-linear-gradient(45deg, #431407 0px, #431407 10px, #7c2d12 10px, #7c2d12 20px)",
    handleWidth: "30px",
    borderWidth: "8px",
    handleRadius: "4px",
    handleGlow: "none",
  },
  MIDNIGHT: {
    id: "MIDNIGHT",
    name: "Midnight Ops",
    rarity: "Common",
    color: "#001a47",
    filter: "blur(8px) brightness(0.6) contrast(1.5)",
    shadow: "rgba(0, 26, 71, 0.5)",
    handleBackground:
      "linear-gradient(135deg, #020617 25%, #0f172a 25%, #0f172a 50%, #020617 50%, #020617 75%, #0f172a 75%, #0f172a 100%)",
    handleWidth: "22px",
    handleRadius: "0px",
    borderWidth: "4px",
    handleGlow: "none",
  },
  TERMINAL: {
    id: "TERMINAL",
    name: "Terminal Green",
    rarity: "Rare",
    color: "#10b981",
    filter: "blur(10px) sepia(1) hue-rotate(70deg) brightness(0.8)",
    shadow: "rgba(16, 185, 129, 0.4)",
    handleBackground:
      "repeating-linear-gradient(0deg, #064e3b, #064e3b 2px, #022c22 2px, #022c22 4px)",
    handleWidth: "28px",
    borderWidth: "10px",
    handleRadius: "2px",
    handleGlow: "0 0 15px rgba(16, 185, 129, 0.5)",
  },
  THERMAL: {
    id: "THERMAL",
    name: "Thermal Vision",
    rarity: "Rare",
    color: "#ef4444",
    filter: "blur(12px) invert(1) hue-rotate(180deg)",
    shadow: "rgba(239, 68, 68, 0.4)",
    handleBackground: "linear-gradient(to bottom, #7f1d1d, #dc2626, #f59e0b)",
    handleWidth: "26px",
    borderWidth: "6px",
    handleRadius: "13px",
    handleGlow: "0 0 15px rgba(239, 68, 68, 0.5)",
  },
  GOLD: {
    id: "GOLD",
    name: "Executive Gold",
    rarity: "Epic",
    color: "#fbbf24",
    filter: "blur(8px) brightness(1.3) contrast(1.2)",
    shadow: "rgba(251, 191, 36, 0.6)",
    handleBackground:
      "linear-gradient(90deg, #78350f 0%, #b45309 25%, #fcd34d 50%, #b45309 75%, #78350f 100%)",
    handleWidth: "32px",
    borderWidth: "10px",
    handleRadius: "16px",
    handleGlow: "0 0 25px rgba(251, 191, 36, 0.8)",
  },
  NEON: {
    id: "NEON",
    name: "Neon Pulse",
    rarity: "Epic",
    color: "#ff00ff",
    filter: "blur(12px) saturate(2.5) hue-rotate(90deg)",
    shadow: "rgba(255, 0, 255, 0.6)",
    handleBackground: "linear-gradient(180deg, #0df0d4, #ff00ff)",
    handleWidth: "20px",
    borderWidth: "8px",
    handleRadius: "4px",
    handleGlow: "0 0 25px rgba(13, 240, 212, 0.8)",
  },
  ANOMALY: {
    id: "ANOMALY",
    name: "The Anomaly",
    rarity: "Legendary",
    color: "#0df0d4",
    filter: "blur(16px) contrast(2) saturate(3) hue-rotate(-45deg)",
    shadow: "rgba(13, 240, 212, 0.8)",
    handleBackground: "radial-gradient(circle, #ffffff, #0df0d4, #0f172a)",
    handleWidth: "16px",
    borderWidth: "4px",
    lensSize: 280,
    handleGlow: "0 0 30px #ffffff",
    isAnimated: true,
  },

  // --- NEW COMMON SKINS ---
  WOOD: {
    id: "WOOD",
    name: "Classic Mahogany",
    rarity: "Common",
    color: "#b45309",
    filter: "blur(10px) sepia(0.3)",
    shadow: "rgba(180, 83, 9, 0.2)",
    handleBackground: "linear-gradient(90deg, #451a03, #78350f, #451a03)",
    handleGlow: "none",
    handleWidth: "30px",
    handleRadius: "4px",
  },
  CARBON: {
    id: "CARBON",
    name: "Carbon Fiber",
    rarity: "Common",
    color: "#94a3b8",
    filter: "blur(14px) grayscale(0.5)",
    shadow: "rgba(148, 163, 184, 0.3)",
    handleBackground:
      "repeating-linear-gradient(45deg, #0f172a, #0f172a 4px, #1e293b 4px, #1e293b 8px)",
    handleGlow: "none",
    handleWidth: "28px",
  },
  IVORY_RIB: {
    id: "IVORY_RIB",
    name: "The Investigator",
    rarity: "Common",
    color: "#d97706",
    filter: "blur(12px) brightness(1.05)",
    shadow: "rgba(217, 119, 6, 0.2)",
    handleBackground:
      "repeating-linear-gradient(90deg, #fdfbf7, #fdfbf7 6px, #e2e8f0 6px, #e2e8f0 10px)",
    handleGlow: "none",
    handleWidth: "36px",
    handleRadius: "8px",
  },

  // --- NEW RARE SKINS ---
  BOTANIST: {
    id: "BOTANIST",
    name: "Forest Relic",
    rarity: "Rare",
    color: "#65a30d",
    filter: "blur(10px) sepia(0.5) hue-rotate(40deg)",
    shadow: "rgba(101, 163, 13, 0.3)",
    handleBackground: "linear-gradient(to right, #27272a, #3f3f46, #27272a)",
    handleGlow: "none",
    handleWidth: "16px",
    handleRadius: "10px",
    borderWidth: "8px",
  },
  ART_DECO: {
    id: "ART_DECO",
    name: "Art Deco",
    rarity: "Rare",
    color: "#cbd5e1",
    filter: "blur(12px) contrast(1.2)",
    shadow: "rgba(203, 213, 225, 0.4)",
    handleBackground:
      "repeating-linear-gradient(45deg, #020617 0, #020617 10px, #f8fafc 10px, #f8fafc 20px)",
    handleGlow: "0 0 15px rgba(255,255,255,0.2)",
    handleWidth: "34px",
    handleRadius: "0px",
  },

  // --- NEW EPIC SKINS ---
  ROYAL_ETCH: {
    id: "ROYAL_ETCH",
    name: "Royal Etching",
    rarity: "Epic",
    color: "#f59e0b",
    filter: "blur(10px) brightness(1.2) contrast(1.1)",
    shadow: "rgba(245, 158, 11, 0.5)",
    handleBackground:
      "repeating-linear-gradient(135deg, #b45309, #f59e0b 5px, #d97706 10px)",
    handleGlow: "0 0 20px rgba(245, 158, 11, 0.4)",
    handleWidth: "24px",
    handleRadius: "12px",
  },
  BEADED: {
    id: "BEADED",
    name: "Imperial Beads",
    rarity: "Epic",
    color: "#fbbf24",
    filter: "blur(14px) brightness(1.1)",
    shadow: "rgba(251, 191, 36, 0.5)",
    handleBackground:
      "radial-gradient(circle at 50% 50%, #818cf8 10%, #312e81 40%, #000 90%)",
    handleGlow: "0 0 25px rgba(129, 140, 248, 0.6)",
    handleWidth: "38px",
    handleRadius: "20px",
  },

  // --- NEW LEGENDARY SKIN ---
  QUANTUM: {
    id: "QUANTUM",
    name: "Quantum Lens",
    rarity: "Legendary",
    color: "#a855f7",
    filter: "blur(18px) saturate(4) hue-rotate(-90deg) contrast(1.5)",
    shadow: "rgba(168, 85, 247, 0.9)",
    handleBackground: "linear-gradient(180deg, #c026d3, #4c1d95)",
    handleGlow: "0 0 40px #c026d3",
    handleWidth: "18px",
    lensSize: 180,
    borderWidth: "12px",
    isAnimated: true,
  },
  // --- NEW MYTHICAL SKIN (1%) ---
  VOID_WALKER: {
    id: "VOID_WALKER",
    name: "Void Walker",
    rarity: "Mythical",
    color: "#f43f5e",
    filter: "blur(20px) contrast(3) saturate(0) invert(1)",
    shadow: "rgba(244, 63, 94, 1)",
    handleBackground: "radial-gradient(circle, #000000, #4c0519)",
    handleWidth: "12px",
    borderWidth: "2px",
    lensSize: 300,
    handleGlow: "0 0 50px #f43f5e",
    isAnimated: true,
  },
};
const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "Common":
      return "#94a3b8"; // Gray
    case "Rare":
      return "#3b82f6"; // Blue
    case "Epic":
      return "#a855f7"; // Purple
    case "Legendary":
      return "#eab308"; // Gold
    case "Mythical":
      return "#f43f5e"; // Crimson/Rose
    default:
      return "#fff";
  }
};

// ==========================================
// ENVIRONMENT / BACKGROUND DATABASE
// ==========================================
const BACKGROUNDS_DB: Record<string, any> = {
  DEFAULT: {
    id: "DEFAULT",
    name: "Standard Issue",
    rarity: "Common",
    price: 0,
    cssClass: "theme-default",
  },
  DARK_OPS: {
    id: "DARK_OPS",
    name: "Dark Ops",
    rarity: "Common",
    price: 0,
    cssClass: "theme-dark",
  },
  BEACH: {
    id: "BEACH",
    name: "Beach Oasis",
    rarity: "Rare",
    price: 2000,
    cssClass: "theme-beach",
  },
  HACKER: {
    id: "HACKER",
    name: "Terminal Grid",
    rarity: "Epic",
    price: 3000,
    cssClass: "theme-hacker",
  },
  CYBERPUNK: {
    id: "CYBERPUNK",
    name: "Neon City",
    rarity: "Legendary",
    price: 4000,
    cssClass: "theme-cyberpunk",
  },
  WAR_ROOM: {
    id: "WAR_ROOM",
    name: "IR War Room",
    rarity: "Mythical",
    price: 5000,
    cssClass: "theme-war-room",
  },
};

// ==========================================
// 50-PLAYER MOCK LEADERBOARD GENERATOR
// (To be replaced with Postgres API fetch)
// ==========================================
const generateMockLeaderboard = () => {
  const prefixes = [
    "SecOps",
    "Cyber",
    "Net",
    "Cloud",
    "Zero",
    "Phish",
    "Byte",
    "Threat",
    "Patch",
    "Iron",
    "Ur",
    "Hacker",
    "Gamer",
    "Mr",
  ];
  const suffixes = [
    "_Ninja",
    "_Knight",
    ".Dev",
    ".HR",
    "_Admin",
    "_Guru",
    "_Hunter",
    "Slayer",
    "_Logic",
    "Watcher",
    "Mom",
    "Dad",
    "Cooked",
    "Bro",
    "Worm",
  ];

  const board = [];
  // Generate 49 highly competitive NPCs
  for (let i = 0; i < 199; i++) {
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const rankXp = Math.floor(Math.random() * 11500) + 500; // Mix of Iron through Apex
    const accuracy = Math.floor(Math.random() * 25 + 75); // 75% to 100%

    board.push({
      id: `npc_${i}`,
      name: `${randomPrefix}${randomSuffix}_${i}`,
      xp: rankXp,
      acc: `${accuracy}%`,
    });
  }
  return board.sort((a, b) => b.xp - a.xp);
};

const BASE_LEADERBOARD = generateMockLeaderboard();

// ==========================================
// SHOP PRICING & ACHIEVEMENTS DATABASE
// ==========================================
const getSkinPrice = (rarity: string) => {
  switch (rarity) {
    case "Common":
      return 250;
    case "Rare":
      return 750;
    case "Epic":
      return 2500;
    case "Legendary":
      return 7500;
    case "Mythical":
      return 25000;
    default:
      return 99999;
  }
};

const ACHIEVEMENTS_DB = [
  // Consistency (Total Solves)
  {
    id: "ach_tot_1",
    title: "Novice Analyst",
    desc: "Complete 1 investigation.",
    reward: 25,
    type: "total",
    target: 1,
  },
  {
    id: "ach_tot_2",
    title: "Getting the Hang of It",
    desc: "Complete 5 investigations.",
    reward: 75,
    type: "total",
    target: 5,
  },
  {
    id: "ach_tot_3",
    title: "The Investigator",
    desc: "Complete 10 investigations.",
    reward: 150,
    type: "total",
    target: 10,
  },
  {
    id: "ach_tot_4",
    title: "Lead Detective",
    desc: "Complete 25 investigations.",
    reward: 400,
    type: "total",
    target: 25,
  },
  {
    id: "ach_tot_5",
    title: "Chief of Security",
    desc: "Complete 50 investigations.",
    reward: 1000,
    type: "total",
    target: 50,
  },

  // Streaks (General)
  {
    id: "ach_str_1",
    title: "Warming Up",
    desc: "Reach an accuracy streak of 3.",
    reward: 50,
    type: "streak",
    target: 3,
  },
  {
    id: "ach_str_2",
    title: "Hot Streak",
    desc: "Reach an accuracy streak of 10.",
    reward: 200,
    type: "streak",
    target: 10,
  },
  {
    id: "ach_str_3",
    title: "Unbreakable",
    desc: "Reach an accuracy streak of 20.",
    reward: 500,
    type: "streak",
    target: 20,
  },
  {
    id: "ach_str_4",
    title: "Flawless Execution",
    desc: "Reach an accuracy streak of 50.",
    reward: 2500,
    type: "streak",
    target: 50,
  },

  // Safe Streaks
  {
    id: "ach_saf_1",
    title: "Trust Anchor I",
    desc: "Correctly identify 3 SAFE emails in a row.",
    reward: 75,
    type: "safe_streak",
    target: 3,
  },
  {
    id: "ach_saf_2",
    title: "Trust Anchor II",
    desc: "Correctly identify 10 SAFE emails in a row.",
    reward: 300,
    type: "safe_streak",
    target: 10,
  },
  {
    id: "ach_saf_3",
    title: "Trust Anchor III",
    desc: "Correctly identify 20 SAFE emails in a row.",
    reward: 1000,
    type: "safe_streak",
    target: 20,
  },

  // Phish Streaks
  {
    id: "ach_phi_1",
    title: "Threat Hunter I",
    desc: "Correctly identify 3 PHISH emails in a row.",
    reward: 75,
    type: "phish_streak",
    target: 3,
  },
  {
    id: "ach_phi_2",
    title: "Threat Hunter II",
    desc: "Correctly identify 10 PHISH emails in a row.",
    reward: 300,
    type: "phish_streak",
    target: 10,
  },
  {
    id: "ach_phi_3",
    title: "Threat Hunter III",
    desc: "Correctly identify 20 PHISH emails in a row.",
    reward: 1000,
    type: "phish_streak",
    target: 20,
  },

  // Rank Ascensions
  {
    id: "ach_rnk_cop",
    title: "Ascension: Copper",
    desc: "Reach COPPER Rank (1,000 XP).",
    reward: 500,
    type: "rank",
    target: 1000,
  },
  {
    id: "ach_rnk_gld",
    title: "Ascension: Gold",
    desc: "Reach GOLD Rank (2,500 XP).",
    reward: 1000,
    type: "rank",
    target: 2500,
  },
  {
    id: "ach_rnk_tit",
    title: "Ascension: Titanium",
    desc: "Reach TITANIUM Rank (4,500 XP).",
    reward: 2000,
    type: "rank",
    target: 4500,
  },
  {
    id: "ach_rnk_rub",
    title: "Ascension: Ruby",
    desc: "Reach RUBY Rank (7,000 XP).",
    reward: 3500,
    type: "rank",
    target: 7000,
  },
  {
    id: "ach_rnk_apx",
    title: "The Apex Predator",
    desc: "Reach APEX Rank (10,000 XP).",
    reward: 5000,
    type: "rank",
    target: 10000,
  },
  // Classified Easter Egg
  {
    id: "ach_sec_benevac",
    title: "The Benevac Protocol",
    desc: "Acknowledge the Architect: Maintain 98% accuracy across 100 investigations.",
    reward: 20000,
    type: "secret",
    target: 100,
    isSecret: true,
  },
];

export default function App() {
  const [username, setUsername] = useState("");
  const [xp, setXp] = useState(0);
  const [rank, setRank] = useState("IRON");
  const [streak, setStreak] = useState(0);
  const [inspectorActive, setInspectorActive] = useState(false);
  const [showRankUp, setShowRankUp] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [totalDecisions, setTotalDecisions] = useState(0);
  const [correctDecisions, setCorrectDecisions] = useState(0);

  const [foundIoCs, setFoundIoCs] = useState<string[]>([]);
  const [hoveredIoC, setHoveredIoC] = useState<{
    id: string;
    text: string;
  } | null>(null);
  // --- INVENTORY & CRATE STATE ---
  const [crates, setCrates] = useState(0);
  const [inventory, setInventory] = useState<string[]>(["STANDARD"]);
  const [equippedSkin, setEquippedSkin] = useState("STANDARD");
  const [showInventory, setShowInventory] = useState(false);
  const [showUnboxing, setShowUnboxing] = useState(false);
  const [rouletteItems, setRouletteItems] = useState<any[]>([]);
  const [wonSkin, setWonSkin] = useState<any>(null);
  const [lastXpThreshold, setLastXpThreshold] = useState(0);
  const [spinKey, setSpinKey] = useState(0); // Forces roulette animation to reset

  // --- ECONOMY & ACHIEVEMENTS STATE ---
  const [skopeCoins, setSkopeCoins] = useState(0);
  const [showAchievements, setShowAchievements] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(
    []
  );
  const [safeStreakCount, setSafeStreakCount] = useState(0);
  const [phishStreakCount, setPhishStreakCount] = useState(0);
  const [shopTab, setShopTab] = useState<"INVENTORY" | "SHOP">("INVENTORY");
  const [shopCategory, setShopCategory] = useState<
    "MAGNIFIERS" | "ENVIRONMENTS"
  >("MAGNIFIERS");
  const [unlockedBackgrounds, setUnlockedBackgrounds] = useState<string[]>([
    "DEFAULT",
    "DARK_OPS",
  ]);
  const [equippedBackground, setEquippedBackground] = useState("DEFAULT");
  const [achievementToasts, setAchievementToasts] = useState<any[]>([]);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicateCoinReward, setDuplicateCoinReward] = useState(0);

  // NEW: Force the app to ALWAYS find a Tier 1 email on startup
  const initialEmail =
    EMAIL_DATABASE.find((e) => e.tier === 1) || EMAIL_DATABASE[0];

  const [seenEmailIds, setSeenEmailIds] = useState<number[]>([initialEmail.id]);
  const RANK_THRESHOLDS = {
    IRON: 0,
    COPPER: 1000,
    GOLD: 2500,
    TITANIUM: 4500,
    RUBY: 7000,
    APEX: 10000,
  };
  const multiplier = streak >= 5 ? 3 : streak >= 3 ? 2 : 1;

  // NEW: Shared rank calculation for Player and Leaderboard
  const getRankFromXp = (v: number) => {
    if (v < RANK_THRESHOLDS.COPPER) return "IRON";
    if (v < RANK_THRESHOLDS.GOLD) return "COPPER";
    if (v < RANK_THRESHOLDS.TITANIUM) return "GOLD";
    if (v < RANK_THRESHOLDS.RUBY) return "TITANIUM";
    if (v < RANK_THRESHOLDS.APEX) return "RUBY";
    return "APEX";
  };

  const getRankColor = (r: string) => {
    switch (r) {
      case "IRON":
        return "#94a3b8";
      case "COPPER":
        return "#d97706";
      case "GOLD":
        return "#fbbf24";
      case "TITANIUM":
        return "#e2e8f0";
      case "RUBY":
        return "#e11d48";
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

      case "RUBY":
        return (
          <svg
            viewBox="0 0 100 100"
            style={{
              width: size,
              height: size,
              filter: "drop-shadow(0 0 8px rgba(225, 29, 72, 0.8))",
              flexShrink: 0,
            }}
          >
            <polygon
              points="50,5 95,25 95,75 50,95 5,75 5,25"
              fill="#4c0519"
              stroke="#e11d48"
              strokeWidth="6"
              strokeLinejoin="round"
            />
            <polygon points="50,15 85,32 50,50 15,32" fill="#fb7185" />
            <polygon points="85,32 85,68 50,85 50,50" fill="#9f1239" />
            <polygon points="15,32 50,50 50,85 15,68" fill="#e11d48" />
            <polygon points="50,25 70,40 50,70 30,40" fill="#f43f5e" />
            <polygon points="50,30 55,40 50,55 45,40" fill="#fff1f2" />
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

  const getDifficultyTier = (currentRank: string) => {
    switch (currentRank) {
      case "IRON":
        return 1;
      case "COPPER":
        return 2;
      case "GOLD":
        return 3;
      case "TITANIUM":
        return 4;
      case "RUBY":
        return 5;
      case "APEX":
        return 6;
      default:
        return 1;
    }
  };

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
    .slice(0, 200);

  useEffect(() => {
    // 1. RANK UP CHECK
    const newRank = getRankFromXp(xp);
    if (newRank !== rank && xp > 0) {
      setRank(newRank);
      setShowRankUp(true);
      setCrates((prev) => prev + 1); // Rank up reward

      const rankUpSound = new Audio(
        "https://actions.google.com/sounds/v1/science_fiction/power_up_flash.ogg"
      );
      rankUpSound.volume = 0.6;
      rankUpSound.play().catch((e) => console.log(e));
    }

    // 2. 500 XP MILESTONE CHECK
    const currentThreshold = Math.floor(xp / 500);
    if (currentThreshold > lastXpThreshold) {
      const cratesEarned = currentThreshold - lastXpThreshold;
      setCrates((prev) => prev + cratesEarned);
      setLastXpThreshold(currentThreshold);

      const crateEarnedSound = new Audio(
        "https://actions.google.com/sounds/v1/glass/glass_clink.ogg"
      );
      crateEarnedSound.volume = 0.3;
      crateEarnedSound.play().catch((e) => console.log(e));
    }
  }, [xp, rank, lastXpThreshold]);

  // Helper to determine Coin payout for duplicates
  const getDuplicateCoins = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return 25;
      case "Rare":
        return 75;
      case "Epic":
        return 200;
      case "Legendary":
        return 750;
      case "Mythical":
        return 2500;
      default:
        return 25;
    }
  };

  // CRATE UNBOXING LOGIC
  const openCrate = () => {
    if (crates <= 0) return;
    setCrates((prev) => prev - 1);
    setWonSkin(null);
    setShowUnboxing(true);
    setSpinKey((prev) => prev + 1); // Triggers the animation reset

    const getRandomSkin = () => {
      const roll = Math.random() * 100;
      let rarity = "Common";
      if (roll > 50 && roll <= 79) rarity = "Rare";
      if (roll > 79 && roll <= 94) rarity = "Epic";
      if (roll > 94 && roll <= 99) rarity = "Legendary";
      if (roll > 99) rarity = "Mythical";

      // Exclude "STANDARD" from being rolled in crates
      const availableSkins = Object.values(MAGNIFIER_SKINS).filter(
        (s) => s.rarity === rarity && s.id !== "STANDARD"
      );

      // Fallback in case of weird math bounds
      if (availableSkins.length === 0) return MAGNIFIER_SKINS["AMBER"];

      return availableSkins[Math.floor(Math.random() * availableSkins.length)];
    };

    // 1. Roll the actual prize first
    const winningItem = getRandomSkin();

    // 2. Check if the user already owns it right now
    const alreadyOwned = inventory.includes(winningItem.id);
    const bonusCoins = alreadyOwned ? getDuplicateCoins(winningItem.rarity) : 0;

    // 3. Build the visually diverse roulette track (no adjacent duplicates)
    const spinArray = [];
    const allSkins = Object.values(MAGNIFIER_SKINS).filter(
      (s) => s.id !== "STANDARD"
    );

    for (let i = 0; i < 50; i++) {
      if (i === 45) {
        // Slot 45 is the guaranteed stop point
        spinArray.push(winningItem);
      } else {
        let filler;
        let attempts = 0;
        do {
          filler = allSkins[Math.floor(Math.random() * allSkins.length)];
          attempts++;
        } while (
          attempts < 10 &&
          ((i > 0 && filler.id === spinArray[i - 1].id) ||
            (i === 44 && filler.id === winningItem.id))
        );
        spinArray.push(filler);
      }
    }

    setRouletteItems(spinArray);

    // Wait for the animation, then award the item/coins and update UI
    setTimeout(() => {
      setWonSkin(winningItem);
      setIsDuplicate(alreadyOwned);

      if (alreadyOwned) {
        setDuplicateCoinReward(bonusCoins);
        setSkopeCoins((prev) => prev + bonusCoins); // Award coins instead of XP
      } else {
        setInventory((prev) => [...prev, winningItem.id]);
      }
    }, 5500);
  };

  const getProgressPercentage = () => {
    if (xp >= RANK_THRESHOLDS.APEX) return 100;
    let currentBase = 0;
    let nextTarget = RANK_THRESHOLDS.COPPER;

    if (xp >= RANK_THRESHOLDS.RUBY) {
      currentBase = RANK_THRESHOLDS.RUBY;
      nextTarget = RANK_THRESHOLDS.APEX;
    } else if (xp >= RANK_THRESHOLDS.TITANIUM) {
      currentBase = RANK_THRESHOLDS.TITANIUM;
      nextTarget = RANK_THRESHOLDS.RUBY;
    } else if (xp >= RANK_THRESHOLDS.GOLD) {
      currentBase = RANK_THRESHOLDS.GOLD;
      nextTarget = RANK_THRESHOLDS.TITANIUM;
    } else if (xp >= RANK_THRESHOLDS.COPPER) {
      currentBase = RANK_THRESHOLDS.COPPER;
      nextTarget = RANK_THRESHOLDS.GOLD;
    }
    return ((xp - currentBase) / (nextTarget - currentBase)) * 100;
  };

  const handleDecision = (choice: string) => {
    if (feedback) return;

    if (foundIoCs.length < activeEmail.iocs.length) {
      setFeedback({
        type: "warning",
        text: `Protocol Violation: You only logged ${foundIoCs.length} of ${activeEmail.iocs.length} pieces of evidence. Inspect the sender, links, and context to verify if this is safe or a threat.`,
      });
      return;
    }

    const isCorrect =
      (choice === "PHISH" && activeEmail.isPhish) ||
      (choice === "SAFE" && !activeEmail.isPhish);

    // --- SYNCHRONOUS TRACKING FOR SECRET ACHIEVEMENTS ---
    const newTotalDecisions = totalDecisions + 1;
    setTotalDecisions(newTotalDecisions);

    if (isCorrect) {
      const newCorrect = correctDecisions + 1;
      setCorrectDecisions(newCorrect);

      // Calculate live accuracy right now for the Benevac Protocol
      const currentAccuracy = (newCorrect / newTotalDecisions) * 100;

      const xpGained = 100 * multiplier;
      const newXp = xp + xpGained;
      setXp(newXp);

      const newStreak = streak + 1;
      setStreak(newStreak);

      const newSafeStreak = choice === "SAFE" ? safeStreakCount + 1 : 0;
      const newPhishStreak = choice === "PHISH" ? phishStreakCount + 1 : 0;
      setSafeStreakCount(newSafeStreak);
      setPhishStreakCount(newPhishStreak);

      // --- ACHIEVEMENT CHECKER ---
      let coinsEarnedThisRound = 0;
      let unlockedThisRound: string[] = [];

      ACHIEVEMENTS_DB.forEach((ach) => {
        if (!unlockedAchievements.includes(ach.id)) {
          let achieved = false;
          if (ach.type === "total" && newCorrect >= ach.target) achieved = true;
          if (ach.type === "streak" && newStreak >= ach.target) achieved = true;
          if (ach.type === "safe_streak" && newSafeStreak >= ach.target)
            achieved = true;
          if (ach.type === "phish_streak" && newPhishStreak >= ach.target)
            achieved = true;
          if (ach.type === "rank" && newXp >= ach.target) achieved = true;

          // SECRET: The Benevac Protocol
          if (ach.type === "secret" && ach.id === "ach_sec_benevac") {
            if (newTotalDecisions >= 100 && currentAccuracy >= 98)
              achieved = true;
          }

          if (achieved) {
            unlockedThisRound.push(ach.id);
            coinsEarnedThisRound += ach.reward;
          }
        }
      });

      if (unlockedThisRound.length > 0) {
        setUnlockedAchievements((prev) => [...prev, ...unlockedThisRound]);
        setSkopeCoins((prev) => prev + coinsEarnedThisRound);

        // --- NEW: Trigger the Achievement Animation Toast ---
        const unlockedObjs = ACHIEVEMENTS_DB.filter((ach) =>
          unlockedThisRound.includes(ach.id)
        );
        setAchievementToasts(unlockedObjs);

        // Auto-dismiss the animation after 2.5 seconds
        setTimeout(() => setAchievementToasts([]), 2500);
      }

      const achievementText =
        unlockedThisRound.length > 0
          ? ` 🏆 +${coinsEarnedThisRound} Coins from Achievements!`
          : "";

      setFeedback({
        type: "success",
        text: `Correct! ${activeEmail.lesson} (+${xpGained} XP)${achievementText}`,
      });
    } else {
      setStreak(0);
      setSafeStreakCount(0);
      setPhishStreakCount(0);
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

    // 1. CUMULATIVE RANK REQUIREMENT: Mix in all unlocked difficulty tiers
    const rankSpecificEmails = EMAIL_DATABASE.filter(
      (email) => email.tier <= currentTier
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

        // NEW: If this is the last piece of evidence, turn off the inspector automatically
        if (foundIoCs.length + 1 === activeEmail.iocs.length) {
          setInspectorActive(false);
          setHoveredIoC(null); // Clears the tooltip so it doesn't get stuck
        }

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
    <div
      className={`app-container ${BACKGROUNDS_DB[equippedBackground].cssClass}`}
    >
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
            <span style={{ color: "#ffffff" }}>PHISH</span>
            <span
              style={{
                color: "#00a9e0",
                textShadow: "0 0 12px rgba(0, 169, 224, 0.5)",
              }}
            >
              SKOPE
            </span>
          </span>
        </div>

        <div
          className="rank-section"
          style={{ flex: "none", paddingBottom: "10px" }}
        >
          <div className="rank-label">Investigator ID</div>
          <input
            type="text"
            className="username-input"
            placeholder="Enter Your Name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="rank-label">Current Rank</div>
          <h2
            className="rank-title"
            style={{
              color: getRankColor(rank),
              textShadow:
                rank === "APEX"
                  ? `0 0 15px ${getRankColor(rank)}, 0 0 5px #fff`
                  : `0 0 15px ${getRankColor(rank)}80`,
            }}
          >
            {rank}
          </h2>

          {/* DYNAMIC XP COUNTER & FIRE BAR */}
          {(() => {
            let nextRank = "MAX RANK";
            let nextTarget = xp;
            if (xp < RANK_THRESHOLDS.COPPER) {
              nextRank = "COPPER";
              nextTarget = RANK_THRESHOLDS.COPPER;
            } else if (xp < RANK_THRESHOLDS.GOLD) {
              nextRank = "GOLD";
              nextTarget = RANK_THRESHOLDS.GOLD;
            } else if (xp < RANK_THRESHOLDS.TITANIUM) {
              nextRank = "TITANIUM";
              nextTarget = RANK_THRESHOLDS.TITANIUM;
            } else if (xp < RANK_THRESHOLDS.RUBY) {
              nextRank = "RUBY";
              nextTarget = RANK_THRESHOLDS.RUBY;
            } else if (xp < RANK_THRESHOLDS.APEX) {
              nextRank = "APEX";
              nextTarget = RANK_THRESHOLDS.APEX;
            }

            const isMax = nextRank === "MAX RANK";

            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    marginTop: "15px",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      color: "#94a3b8",
                      fontSize: "12px",
                      fontWeight: 900,
                      letterSpacing: "1px",
                    }}
                  >
                    {xp.toLocaleString()} XP
                  </div>
                  {!isMax && (
                    <div
                      style={{
                        color: getRankColor(nextRank),
                        fontSize: "10px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                      }}
                    >
                      {(nextTarget - xp).toLocaleString()} XP TO {nextRank}
                    </div>
                  )}
                </div>

                <div className="xp-bar-container" style={{ marginTop: 0 }}>
                  <motion.div
                    className="xp-bar-fill"
                    animate={{
                      width: `${getProgressPercentage()}%`,
                      // The Fire Animation overrides the standard blue background
                      background:
                        streak >= 3
                          ? [
                              "linear-gradient(90deg, #ff7b00, #f59e0b)",
                              "linear-gradient(90deg, #dc2626, #ff7b00)",
                              "linear-gradient(90deg, #ff7b00, #f59e0b)",
                            ]
                          : "linear-gradient(90deg, #00a9e0, #00a9e0)",
                      boxShadow:
                        streak >= 3
                          ? [
                              "0 0 15px rgba(255, 123, 0, 0.6)",
                              "0 0 25px rgba(239, 68, 68, 0.9)",
                              "0 0 15px rgba(255, 123, 0, 0.6)",
                            ]
                          : "0 0 15px rgba(0, 169, 224, 0.6)",
                    }}
                    transition={{
                      width: { duration: 0.5, ease: "easeOut" },
                      background:
                        streak >= 3
                          ? { duration: 1.5, repeat: Infinity, ease: "linear" }
                          : { duration: 0.3 },
                      boxShadow:
                        streak >= 3
                          ? { duration: 1.5, repeat: Infinity, ease: "linear" }
                          : { duration: 0.3 },
                    }}
                  />
                </div>
              </>
            );
          })()}

          {streak >= 3 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="streak-badge"
            >
              <Flame size={14} fill="currentColor" />
              <span>{multiplier}X MULTIPLIER ACTIVE</span>
            </motion.div>
          )}
          <div
            style={{
              fontSize: "10px",
              color: "#64748b",
              marginTop: "10px",
              fontWeight: 800,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>CURRENT STREAK: {streak}</span>
            <span
              style={{
                color: "#fbbf24",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Coins size={12} /> {skopeCoins.toLocaleString()} COINS
            </span>
          </div>
        </div>

        {/* --- REORDERED & THEMED ACTION BUTTONS --- */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "10px",
          }}
        >
          {/* 1. CRATE BUTTON (Appears at the top if crates > 0) */}
          {crates > 0 && (
            <button
              onClick={openCrate}
              className="sidebar-btn-secondary"
              style={{
                margin: 0,
                background: "linear-gradient(90deg, #ff7b00, #e66e00)",
                borderColor: "#ffba7a",
                color: "#fff",
                boxShadow: "0 0 15px rgba(255, 123, 0, 0.4)",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                transform: "scale(1.02)",
              }}
            >
              📦 DECRYPT CRATE ({crates})
            </button>
          )}

          {/* 3. ARMORY & SHOP BUTTON (Cyan Theme) */}
          <button
            onClick={() => {
              setShowInventory(true);
              setShopTab("INVENTORY");
            }}
            className="sidebar-btn-secondary"
            style={{
              margin: 0,
              background: "rgba(0, 169, 224, 0.1)",
              borderColor: "#00a9e0",
              color: "#00a9e0",
              boxShadow: "0 0 10px rgba(0, 169, 224, 0.15)",
            }}
          >
            <ShoppingCart size={16} /> SHOP/INVENTORY
          </button>

          {/* 4. GLOBAL LEADERBOARD BUTTON (Netskope Dark Slate Theme) */}
          <button
            onClick={() => setShowLeaderboard(true)}
            className="sidebar-btn-secondary"
            style={{
              margin: 0,
              background: "#0f172a", // Darker slate to contrast with sidebar
              borderColor: "#334155",
              color: "#cbd5e1",
            }}
          >
            <Trophy size={16} /> Global Leaderboard
          </button>

          {/* 4. ACHIEVEMENTS BUTTON (Gold Theme) */}
          <button
            onClick={() => setShowAchievements(true)}
            className="sidebar-btn-secondary"
            style={{
              margin: 0,
              background: "rgba(251, 191, 36, 0.1)",
              borderColor: "#fbbf24",
              color: "#fbbf24",
              boxShadow: "0 0 10px rgba(251, 191, 36, 0.15)",
            }}
          >
            <Medal size={16} /> ACHIEVEMENTS
          </button>

          {/* 5. INSTRUCTIONS BUTTON (Neutral Help Theme) */}
          <button
            onClick={() => setShowInstructions(true)}
            className="sidebar-btn-secondary"
            style={{
              margin: 0,
              background: "transparent",
              borderColor: "#334155",
              color: "#94a3b8",
            }}
          >
            <HelpCircle size={16} /> How to Play
          </button>
        </div>
      </aside>
      {/* 2 & 3. MAIN VIEW (INBOX + READING PANE) */}

      {/* FORCE CURSOR HIDING & INVISIBLE HITBOX EXPANSION WHEN INSPECTOR IS ON */}
      {inspectorActive && (
        <style>{`
          .content-wrapper, .content-wrapper * {
            cursor: none !important;
          }

          /* UX TRICK: Inflate the clickable area of the evidence by 8 pixels 
             in every direction using an invisible pseudo-element. 
             This prevents frustrating "near misses" without altering the visual layout
             or making the hitbox so large it guides the user blindly.
          */
          [data-ioc-id] {
            position: relative;
          }
          
          [data-ioc-id]::after {
            content: '';
            position: absolute;
            top: -8px;
            bottom: -8px;
            left: -8px;
            right: -8px;
            z-index: 5;
            cursor: none;
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
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {/* NEW LOCATION: Inspector Tool right above the email */}
              <button
                onClick={() => {
                  setInspectorActive(!inspectorActive);
                  if (inspectorActive) setHoveredIoC(null);
                }}
                className={`inspector-toggle ${
                  inspectorActive ? "toggle-on" : "toggle-off"
                }`}
                style={{
                  padding: "0.6rem 1.5rem", // Tweaked to match the Safe/Phish buttons
                  borderRadius: "99px", // Pill-shape
                  fontSize: "0.875rem",
                  boxShadow: inspectorActive
                    ? "0 0 20px rgba(0, 169, 224, 0.4)"
                    : "none",
                }}
              >
                <Search size={16} />{" "}
                {inspectorActive ? "INSPECTOR ON" : "ENABLE INSPECTOR"}
              </button>

              {/* Subtle divider to separate tools from final decisions */}
              <div
                style={{
                  width: "2px",
                  height: "24px",
                  background: "#e2e8f0",
                  margin: "0 4px",
                  borderRadius: "2px",
                }}
              />

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

      {inspectorActive &&
        (() => {
          const skin = MAGNIFIER_SKINS[equippedSkin];
          const isFinding =
            hoveredIoC || foundIoCs.includes(hoveredIoC?.id || "");
          const lensSize = skin.lensSize || 240; // Dynamic lens size
          const offset = lensSize / 2;

          return (
            <motion.div
              className="magnifier"
              animate={{
                x: mousePos.x - offset,
                y: mousePos.y - offset,
                borderColor:
                  skin.isAnimated && !isFinding
                    ? ["#0df0d4", "#ff00ff", "#fbbf24", "#0df0d4"]
                    : isFinding
                    ? "#ff7b00"
                    : skin.color,
              }}
              transition={{
                x: { type: "tween", duration: 0 },
                y: { type: "tween", duration: 0 },
                borderColor:
                  skin.isAnimated && !isFinding
                    ? { duration: 2, repeat: Infinity }
                    : { duration: 0 },
              }}
              style={{
                pointerEvents: "none",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 9999,
                width: lensSize,
                height: lensSize,
                borderWidth: skin.borderWidth || "6px",
                borderStyle: "solid",
                overflow: "visible",
                boxShadow: isFinding
                  ? `0 0 60px rgba(0,0,0,0.6), inset 0 0 40px rgba(255,123,0,0.4)`
                  : `0 0 60px rgba(0,0,0,0.6), inset 0 0 40px ${skin.shadow}`,
                backdropFilter: skin.filter,
              }}
            >
              {/* MATHEMATICALLY PERFECT HANDLE ALIGNMENT */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  transform: "rotate(-45deg)",
                  zIndex: -1, // Keeps the whole assembly behind the lens border
                }}
              >
                <motion.div
                  style={{
                    position: "absolute",
                    // Shift UP by 2px to deeply embed the flat top into the thick border,
                    // ensuring absolutely zero pixel gaps from anti-aliasing.
                    top: "calc(100% - 2px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: skin.handleWidth || "26px",
                    height: skin.handleHeight || "130px",
                    borderBottomLeftRadius: skin.handleRadius || "13px",
                    borderBottomRightRadius: skin.handleRadius || "13px",
                    // Forcing a flat top cut to flush-mount against the circular curve
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderTop: "none",
                    borderLeft: `3px solid ${
                      isFinding ? "#ff7b00" : skin.color
                    }`,
                    borderRight: `3px solid ${
                      isFinding ? "#ff7b00" : skin.color
                    }`,
                    borderBottom: `3px solid ${
                      isFinding ? "#ff7b00" : skin.color
                    }`,
                  }}
                  animate={{
                    background:
                      skin.isAnimated && !isFinding
                        ? ["#ffffff", "#0df0d4", "#ff00ff", "#ffffff"]
                        : isFinding
                        ? "#9a3412"
                        : skin.handleBackground || skin.handleColor,
                    boxShadow:
                      skin.isAnimated && !isFinding
                        ? [
                            "0 0 30px #ffffff",
                            "0 0 30px #0df0d4",
                            "0 0 30px #ff00ff",
                            "0 0 30px #ffffff",
                          ]
                        : isFinding
                        ? "0 0 20px #ff7b00"
                        : skin.handleGlow,
                    borderLeftColor: isFinding ? "#ff7b00" : skin.color,
                    borderRightColor: isFinding ? "#ff7b00" : skin.color,
                    borderBottomColor: isFinding ? "#ff7b00" : skin.color,
                  }}
                  transition={{
                    background:
                      skin.isAnimated && !isFinding
                        ? { duration: 2, repeat: Infinity }
                        : { type: "tween", duration: 0 },
                    boxShadow:
                      skin.isAnimated && !isFinding
                        ? { duration: 2, repeat: Infinity }
                        : { type: "tween", duration: 0 },
                    borderLeftColor:
                      skin.isAnimated && !isFinding
                        ? { duration: 2, repeat: Infinity }
                        : { type: "tween", duration: 0 },
                    borderRightColor:
                      skin.isAnimated && !isFinding
                        ? { duration: 2, repeat: Infinity }
                        : { type: "tween", duration: 0 },
                    borderBottomColor:
                      skin.isAnimated && !isFinding
                        ? { duration: 2, repeat: Infinity }
                        : { type: "tween", duration: 0 },
                  }}
                />
              </div>

              {/* LENS CONTENT */}
              <div
                style={{
                  zIndex: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  width: "100%",
                }}
              >
                {hoveredIoC ? (
                  <div style={{ padding: "20px", textAlign: "left" }}>
                    <div
                      style={{
                        color: "#ff7b00",
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
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 900,
                      color: skin.color,
                      textTransform: "uppercase",
                      textShadow: `0 0 10px ${skin.color}`,
                    }}
                  >
                    <Search size={24} style={{ marginBottom: "8px" }} />
                    <br /> Scanning...
                  </div>
                )}
              </div>
            </motion.div>
          );
        })()}
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
                  case "RUBY":
                    return {
                      color: "#e11d48",
                      glow: "rgba(225, 29, 72, 0.8)",
                      anim: { scale: [0, 1], rotate: [90, 0] },
                      badge: (
                        <svg
                          viewBox="0 0 100 100"
                          style={{
                            width: "200px",
                            height: "200px",
                            filter:
                              "drop-shadow(0 0 35px rgba(225, 29, 72, 0.8))",
                          }}
                        >
                          <polygon
                            points="50,5 95,25 95,75 50,95 5,75 5,25"
                            fill="#4c0519"
                            stroke="#e11d48"
                            strokeWidth="6"
                            strokeLinejoin="round"
                          />
                          <polygon
                            points="50,15 85,32 50,50 15,32"
                            fill="#fb7185"
                          />
                          <polygon
                            points="85,32 85,68 50,85 50,50"
                            fill="#9f1239"
                          />
                          <polygon
                            points="15,32 50,50 50,85 15,68"
                            fill="#e11d48"
                          />
                          <polygon
                            points="50,25 70,40 50,70 30,40"
                            fill="#f43f5e"
                          />
                          <polygon
                            points="50,30 55,40 50,55 45,40"
                            fill="#fff1f2"
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

              {/* --- UPDATED: Added scrollable container styles --- */}
              <div
                className="leaderboard-list"
                style={{
                  maxHeight: "55vh",
                  overflowY: "auto",
                  paddingRight: "10px", // Prevents the scrollbar from overlapping content
                }}
              >
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

      <AnimatePresence>
        {showInventory && !showUnboxing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="leaderboard-overlay"
            onClick={() => setShowInventory(false)}
          >
            <div
              className="leaderboard-modal"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "700px" }}
            >
              <button
                className="close-btn"
                onClick={() => setShowInventory(false)}
              >
                <X size={24} />
              </button>

              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  marginBottom: "20px",
                  borderBottom: "1px solid #334155",
                  paddingBottom: "10px",
                }}
              >
                <button
                  onClick={() => setShopTab("INVENTORY")}
                  style={{
                    background: "none",
                    border: "none",
                    color: shopTab === "INVENTORY" ? "#00a9e0" : "#64748b",
                    fontWeight: 900,
                    fontSize: "1.2rem",
                    cursor: "pointer",
                  }}
                >
                  MY INVENTORY
                </button>
                <button
                  onClick={() => setShopTab("SHOP")}
                  style={{
                    background: "none",
                    border: "none",
                    color: shopTab === "SHOP" ? "#fbbf24" : "#64748b",
                    fontWeight: 900,
                    fontSize: "1.2rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <ShoppingCart size={18} /> COIN SHOP
                </button>
                <div
                  style={{
                    marginLeft: "auto",
                    color: "#fbbf24",
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Coins size={18} /> {skopeCoins.toLocaleString()}
                </div>
              </div>

              {/* Category Toggle (Magnifiers vs Environments) */}
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
              >
                <button
                  onClick={() => setShopCategory("MAGNIFIERS")}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "20px",
                    border: "1px solid #334155",
                    background:
                      shopCategory === "MAGNIFIERS" ? "#0ea5e9" : "transparent",
                    color: shopCategory === "MAGNIFIERS" ? "#fff" : "#94a3b8",
                    cursor: "pointer",
                    fontWeight: 800,
                    transition: "0.2s",
                  }}
                >
                  Magnifiers
                </button>
                <button
                  onClick={() => setShopCategory("ENVIRONMENTS")}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "20px",
                    border: "1px solid #334155",
                    background:
                      shopCategory === "ENVIRONMENTS"
                        ? "#0ea5e9"
                        : "transparent",
                    color: shopCategory === "ENVIRONMENTS" ? "#fff" : "#94a3b8",
                    cursor: "pointer",
                    fontWeight: 800,
                    transition: "0.2s",
                  }}
                >
                  Environments
                </button>
              </div>

              {shopTab === "SHOP" && shopCategory === "MAGNIFIERS" && (
                <div
                  style={{
                    background: "rgba(220, 38, 38, 0.1)",
                    border: "1px solid #dc2626",
                    color: "#fca5a5",
                    padding: "10px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    marginBottom: "20px",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  NOTICE: Direct purchase is expensive. We advise inspectors to
                  rely on CRATE openings for magnifier upgrades.
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                  maxHeight: "400px",
                  overflowY: "auto",
                  paddingRight: "5px",
                }}
              >
                {shopCategory === "MAGNIFIERS"
                  ? // --- RENDER MAGNIFIERS ---
                    Object.values(MAGNIFIER_SKINS)
                      .sort(
                        (a, b) =>
                          getSkinPrice(a.rarity) - getSkinPrice(b.rarity)
                      )
                      .map((skin) => {
                        const isOwned = inventory.includes(skin.id);
                        const isEquipped = equippedSkin === skin.id;
                        const price = getSkinPrice(skin.rarity);

                        if (shopTab === "INVENTORY" && !isOwned) return null;
                        if (shopTab === "SHOP" && isOwned) return null;

                        return (
                          <div
                            key={skin.id}
                            style={{
                              padding: "15px",
                              background: "#0f172a",
                              border: `2px solid ${
                                isOwned ? skin.color : "#334155"
                              }`,
                              borderRadius: "8px",
                            }}
                          >
                            <div
                              style={{
                                color: getRarityColor(skin.rarity),
                                fontSize: "10px",
                                fontWeight: 900,
                                textTransform: "uppercase",
                              }}
                            >
                              {skin.rarity}
                            </div>
                            <div
                              style={{
                                color: "#fff",
                                fontWeight: 700,
                                margin: "5px 0",
                              }}
                            >
                              {skin.name}
                            </div>

                            {shopTab === "INVENTORY" ? (
                              <button
                                onClick={() => setEquippedSkin(skin.id)}
                                style={{
                                  width: "100%",
                                  padding: "8px",
                                  marginTop: "10px",
                                  background: isEquipped
                                    ? skin.color
                                    : "transparent",
                                  color: isEquipped ? "#000" : skin.color,
                                  border: `1px solid ${skin.color}`,
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                }}
                              >
                                {isEquipped ? "EQUIPPED" : "EQUIP"}
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  if (skopeCoins >= price) {
                                    setSkopeCoins((prev) => prev - price);
                                    setInventory((prev) => [...prev, skin.id]);
                                  }
                                }}
                                disabled={skopeCoins < price}
                                style={{
                                  width: "100%",
                                  padding: "8px",
                                  marginTop: "10px",
                                  background:
                                    skopeCoins >= price ? "#10b981" : "#334155",
                                  color:
                                    skopeCoins >= price ? "#000" : "#94a3b8",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor:
                                    skopeCoins >= price
                                      ? "pointer"
                                      : "not-allowed",
                                  fontWeight: "bold",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                <Coins size={14} /> {price.toLocaleString()}
                              </button>
                            )}
                          </div>
                        );
                      })
                  : // --- RENDER ENVIRONMENTS ---
                    Object.values(BACKGROUNDS_DB)
                      .sort((a, b) => a.price - b.price)
                      .map((bg) => {
                        const isOwned = unlockedBackgrounds.includes(bg.id);
                        const isEquipped = equippedBackground === bg.id;

                        if (shopTab === "INVENTORY" && !isOwned) return null;
                        if (shopTab === "SHOP" && isOwned) return null;

                        return (
                          <div
                            key={bg.id}
                            style={{
                              padding: "15px",
                              background: "#0f172a",
                              border: `2px solid ${
                                isOwned ? "#10b981" : "#334155"
                              }`,
                              borderRadius: "8px",
                            }}
                          >
                            <div
                              style={{
                                color: getRarityColor(bg.rarity),
                                fontSize: "10px",
                                fontWeight: 900,
                                textTransform: "uppercase",
                              }}
                            >
                              {bg.rarity}
                            </div>
                            <div
                              style={{
                                color: "#fff",
                                fontWeight: 700,
                                margin: "5px 0",
                              }}
                            >
                              {bg.name}
                            </div>

                            {shopTab === "INVENTORY" ? (
                              <button
                                onClick={() => setEquippedBackground(bg.id)}
                                style={{
                                  width: "100%",
                                  padding: "8px",
                                  marginTop: "10px",
                                  background: isEquipped
                                    ? "#10b981"
                                    : "transparent",
                                  color: isEquipped ? "#000" : "#10b981",
                                  border: "1px solid #10b981",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                }}
                              >
                                {isEquipped ? "ACTIVE" : "ACTIVATE"}
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  if (skopeCoins >= bg.price) {
                                    setSkopeCoins((prev) => prev - bg.price);
                                    setUnlockedBackgrounds((prev) => [
                                      ...prev,
                                      bg.id,
                                    ]);
                                  }
                                }}
                                disabled={skopeCoins < bg.price}
                                style={{
                                  width: "100%",
                                  padding: "8px",
                                  marginTop: "10px",
                                  background:
                                    skopeCoins >= bg.price
                                      ? "#10b981"
                                      : "#334155",
                                  color:
                                    skopeCoins >= bg.price ? "#000" : "#94a3b8",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor:
                                    skopeCoins >= bg.price
                                      ? "pointer"
                                      : "not-allowed",
                                  fontWeight: "bold",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                {bg.price === 0 ? (
                                  "FREE UNLOCK"
                                ) : (
                                  <>
                                    <Coins size={14} />{" "}
                                    {bg.price.toLocaleString()}
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        );
                      })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAchievements && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="leaderboard-overlay"
            onClick={() => setShowAchievements(false)}
          >
            <div
              className="leaderboard-modal"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "600px" }}
            >
              <button
                className="close-btn"
                onClick={() => setShowAchievements(false)}
              >
                <X size={24} />
              </button>
              <h2
                className="leaderboard-title"
                style={{ textAlign: "center", marginBottom: "20px" }}
              >
                Achievements
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  maxHeight: "50vh",
                  overflowY: "auto",
                  paddingRight: "10px",
                }}
              >
                {ACHIEVEMENTS_DB.map((ach) => {
                  const isUnlocked = unlockedAchievements.includes(ach.id);

                  // NEW: Obfuscate secrets if they aren't unlocked yet
                  const isHiddenSecret = ach.isSecret && !isUnlocked;
                  const displayTitle = isHiddenSecret ? "???" : ach.title;
                  const displayDesc = isHiddenSecret
                    ? "Classified Objective. Requirements unknown."
                    : ach.desc;

                  return (
                    <div
                      key={ach.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "15px",
                        background: isUnlocked
                          ? "rgba(16, 185, 129, 0.1)"
                          : "#0f172a",
                        border: `1px solid ${
                          isUnlocked ? "#10b981" : "#334155"
                        }`,
                        borderRadius: "8px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: isUnlocked
                              ? "#10b981"
                              : isHiddenSecret
                              ? "#ef4444"
                              : "#fff",
                            fontWeight: 800,
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          {isUnlocked ? (
                            <CheckCircle size={16} />
                          ) : (
                            <Lock
                              size={16}
                              color={isHiddenSecret ? "#ef4444" : "#64748b"}
                            />
                          )}
                          {displayTitle}
                        </div>
                        <div
                          style={{
                            color: isHiddenSecret ? "#fca5a5" : "#94a3b8",
                            fontSize: "12px",
                            marginTop: "4px",
                          }}
                        >
                          {displayDesc}
                        </div>
                      </div>
                      <div
                        style={{
                          color: "#fbbf24",
                          fontWeight: 900,
                          fontSize: "14px",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          opacity: isUnlocked ? 0.5 : 1,
                        }}
                      >
                        <Coins size={14} /> {ach.reward.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEW: UNBOXING ROULETTE MODAL */}
      <AnimatePresence>
        {showUnboxing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="leaderboard-overlay"
          >
            <div
              className="leaderboard-modal"
              style={{
                width: "800px",
                maxWidth: "90vw",
                textAlign: "center",
                overflow: "hidden",
              }}
            >
              <h2
                className="leaderboard-title"
                style={{ marginBottom: "30px" }}
              >
                Decrypting Data...
              </h2>

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "120px",
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {/* Center Reticle */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    background: "#ff7b00",
                    zIndex: 10,
                    transform: "translateX(-50%)",
                    boxShadow: "0 0 15px #ff7b00",
                  }}
                />

                {/* Spinning Track */}
                <motion.div
                  key={spinKey}
                  initial={{ x: 0 }}
                  animate={{ x: -(45 * 160 - 300) }}
                  transition={{ duration: 5, ease: [0.15, 0.85, 0.2, 1] }}
                  style={{
                    display: "flex",
                    height: "100%",
                    position: "absolute",
                    left: 0,
                  }}
                >
                  {rouletteItems.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        width: "160px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRight: "1px solid #1e293b",
                        background: `linear-gradient(to bottom, #0f172a, ${item.color}22)`,
                      }}
                    >
                      <div
                        style={{
                          color: getRarityColor(item.rarity),
                          fontSize: "12px",
                          fontWeight: 900,
                        }}
                      >
                        {item.rarity}
                      </div>
                      <div
                        style={{
                          color: "#fff",
                          fontWeight: 700,
                          marginTop: "5px",
                        }}
                      >
                        {item.name}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Reveal Winner */}
              <div
                style={{
                  height: "120px", // slightly taller to fit the XP text
                  marginTop: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {wonSkin ? (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    {isDuplicate ? (
                      // DUPLICATE UI
                      <>
                        <h3
                          style={{
                            color: "#eab308",
                            margin: "0 0 5px 0",
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                          }}
                        >
                          DUPLICATE CONVERTED
                        </h3>
                        <h2
                          style={{
                            color: "#fff",
                            margin: 0,
                            opacity: 0.8,
                          }}
                        >
                          {wonSkin.name}
                        </h2>
                        <div
                          style={{
                            color: "#fbbf24", // Switched to Gold for coins
                            fontWeight: 900,
                            fontSize: "1.2rem",
                            marginTop: "8px",
                            textShadow: "0 0 10px rgba(251, 191, 36, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "5px",
                          }}
                        >
                          <Coins size={20} /> +{duplicateCoinReward} COIN
                          SALVAGE
                        </div>
                      </>
                    ) : (
                      // NEW UNLOCK UI
                      <>
                        <h3
                          style={{
                            color: getRarityColor(wonSkin.rarity),
                            margin: "0 0 10px 0",
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                          }}
                        >
                          {wonSkin.rarity} UNLOCKED
                        </h3>
                        <h1
                          style={{
                            color: wonSkin.color,
                            margin: 0,
                            textShadow: `0 0 20px ${wonSkin.color}`,
                          }}
                        >
                          {wonSkin.name}
                        </h1>
                      </>
                    )}
                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        justifyContent: "center",
                        marginTop: "20px",
                      }}
                    >
                      {crates > 0 && (
                        <button
                          onClick={openCrate}
                          style={{
                            background:
                              "linear-gradient(90deg, #ff7b00, #e66e00)",
                            color: "#fff",
                            border: "1px solid #ffba7a",
                            padding: "8px 16px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            boxShadow: "0 0 10px rgba(255, 123, 0, 0.4)",
                          }}
                        >
                          Decrypt Another ({crates})
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setShowUnboxing(false);
                          setShowInventory(true);
                        }}
                        style={{
                          background: "transparent",
                          color: "#fff",
                          border: "1px solid #fff",
                          padding: "8px 16px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        {crates > 0 ? "Close" : "Continue"}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div style={{ color: "#64748b", fontWeight: 800 }}>
                    Spinning...
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INSTRUCTIONS / HOW TO PLAY MODAL */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="leaderboard-overlay"
            onClick={() => setShowInstructions(false)}
          >
            <motion.div
              className="leaderboard-modal"
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: "600px",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <button
                className="close-btn"
                onClick={() => setShowInstructions(false)}
              >
                <X size={24} />
              </button>
              <h2
                className="leaderboard-title"
                style={{
                  textAlign: "center",
                  marginBottom: "10px",
                  fontSize: "1.8rem",
                }}
              >
                Field Manual
              </h2>
              <p
                style={{
                  textAlign: "center",
                  color: "#94a3b8",
                  marginBottom: "20px",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                Follow these protocols to investigate threats and build your
                Inventory.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  overflowY: "auto",
                  paddingRight: "10px",
                  paddingBottom: "10px",
                }}
              >
                {/* Step 1 */}
                <div
                  style={{
                    background: "#0f172a",
                    padding: "15px",
                    borderRadius: "8px",
                    borderLeft: "4px solid #00a9e0",
                  }}
                >
                  <h3
                    style={{
                      color: "#fff",
                      margin: "0 0 8px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "15px",
                    }}
                  >
                    <Search size={18} color="#00a9e0" /> 1. Enable the Inspector
                  </h3>
                  <p
                    style={{
                      color: "#cbd5e1",
                      margin: 0,
                      fontSize: "13px",
                      lineHeight: "1.5",
                    }}
                  >
                    Click <strong>ENABLE INSPECTOR</strong> to activate your
                    forensic magnifier. Move it over the email to reveal hidden
                    routing data, true URLs, and behavioral traps.
                  </p>
                </div>

                {/* Step 2 */}
                <div
                  style={{
                    background: "#0f172a",
                    padding: "15px",
                    borderRadius: "8px",
                    borderLeft: "4px solid #f59e0b",
                  }}
                >
                  <h3
                    style={{
                      color: "#fff",
                      margin: "0 0 8px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "15px",
                    }}
                  >
                    <Fingerprint size={18} color="#f59e0b" /> 2. Log the
                    Evidence
                  </h3>
                  <p
                    style={{
                      color: "#cbd5e1",
                      margin: 0,
                      fontSize: "13px",
                      lineHeight: "1.5",
                    }}
                  >
                    When the magnifier detects a threat or a trust indicator,{" "}
                    <strong>click on it</strong> to log it into your Evidence
                    Tracker. You must find ALL evidence before making a
                    decision.{" "}
                    <em>Take your time—precision is rewarded over speed.</em>
                  </p>
                </div>

                {/* Step 3 */}
                <div
                  style={{
                    background: "#0f172a",
                    padding: "15px",
                    borderRadius: "8px",
                    borderLeft: "4px solid #10b981",
                  }}
                >
                  <h3
                    style={{
                      color: "#fff",
                      margin: "0 0 8px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "15px",
                    }}
                  >
                    <ShieldAlert size={18} color="#10b981" /> 3. Make the Call
                  </h3>
                  <p
                    style={{
                      color: "#cbd5e1",
                      margin: 0,
                      fontSize: "13px",
                      lineHeight: "1.5",
                    }}
                  >
                    Once evidence is collected, decide if the email is a{" "}
                    <strong>Threat (Phish)</strong> or a <strong>Safe</strong>{" "}
                    workflow. Correct decisions build your streak and XP.
                  </p>
                </div>

                {/* Step 4 */}
                <div
                  style={{
                    background: "#0f172a",
                    padding: "15px",
                    borderRadius: "8px",
                    borderLeft: "4px solid #a855f7",
                  }}
                >
                  <h3
                    style={{
                      color: "#fff",
                      margin: "0 0 8px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "15px",
                    }}
                  >
                    <Medal size={18} color="#a855f7" /> 4. Earn Service Medals
                  </h3>
                  <p
                    style={{
                      color: "#cbd5e1",
                      margin: 0,
                      fontSize: "13px",
                      lineHeight: "1.5",
                    }}
                  >
                    Ascend through the ranks (Iron to Apex) by earning XP.
                    Maintaining high accuracy streaks and ranking up unlocks{" "}
                    <strong>Achievements</strong>, rewarding you with{" "}
                    <strong>SkopeCoins</strong>.
                  </p>
                </div>

                {/* Step 5 */}
                <div
                  style={{
                    background: "#0f172a",
                    padding: "15px",
                    borderRadius: "8px",
                    borderLeft: "4px solid #fbbf24",
                  }}
                >
                  <h3
                    style={{
                      color: "#fff",
                      margin: "0 0 8px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "15px",
                    }}
                  >
                    <ShoppingCart size={18} color="#fbbf24" /> 5. Requisition
                    Gear
                  </h3>
                  <p
                    style={{
                      color: "#cbd5e1",
                      margin: 0,
                      fontSize: "13px",
                      lineHeight: "1.5",
                    }}
                  >
                    Use your SkopeCoins in the <strong>Coin Shop</strong> to
                    purchase exclusive Magnifier Skins.{" "}
                    <em>
                      Tip: Earning XP to unlock free Decrypt Crates is the most
                      efficient way to build out your inventory!
                    </em>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowInstructions(false)}
                style={{
                  width: "100%",
                  padding: "15px",
                  marginTop: "20px",
                  background: "#00a9e0",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 900,
                  fontSize: "1rem",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  boxShadow: "0 0 15px rgba(0, 169, 224, 0.4)",
                  flexShrink: 0,
                }}
              >
                Acknowledge
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ACHIEVEMENT UNLOCK TOAST ANIMATION --- */}
      <AnimatePresence>
        {achievementToasts.length > 0 && (
          <motion.div
            style={{
              position: "fixed",
              top: "30px",
              left: "50%",
              x: "-50%", // Framer Motion's shorthand for transform: translateX(-50%)
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              pointerEvents: "none", // Ensures it doesn't block the user from clicking the Next button
            }}
          >
            {achievementToasts.map((ach, i) => (
              <motion.div
                key={ach.id}
                initial={{ y: -50, scale: 0.8, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: -50, scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.5, delay: i * 0.2 }} // Staggers the animation if multiple unlock at once
                style={{
                  background: "linear-gradient(90deg, #0f172a, #1e293b)",
                  border: "2px solid #fbbf24",
                  padding: "15px 25px",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(251, 191, 36, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  color: "#fff",
                }}
              >
                <div
                  style={{
                    background: "#fbbf24",
                    color: "#0f172a",
                    borderRadius: "50%",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 0 15px rgba(251, 191, 36, 0.5)",
                  }}
                >
                  <Medal size={24} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#fbbf24",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    Achievement Unlocked!
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: 900 }}>
                    {ach.title}
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: "15px",
                    color: "#10b981",
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "16px",
                  }}
                >
                  <Coins size={18} /> +{ach.reward}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {/* This is the final closing for the main app container div */}
    </div>
  );
}
