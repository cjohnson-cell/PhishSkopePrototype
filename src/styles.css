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
} from "lucide-react";
import DOMPurify from "dompurify";
import "./styles.css";

const EMAIL_DATABASE = [
  // ==========================================
  // TIER 1: EASY / MEDIUM (8 Emails)
  // Hooks: Routine admin, basic shipping, obvious bad domains
  // ==========================================
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
          <p style="color: #475569; font-size: 15px;">A recent Uber receipt from March 12th could not be mapped to an active expense policy.</p>
          <a href="#" style="display: inline-block; background-color: #46e89a; color: #02203c; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: 700;">Review Receipt</a>
        </div>
      </div>
    `,
    hidden: "Verified expensify.com domain. Standard workflow.",
    lesson:
      "Authentic emails use precise domains and route to known, secure application portals.",
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
          <p style="color: #555555; font-size: 14px;">Your upcoming flight (UA 1204) from Chicago (ORD) to San Francisco (SFO) has been canceled.</p>
          <a href="#" style="display: inline-block; background-color: #F26D64; color: #ffffff; padding: 12px 20px; text-decoration: none; font-weight: bold; border-radius: 4px;">Rebook Flight</a>
        </div>
      </div>
    `,
    hidden:
      "Domain is navan-travel-update.com. Navan officially uses navan.com.",
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
          <p style="color: #666666; font-size: 14px;">The cloud recording for "Weekly Product Sync" is now available for 30 days.</p>
          <a href="#" style="display: inline-block; background-color: #0B5CFF; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">View Recording</a>
        </div>
      </div>
    `,
    hidden: "Verified zoom.us domain. Standard automated workflow.",
    lesson:
      "Automated platform emails from verified root domains with standard retention warnings are generally safe.",
  },
  {
    id: 4,
    app: "Netskope Swag Store",
    tier: 1,
    isPhish: true,
    sender: "orders@netskope-swag-shipping.co",
    subject: "Your Order #4992 has Shipped",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #FF8F1C; padding: 20px;"><strong style="color: #ffffff; font-size: 22px;">Netskope Store</strong></div>
        <div style="padding: 20px; background-color: #ffffff;">
          <p style="color: #333333; font-size: 15px;">Great news! Your recent company swag order has been shipped via FedEx.</p>
          <a href="#" style="display: inline-block; background-color: #FF8F1C; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Track Package</a>
        </div>
      </div>
    `,
    hidden:
      "The .co domain is a squatter. Real orders come from the official Netskope domain.",
    lesson:
      "Shipping notifications are a highly successful lure because employees are excited to get their items.",
  },
  {
    id: 5,
    app: "Staffbase",
    tier: 1,
    isPhish: false,
    sender: "communications@staffbase.com",
    subject: "Company Update: Q3 All-Hands Recording",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #00A8FF; padding: 20px;"><strong style="color: #ffffff; font-size: 22px;">Staffbase</strong></div>
        <div style="padding: 20px; background-color: #ffffff;">
          <h2 style="color: #333333; font-size: 18px;">Missed the Town Hall?</h2>
          <p style="color: #555555; font-size: 14px;">The CEO\'s Q3 recap and Q4 outlook video is now available on the internal comms portal.</p>
          <a href="#" style="display: inline-block; background-color: #00A8FF; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Watch Replay</a>
        </div>
      </div>
    `,
    hidden: "Verified staffbase.com domain. Internal comms workflow.",
    lesson:
      "Official company newsletter platforms using verified domains are safe to engage with.",
  },
  {
    id: 6,
    app: "Sprout Social",
    tier: 1,
    isPhish: true,
    sender: "alert@sproutsocial-security.net",
    subject: "New Login from Unknown Device",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #00A650; padding: 20px;"><strong style="color: #ffffff; font-size: 22px;">Sprout Social</strong></div>
        <div style="padding: 20px; background-color: #ffffff;">
          <h2 style="color: #d9534f; font-size: 18px;">Unrecognized Login Detected</h2>
          <p style="color: #333333; font-size: 14px;">We detected a login to your corporate social media dashboard from an unrecognized IP in Eastern Europe.</p>
          <a href="#" style="display: inline-block; background-color: #d9534f; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Secure Account Now</a>
        </div>
      </div>
    `,
    hidden:
      "sproutsocial-security.net is a credential harvester. Real alerts use sproutsocial.com.",
    lesson:
      'Security alerts induce panic. Always check the root domain before trying to "secure" an account.',
  },
  {
    id: 7,
    app: "BriefingSource",
    tier: 1,
    isPhish: false,
    sender: "scheduler@briefingsource.com",
    subject: "New Briefing Added to Your Calendar",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="padding: 20px; border-bottom: 2px solid #0056b3;"><strong style="color: #0056b3; font-size: 22px;">BriefingSource</strong></div>
        <div style="padding: 20px; background-color: #ffffff;">
          <p style="color: #333333; font-size: 14px;">You have been added as a presenter for the upcoming Executive Briefing Center (EBC) visit on Thursday.</p>
          <a href="#" style="display: inline-block; background-color: #0056b3; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Agenda</a>
        </div>
      </div>
    `,
    hidden: "Verified briefingsource.com domain. Standard calendar alert.",
    lesson:
      "Calendar and scheduling alerts from verified domains are typical, safe corporate workflows.",
  },
  {
    id: 8,
    app: "Gemini",
    tier: 1,
    isPhish: true,
    sender: "billing@gemini-ai-upgrade.com",
    subject: "Gemini Advanced Subscription Expired",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #dadce0; border-radius: 8px;">
        <div style="padding: 20px; border-bottom: 1px solid #dadce0;"><strong style="color: #1a73e8; font-size: 22px;">Gemini</strong></div>
        <div style="padding: 20px; background-color: #ffffff;">
          <p style="color: #3c4043; font-size: 14px;">Your access to Gemini Advanced has expired due to a failed payment method on your corporate card.</p>
          <a href="#" style="display: inline-block; background-color: #1a73e8; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Update Payment Info</a>
        </div>
      </div>
    `,
    hidden:
      "Domain is gemini-ai-upgrade.com. Official Google communications use google.com.",
    lesson:
      "Attackers target popular AI tool subscriptions to steal corporate credit card numbers.",
  },

  // ==========================================
  // TIER 2: MEDIUM / HARD (8 Emails)
  // Hooks: Collaboration tools, HR workflows, sub-domain spoofing
  // ==========================================
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
        <p style="background: #f4f5f7; padding: 12px; border-left: 2px solid #0052cc;">"Hey, AWS alerted us that our staging keys might have leaked. Can you rotate the production keys immediately?"</p>
        <a href="#" style="display: inline-block; background: #0052cc; color: #ffffff; padding: 10px 16px; text-decoration: none; border-radius: 3px;">View Issue & Rotate Keys</a>
      </div>
    `,
    hidden:
      'Domain is task-update.com. The "View Issue" button links to a credential harvester.',
    lesson:
      "The button looks exactly like Jira, but the hidden routing data reveals the trap.",
  },
  {
    id: 10,
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
          <a href="#" style="display: inline-block; background-color: #F06A6A; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Task</a>
        </div>
      </div>
    `,
    hidden:
      "The domain is asana-workspace.net (Fake). Official Asana uses asana.com.",
    lesson:
      "Project management tool notifications often trigger immediate action. Verify the sender domain.",
  },
  {
    id: 11,
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
          <p style="color: #666666; font-size: 14px;">The scheduled deployment for "Q3 Enterprise Outreach" failed due to an expired Salesforce API token.</p>
          <a href="#" style="display: inline-block; background-color: #5C4C9F; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Re-Authenticate API</a>
        </div>
      </div>
    `,
    hidden:
      "Domain is campaign-sync.net, not marketo.com. Targets marketers under pressure.",
    lesson:
      "Attackers target specific roles with tool-specific errors to force a hasty login.",
  },
  {
    id: 12,
    app: "Greenhouse",
    tier: 2,
    isPhish: false,
    sender: "no-reply@greenhouse.io",
    subject: "Reminder: Submit Feedback for Software Engineer candidate",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #d9d9d9; border-radius: 4px;">
        <div style="background-color: #00B2A9; padding: 20px; text-align: center;"><strong style="color: #ffffff; font-size: 22px;">greenhouse</strong></div>
        <div style="padding: 25px;">
          <p style="color: #333333; font-size: 15px;">You recently interviewed a candidate for the Software Engineer role. Please take a few minutes to complete your scorecard.</p>
          <a href="#" style="display: inline-block; background-color: #00B2A9; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Fill Out Scorecard</a>
        </div>
      </div>
    `,
    hidden: "greenhouse.io is the official, verified domain.",
    lesson:
      "Standard HR workflow reminders from verified root domains are safe and should not be flagged.",
  },
  {
    id: 13,
    app: "Common Room",
    tier: 2,
    isPhish: true,
    sender: "digest@commonroom-app.io",
    subject: "Weekly Community Digest: 3 Unread Mentions",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #6D28D9; padding: 20px;"><strong style="color: #ffffff; font-size: 22px;">Common Room</strong></div>
        <div style="padding: 20px;">
          <h2 style="font-size: 18px; color: #333333;">Activity Digest</h2>
          <p style="color: #555555; font-size: 14px;">You have 3 high-priority unread mentions from key accounts in your connected Slack communities.</p>
          <a href="#" style="display: inline-block; background-color: #6D28D9; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Mentions</a>
        </div>
      </div>
    `,
    hidden: "commonroom-app.io is fake. Official domain is commonroom.io.",
    lesson:
      "Weekly digests are highly trusted by employees. Attackers perfectly clone these templates to harvest credentials.",
  },
  {
    id: 14,
    app: "ActiveDisclosure",
    tier: 2,
    isPhish: false,
    sender: "notifications@activedisclosure.com",
    subject: "Document Ready for Review: Q3 10-Q Draft",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #002D72; padding: 20px;"><strong style="color: #ffffff; font-size: 22px;">ActiveDisclosure</strong></div>
        <div style="padding: 20px;">
          <p style="color: #333333; font-size: 14px;">The legal team has uploaded a new revision of the Q3 10-Q Draft for your review and sign-off.</p>
          <a href="#" style="display: inline-block; background-color: #002D72; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Review Document</a>
        </div>
      </div>
    `,
    hidden: "Verified activedisclosure.com domain. Routine financial review.",
    lesson:
      "Verified financial document links are safe, provided the domain exactly matches the trusted service.",
  },
  {
    id: 15,
    app: "6sense",
    tier: 2,
    isPhish: true,
    sender: "alerts@6sense-insights.net",
    subject: "High Intent Alert: Target Account Active",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #F37021; padding: 20px;"><strong style="color: #ffffff; font-size: 22px;">6sense</strong></div>
        <div style="padding: 20px;">
          <h2 style="font-size: 18px; color: #333333;">Account Surging</h2>
          <p style="color: #555555; font-size: 14px;">A tier-1 target account has entered the "Purchase" stage based on recent web activity. View their intent footprint immediately to engage.</p>
          <a href="#" style="display: inline-block; background-color: #F37021; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Account Data</a>
        </div>
      </div>
    `,
    hidden:
      "6sense-insights.net is a lookalike domain. 6sense uses 6sense.com.",
    lesson:
      "Sales and marketing tools are spoofed to trigger FOMO (Fear Of Missing Out) on potential revenue.",
  },
  {
    id: 16,
    app: "Knak",
    tier: 2,
    isPhish: true,
    sender: "approval@knak.com.template-review.co",
    subject: "Approval Needed: Q4 Campaign Template",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #FF0066; padding: 20px;"><strong style="color: #ffffff; font-size: 22px;">Knak</strong></div>
        <div style="padding: 20px;">
          <p style="color: #333333; font-size: 14px;">The design team has requested your final approval on the newly built Q4 holiday email template before it syncs to Marketo.</p>
          <a href="#" style="display: inline-block; background-color: #FF0066; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Review Template</a>
        </div>
      </div>
    `,
    hidden: "The domain is template-review.co. The Knak prefix is a deception.",
    lesson:
      "Subdomain spoofing hides the real, malicious destination at the very end of the URL or sender address.",
  },

  // ==========================================
  // TIER 3: HARD / IMPOSSIBLE (8 Emails)
  // Hooks: MFA Fatigue, C-Level Panic, Financial Audits, Subtle Typos
  // ==========================================
  {
    id: 17,
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
            <p style="margin: 0; color: #856404; font-size: 14px; font-weight: 500;">Action Required: You may receive multiple authentication prompts on your mobile device. Please APPROVE them to maintain SSO access.</p>
          </div>
        </div>
      </div>
    `,
    hidden: "The root domain is auth-sync.co. This is an MFA Fatigue attack.",
    lesson:
      "IT will never tell you to blindly approve a flood of push notifications. This exhausts you into letting an attacker in.",
  },
  {
    id: 18,
    app: "AWS",
    tier: 3,
    isPhish: true,
    sender: "no-reply-aws@amazon.com.billing-alert.net",
    subject: "AWS Notification - Billing Estimate Exceeded",
    body: `
      <div style="font-family: 'Amazon Ember', Arial, sans-serif; max-width: 600px; border: 1px solid #eaeded;">
        <div style="background-color: #232f3e; padding: 15px 20px;"><strong style="color: #ff9900; font-size: 20px;">aws</strong></div>
        <div style="padding: 20px; background-color: #ffffff;">
          <h2 style="font-size: 18px; color: #111111; border-bottom: 1px solid #eaeded; padding-bottom: 10px;">Billing Alert: Threshold Exceeded</h2>
          <p style="color: #333333; font-size: 14px;">Your estimated AWS charges for the current month have reached <strong>$4,520.00</strong>. To prevent suspension, review your active services.</p>
          <a href="#" style="display: inline-block; background-color: #ff9900; color: #111111; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 2px;">Review Billing Dashboard</a>
        </div>
      </div>
    `,
    hidden:
      "The true sender domain is billing-alert.net. The Amazon.com prefix is a deception.",
    lesson:
      "Billing spikes trigger sheer panic, causing victims to overlook the spoofed domain at the end of the address.",
  },
  {
    id: 19,
    app: "FloQast",
    tier: 3,
    isPhish: true,
    sender: "system@floqast-auth.com",
    subject: "ERP Disconnect - Trial Balance Out of Sync",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 6px;">
        <div style="background-color: #2D3E50; padding: 20px; text-align: center;"><strong style="color: #ffffff; font-size: 24px;">FloQast</strong></div>
        <div style="padding: 25px; background-color: #ffffff;">
          <h2 style="font-size: 18px; color: #d9534f; margin-top: 0;">API Disconnected</h2>
          <p style="color: #333333; font-size: 14px;">An automated sync error occurred between your ERP and FloQast during the month-end close checklist.</p>
          <a href="#" style="display: inline-block; background-color: #d9534f; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Re-Authenticate ERP Token</a>
        </div>
      </div>
    `,
    hidden:
      "floqast-auth.com is a lookalike. Target is financial controllers during close.",
    lesson:
      "High-stress periods like Month-End Close make accountants vulnerable to lookalike domains.",
  },
  {
    id: 20,
    app: "Gmail",
    tier: 3,
    isPhish: true,
    sender: "admin@workspace-google-support.com",
    subject: "Security Alert: Workspace Account Deletion Scheduled",
    body: `
      <div style="font-family: Roboto, Arial, sans-serif; max-width: 600px; border: 1px solid #dadce0; border-radius: 8px;">
        <div style="padding: 24px; border-bottom: 1px solid #dadce0;"><span style="color: #1a73e8; font-size: 24px; font-weight: bold;">Google Workspace</span></div>
        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="font-size: 20px; color: #202124; margin-top: 0;">Account Deletion Notice</h2>
          <p style="color: #3c4043; font-size: 14px;">Your corporate Workspace account has been flagged for a Terms of Service violation. Automated deletion is scheduled in 4 hours.</p>
          <a href="#" style="display: inline-block; background-color: #1a73e8; color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 4px; font-weight: 500;">Verify Session Now</a>
        </div>
      </div>
    `,
    hidden:
      "workspace-google-support.com is a credential harvester. Real alerts come from google.com.",
    lesson:
      "Google will never email you from a hyphenated support domain to threaten immediate account deletion.",
  },
  {
    id: 21,
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
          <p style="color: #555555; font-size: 14px;">The external audit team has logged a severe SOX control deficiency regarding user access reviews. Your response is required within 24 hours.</p>
          <a href="#" style="display: inline-block; background-color: #d9534f; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Deficiency Report</a>
        </div>
      </div>
    `,
    hidden:
      'Typosquatting: "auditboards.com" has an extra "s". The real domain is auditboard.com.',
    lesson:
      'Typosquatting (adding a plural "s") combined with legal/compliance threats is a highly effective Tier 3 attack.',
  },
  {
    id: 22,
    app: "Varicent",
    tier: 3,
    isPhish: true,
    sender: "compensation@varlcent.com",
    subject: "Action Required: Q4 Comp Plan Acknowledgment",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #0055A5; padding: 20px;"><strong style="color: #ffffff; font-size: 22px;">Varicent</strong></div>
        <div style="padding: 20px;">
          <p style="color: #333333; font-size: 14px;">Your Q4 Variable Compensation Plan has been updated by HR. You must review and digitally sign the new commission structure to ensure on-time payouts.</p>
          <a href="#" style="display: inline-block; background-color: #0055A5; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Review Comp Plan</a>
        </div>
      </div>
    `,
    hidden:
      'Visual Deception: The domain is "varlcent" using a lowercase L instead of an "i".',
    lesson:
      "Letters that look identical (l vs i) are used to spoof domains involving salary and commission to bypass your critical thinking.",
  },
  {
    id: 23,
    app: "Uptempo",
    tier: 3,
    isPhish: true,
    sender: "finance@uptempo.io.auth-sso.com",
    subject: "WARNING: Q4 Marketing Budget Frozen",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #00B36B; padding: 20px;"><strong style="color: #ffffff; font-size: 22px;">Uptempo</strong></div>
        <div style="padding: 20px;">
          <h2 style="font-size: 18px; color: #333333;">Spend Halt Initiated</h2>
          <p style="color: #555555; font-size: 14px;">The CFO has mandated an immediate freeze on all uncommitted Q4 marketing spend. Please review the attached line items that have been flagged for cancellation.</p>
          <a href="#" style="display: inline-block; background-color: #00B36B; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Review Flagged Spend</a>
        </div>
      </div>
    `,
    hidden: "Domain is auth-sso.com. Uptempo.io is just a subdomain prefix.",
    lesson:
      "Threat actors research company hierarchies and simulate executive actions (like budget freezes) to trigger immediate, panicked clicks.",
  },
  {
    id: 24,
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
          <p style="font-size: 14px;">Your registration for the 2026 Annual Revenue Summit is confirmed. Use your unique magic link below to join the keynote sessions on the day of the event.</p>
          <a href="#" style="display: inline-block; background-color: #FFB81C; color: #111111; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Add to Calendar</a>
        </div>
      </div>
    `,
    hidden: "Verified goldcast.io domain. Standard event magic link.",
    lesson:
      "Magic links are common in event software. Because the root domain is verified, this workflow is safe.",
  },
  {
    id: 25,
    app: "Marketo",
    tier: 2,
    isPhish: true,
    sender: "system@rnarketo-alerts.com",
    subject: "Campaign Deployment Halted - Action Required",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e0e0e0;">
        <div style="background-color: #5C4C9F; padding: 15px 20px;"><strong style="color: #ffffff; font-size: 22px;">Marketo Engage</strong></div>
        <div style="padding: 25px;">
          <h2 style="font-size: 18px; margin-top: 0;">Dear Marketing Admin,</h2>
          <p style="color: #666666; font-size: 14px;">Kindly do the needful and authenticate your session. Your upcoming enterprise blast has been halted due to a database sync failure.</p>
          <a href="#" style="display: inline-block; background-color: #5C4C9F; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Restart_Campaign_Sync.exe</a>
        </div>
      </div>
    `,
    hidden:
      '1. Typosquat: "rnarketo" instead of marketo. 2. Generic greeting & grammar ("Dear Admin", "do the needful"). 3. The button downloads an executable (.exe) file.',
    lesson:
      'Never trust just one element. Even if the purple branding looks right, the "rn" typo, bad grammar, and .exe file give it away.',
  },

  // 2. EXPENSIFY (Tier 1) - The "Lowercase L" Spoof
  {
    id: 26,
    app: "Expensify",
    tier: 1,
    isPhish: true,
    sender: "support@expenslfy.com",
    subject: "Reimbursement DENIED: $4,250.00",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="background-color: #02203c; padding: 24px; text-align: center;"><strong style="color: #46e89a; font-size: 28px;">Expensify</strong></div>
        <div style="padding: 32px; background-color: #ffffff;">
          <h2 style="font-size: 20px; color: #d9534f; margin-top: 0;">Expense Permanently Rejected</h2>
          <p style="color: #475569; font-size: 15px;">User, your reimbursement for the Q3 Offsite has been flagged for corporate fraud. If you do not appeal this within 2 hours, the funds will be permanently forfeited.</p>
          <a href="#" style="display: inline-block; background-color: #d9534f; color: #ffffff; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: 700;">Download Fraud Report (.pdf.zip)</a>
        </div>
      </div>
    `,
    hidden:
      '1. Sender domain uses a lowercase "L" (expenslfy). 2. Extreme, threatening tone ("corporate fraud"). 3. Button links to a double-extension malware file (.pdf.zip).',
    lesson:
      "Hackers combine visual tricks (like l vs i) with extreme emotional triggers to force you into clicking malicious zip files.",
  },

  // 3. AWS (Tier 3) - The IP Address Mask
  {
    id: 27,
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
          <p style="color: #333333; font-size: 14px;">Valued Customer. Your payment method has hard-bounced. All active EC2 instances and S3 buckets will be securely wiped in exactly 15 minutes.</p>
          <a href="#" style="display: inline-block; background-color: #ff9900; color: #111111; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 2px;">Update Billing at http://192.168.1.45/auth</a>
        </div>
      </div>
    `,
    hidden:
      "1. Hyphenated, fake sender domain. 2. Unrealistic urgency (15-minute data wipe). 3. Button routes to a raw, unsecured IP address instead of an AWS console URL.",
    lesson:
      "AWS will never wipe your servers with 15 minutes notice. Also, legitimate cloud services do not route you to raw IP addresses.",
  },

  // 4. VARICENT (Tier 3) - The Compensation Clawback
  {
    id: 28,
    app: "Varicent",
    tier: 3,
    isPhish: true,
    sender: "payroll@varicent.com.ru",
    subject: "Commission Clawback Notice: -$3,400",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e5e5e5;">
        <div style="background-color: #0055A5; padding: 20px;"><strong style="color: #ffffff; font-size: 22px;">Varicent</strong></div>
        <div style="padding: 20px;">
          <h2 style="color: #333333; font-size: 18px;">Dear Sales Representative,</h2>
          <p style="color: #333333; font-size: 14px;">You are having a negative balance on your payout. An automated clawback of $3,400 has been initiated against your next paycheck due to a calculation error.</p>
          <a href="#" style="display: inline-block; background-color: #0055A5; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Review Dispute Portal</a>
        </div>
      </div>
    `,
    hidden:
      '1. Domain ends in .ru (Russia). 2. Broken English grammar ("You are having a negative balance"). 3. Generic greeting ("Dear Sales Rep").',
    lesson:
      "Money creates instant panic. If an email about a pay deduction has broken English and an overseas domain, report it immediately.",
  },

  // 5. ASANA (Tier 2) - The Double "N" Spoof
  {
    id: 29,
    app: "Asana",
    tier: 2,
    isPhish: true,
    sender: "hr-alerts@asanna.com",
    subject: "CONFIDENTIAL: HR Complaint Lodged Against You",
    body: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; border: 1px solid #ECEAE5; border-radius: 8px;">
        <div style="padding: 30px; text-align: center; border-bottom: 1px solid #ECEAE5;"><h2 style="color: #F06A6A; margin: 0; font-size: 28px;">asana</h2></div>
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #1E1F21;">A confidential workspace task has been assigned to you regarding a formal coworker complaint.</p>
          <p style="font-size: 14px; color: #555555;">Please read the attached grievance document and respond to the mediator before EOD.</p>
          <a href="#" style="display: inline-block; background-color: #F06A6A; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View_Grievance_Doc.docx.exe</a>
        </div>
      </div>
    `,
    hidden:
      '1. Typosquat: "asanna" has two Ns. 2. Severe HR violation sent via standard project tool. 3. Payload is a .docx.exe file.',
    lesson:
      "HR does not issue formal complaints via automated Asana tasks. Furthermore, documents ending in .exe are executable viruses.",
  },

  // 6. ZOOM (Tier 2) - The Deepfake / Vishing Trap
  {
    id: 30,
    app: "Zoom",
    tier: 2,
    isPhish: true,
    sender: "admin@zoom-video-recordings.info",
    subject: "Missed Call: Mandatory Disciplinary Hearing",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e5e5e5; border-radius: 6px;">
        <div style="padding: 20px; text-align: center; border-bottom: 1px solid #e5e5e5;"><strong style="color: #0B5CFF; font-size: 26px;">zoom</strong></div>
        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="font-size: 18px; color: #222222; margin-top: 0;">Employee, you missed a mandatory call.</h2>
          <p style="color: #666666; font-size: 14px;">The Head of Operations left a secure voice memo regarding your attendance. Failure to review this memo will result in termination.</p>
          <a href="#" style="display: inline-block; background-color: #0B5CFF; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Play Voicemail (0:45s) - auth.zoom.co</a>
        </div>
      </div>
    `,
    hidden:
      "1. Fake .info sender domain. 2. Threat of immediate termination for missing a Zoom call. 3. Link points to a squatter domain (zoom.co).",
    lesson:
      "Vishing attacks often pretend to be missed audio from executives. Never click audio links that use extreme threats.",
  },

  // 7. GOOGLE WORKSPACE (Tier 3) - The "Secure" Harvester
  {
    id: 31,
    app: "Gmail",
    tier: 3,
    isPhish: true,
    sender: "no-reply@google.com.secure-auth-check.net",
    subject: "Security Alert: Password Compromised",
    body: `
      <div style="font-family: Roboto, Arial, sans-serif; max-width: 600px; border: 1px solid #dadce0; border-radius: 8px;">
        <div style="padding: 24px; border-bottom: 1px solid #dadce0;"><span style="color: #1a73e8; font-size: 24px; font-weight: bold;">Google Workspace</span></div>
        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="font-size: 20px; color: #d9534f; margin-top: 0;">Account Breach Detected</h2>
          <p style="color: #3c4043; font-size: 14px;">Dear Sir/Madam. Your password was found in a dark web leak. You must click below to update it, or your inbox will be locked forever.</p>
          <a href="#" style="display: inline-block; background-color: #1a73e8; color: #ffffff; padding: 10px 24px; text-decoration: none; border-radius: 4px; font-weight: 500;">Change Password at www.g00gle-security.com</a>
        </div>
      </div>
    `,
    hidden:
      '1. Sender is a sub-domain of a .net site. 2. Greeting is "Dear Sir/Madam". 3. Button links to g00gle (with zeros).',
    lesson:
      'Phishers often replace "o" with zeros ("0") in the destination link, while using incredibly generic greetings.',
  },

  // 8. OKTA (Tier 3) - The Triple Threat
  {
    id: 32,
    app: "Okta",
    tier: 3,
    isPhish: true,
    sender: "it-support@okta-verify-update.com",
    subject: "URGENT: Re-Sync Your MFA Token",
    body: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; border: 1px solid #e5e5e5; border-radius: 4px;">
        <div style="background-color: #f5f5f6; padding: 20px; border-bottom: 1px solid #e5e5e5;"><h1 style="color: #007dc1; margin: 0; font-size: 22px;">okta</h1></div>
        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="font-size: 18px; margin-top: 0;">Dear Colleague,</h2>
          <p style="color: #333333; font-size: 14px;">The IT department has mandated a global security update. Kindly login to the new portal to sync your device, otherwise you will lose access to all company tools by 5:00 PM today.</p>
          <a href="#" style="display: inline-block; border: 1px solid #007dc1; color: #007dc1; padding: 10px 20px; text-decoration: none; border-radius: 3px; font-weight: 600;">okta.sso.login-portal.ru</a>
        </div>
      </div>
    `,
    hidden:
      '1. Fake sender domain. 2. Unnatural internal language ("Dear Colleague", "Kindly login"). 3. Link points to a Russian (.ru) credential harvester.',
    lesson:
      'Internal IT will never refer to you as "Dear Colleague" or route an Okta MFA reset to a foreign .ru domain.',
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
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [inspectorActive, setInspectorActive] = useState(false);
  const [showRankUp, setShowRankUp] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [totalDecisions, setTotalDecisions] = useState(0);
  const [correctDecisions, setCorrectDecisions] = useState(0);
  const [isHoveringSuspicious, setIsHoveringSuspicious] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);

  const RANK_THRESHOLDS = {
    IRON: 0,
    COPPER: 400,
    BRONZE: 900,
    GOLD: 1400,
    TITANIUM: 2000,
    APEX: 2700,
  };
  const multiplier = streak >= 5 ? 3 : streak >= 3 ? 2 : 1;

  const getDifficultyTier = (currentRank) => {
    if (currentRank === "IRON" || currentRank === "COPPER") return 1;
    if (currentRank === "BRONZE" || currentRank === "GOLD") return 2;
    return 3;
  };

  const currentTier = getDifficultyTier(rank);
  const filteredEmails = EMAIL_DATABASE.filter(
    (email) => email.tier === currentTier
  );
  const [activeEmail, setActiveEmail] = useState(EMAIL_DATABASE[0]);

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
    .sort((a, b) => b.xp - a.xp)
    .map((user, index) => ({ ...user, rank: index + 1 }))
    .slice(0, 6);

  useEffect(() => {
    const getRank = (v) => {
      if (v < RANK_THRESHOLDS.COPPER) return "IRON";
      if (v < RANK_THRESHOLDS.BRONZE) return "COPPER";
      if (v < RANK_THRESHOLDS.GOLD) return "BRONZE";
      if (v < RANK_THRESHOLDS.TITANIUM) return "GOLD";
      if (v < RANK_THRESHOLDS.APEX) return "TITANIUM";
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

  const handleDecision = (choice) => {
    // 🛑 ANTI-FARMING LOCK: Stop multiple clicks if a decision is already being displayed
    if (feedback) return;

    // 🛑 THE ULTIMATE ENFORCER RULE
    // Unconditionally require the user to secure evidence (flag) before making ANY decision.
    if (!isFlagged) {
      setFeedback({
        type: "warning",
        text: "Protocol Violation: Insufficient Evidence. You must use the Inspector to scan and flag data before making a decision.",
      });
      return;
    }

    // If they pass the evidence check, record the decision
    setTotalDecisions((prev) => prev + 1);
    const isCorrect =
      (choice === "PHISH" && activeEmail.isPhish) ||
      (choice === "SAFE" && !activeEmail.isPhish);

    if (isCorrect) {
      setCorrectDecisions((prev) => prev + 1);
      const xpGained = 50 * multiplier; // 50 XP Base
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
    // 1. Reset the UI state for the new investigation
    setFeedback(null);
    setIsFlagged(false);
    setInspectorActive(false);

    // 2. Filter the database based on the player's current Rank/Tier
    // This unlocks Tier 2 and Tier 3 emails ONLY when the player is ready.
    const unlockedEmails = EMAIL_DATABASE.filter(
      (email) => email.tier <= currentTier
    );

    // 3. Prevent the exact same email from showing up twice in a row
    const availableEmails = unlockedEmails.filter(
      (email) => email.id !== activeEmail.id
    );

    // 4. Randomly select the next case from the approved difficulty pool
    const randomIndex = Math.floor(Math.random() * availableEmails.length);
    const nextCase = availableEmails[randomIndex];

    // 5. Serve the case to the Reading Pane
    setActiveEmail(nextCase);
  };

  return (
    <div className="app-container">
      {/* 1. LEFT SIDEBAR */}
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
            SKOPEPHISH
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

      {/* 2 & 3. MAIN VIEW (INBOX + READING PANE) */}
      <div
        className="content-wrapper"
        style={{ cursor: inspectorActive ? "none" : "default" }}
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        {/* INBOX QUEUE (ALL EMAILS) */}
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
                {/* The subject line is now fully visible, even if locked! */}
                <div className="inbox-item-subject">{email.subject}</div>

                <div
                  className="inbox-item-status"
                  style={{
                    color: isActive
                      ? "#eab308"
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

        {/* READING PANE */}
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
                    currentTier === 1
                      ? "#10b981"
                      : currentTier === 2
                      ? "#f59e0b"
                      : "#ef4444",
                }}
              >
                <ShieldAlert size={16} />
                {/* PRD NAMING UPDATE */}
                THREAT LEVEL:{" "}
                {currentTier === 1
                  ? "EASY / MEDIUM"
                  : currentTier === 2
                  ? "MEDIUM / HARD"
                  : "HARD / IMPOSSIBLE"}
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
                  <div style={{ fontWeight: 700 }}>
                    {activeEmail.app} Support
                  </div>

                  {/* THE FLAGGING ZONE */}
                  <div
                    onMouseEnter={() =>
                      inspectorActive && setIsHoveringSuspicious(true)
                    }
                    onMouseLeave={() => setIsHoveringSuspicious(false)}
                    onClick={() => inspectorActive && setIsFlagged(true)}
                    style={{
                      fontSize: "0.875rem",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: inspectorActive ? "none" : "default",
                      background: isFlagged ? "#fee2e2" : "transparent",
                      border: isFlagged
                        ? "1px solid #dc2626"
                        : "1px solid transparent",
                      color: isFlagged ? "#dc2626" : "#64748b",
                      fontWeight: isFlagged ? 700 : 400,
                      transition: "all 0.2s",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {isFlagged && <Target size={14} />}
                    {activeEmail.sender}
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontSize: "1rem",
                  lineHeight: "1.6",
                  color: "#334155",
                }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(activeEmail.body),
                }}
              />
            </div>

            {/* THE UPDATED, HIGH-VISIBILITY MAGNIFIER */}
            {inspectorActive && (
              <motion.div
                className="magnifier"
                animate={{ x: mousePos.x - 120, y: mousePos.y - 120 }}
                transition={{ type: "tween", duration: 0 }}
                style={{
                  // Enhanced border and box-shadow to signal danger immediately
                  borderColor:
                    isHoveringSuspicious || isFlagged ? "#ef4444" : "#eab308",
                  boxShadow:
                    isHoveringSuspicious || isFlagged
                      ? "0 0 60px rgba(0,0,0,0.6), inset 0 0 40px rgba(220,38,38,0.3)"
                      : "0 0 60px rgba(0,0,0,0.6), inset 0 0 30px rgba(234,179,8,0.2)",
                  background: isHoveringSuspicious
                    ? "rgba(0,0,0,0.85)"
                    : "rgba(255,255,255,0.05)", // Darkens on hover
                }}
              >
                {isHoveringSuspicious ? (
                  // --- THE HIGH-VISIBILITY DATA READOUT ---
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        color: "#ef4444",
                        fontWeight: 900,
                        marginBottom: "10px",
                        fontSize: "14px",
                        textAlign: "center",
                      }}
                    >
                      <AlertTriangle
                        size={18}
                        style={{ verticalAlign: "middle", marginRight: "5px" }}
                      />{" "}
                      ANOMALY
                    </div>

                    {/* The Blackout Box with Neon Green Text - Perfect Contrast */}
                    <div
                      style={{
                        background: "#000",
                        padding: "10px",
                        borderRadius: "4px",
                        border: "1px solid #10b981",
                        color: "#10b981", // Neon Emerald Green
                        fontSize: "11px",
                        fontFamily: "monospace", // Gives it that forensic "code" look
                        lineHeight: "1.4",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                      }}
                    >
                      {activeEmail.hidden}
                    </div>

                    {!isFlagged && (
                      <div
                        className="blink-text"
                        style={{
                          fontSize: "10px",
                          marginTop: "15px",
                          color: "#ef4444",
                          fontWeight: 900,
                          letterSpacing: "1px",
                          textAlign: "center",
                        }}
                      >
                        [ CLICK TO FLAG ]
                      </div>
                    )}
                    {isFlagged && (
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

      {/* OVERLAYS (RANK UP & LEADERBOARD) */}
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
                margin: "0 0 1rem 0",
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
              Level Up!!
            </motion.button>
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
