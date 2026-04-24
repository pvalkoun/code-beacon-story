export interface Product {
  id: "scp" | "bcd" | "pca" | "cno";
  name: string;
  fullName: string;
  tagline: string;
  description: string;
  benefits: string[];
  setupSteps: SetupStep[];
  isExternal?: boolean;
  externalPath?: string;
}

export interface SetupStep {
  step: number;
  title: string;
  description: string;
  apiEndpointId: string;
  details: string;
  /** Optional internal link rendered in place of the API endpoint card. */
  externalLink?: { label: string; to: string };
}

export const products: Product[] = [
  {
    id: "pca",
    name: "Call Authentication",
    fullName: "TruContact Call Authentication (CCID)",
    tagline: "Verify caller identity in real-time using STIR/SHAKEN before every call",
    description: "Call Authentication (PCA) is a standards-based REST API for verifying caller identity using IETF RFC 8224 and the ATIS SHAKEN framework. It is a prerequisite for both Spoofed Call Protection and Branded Call Display — every outbound call must be authenticated through the CCID service before any TruContact features can take effect.",
    benefits: [
      "Required prerequisite for SCP and BCD to function",
      "Real-time caller identity verification using STIR/SHAKEN",
      "Enables full attestation (A-level) for outbound calls",
      "Supports API Key and IP Allowlist authentication",
      "Standards-compliant with IETF RFC 8224 and ATIS SHAKEN"
    ],
    isExternal: true,
    externalPath: "/call-auth",
    setupSteps: []
  },
  {
    id: "cno",
    name: "Caller Name Optimization",
    fullName: "Caller Name Optimization",
    tagline: "Register verified business telephone numbers to mitigate spam tagging and blocking",
    description: "Registers verified business telephone numbers with terminating telecom service providers to mitigate spam tagging and blocking. CNO includes reputation monitoring and remediation and provides the ability to manage how caller name appears on landline devices.",
    benefits: [
      "Register verified business numbers",
      "Help reduce legitimate calls from being labeled as spam",
      "Improve call delivery and answer rates",
      "Protect your organization's calling reputation",
      "Real-time monitoring of spam tag status across carriers",
      "Automated remediation for mislabeled numbers",
      "Landline name management"
    ],
    setupSteps: [
      {
        step: 1,
        title: "Authenticate",
        description: "Obtain an access token to authorize API calls.",
        apiEndpointId: "auth-token",
        details: "Use your credentials to authenticate with the TCS platform. The returned access token must be included in the Authorization header of all subsequent requests."
      },
      {
        step: 2,
        title: "Create Account",
        description: "Set up your enterprise account on the TCS platform.",
        apiEndpointId: "create-account",
        details: "Create an enterprise account with SDPR service enabled. This establishes your organization's identity on the platform."
      },
      {
        step: 3,
        title: "Attach TCS Configuration",
        description: "Enable TCS services and configure carrier distributors.",
        apiEndpointId: "attach-account-tcs",
        details: "Attach TCS configuration to your account, specifying the lead generation source and which carrier distributors should be enabled for spam tag mitigation."
      },
      {
        step: 4,
        title: "Attach Features",
        description: "Enable the Spam Tag Mitigation feature on your account.",
        apiEndpointId: "attach-feature",
        details: "Attach the CNO feature with per-carrier partner enablement (att, tmobile, verizon). This activates spam tag monitoring and remediation for your numbers."
      },
      {
        step: 5,
        title: "Create Caller Profile",
        description: "Define your organization's calling identity.",
        apiEndpointId: "attach-cno-caller-profile",
        details: "Create a caller profile with CNO service configuration. The profile name is auto-generated (e.g., xxxCNOxx). Each carrier partner status will be set to TU-Review-Requested for initial validation."
      },
      {
        step: 6,
        title: "Register Phone Numbers",
        description: "Add your telephone numbers for spam tag monitoring.",
        apiEndpointId: "create-tn-asset",
        details: "Register each telephone number (TN) as an asset and link it to the CNO caller profile created in the previous step (e.g., Your Company Name_CNO_20260225-212320). Pass its id as caller_profile_id in the request — the response will echo the profile name under caller_profile and within each CNO partner_data entry. Use full_ownership: true for numbers you own directly, or full_ownership: false for BYOC numbers."
      },
      {
        step: 7,
        title: "Register for Webhooks",
        description: "Subscribe to real-time spam tag and appeal notifications via webhook.",
        apiEndpointId: "",
        details: "Spam tag mitigation is event-driven — register for webhook notifications to receive real-time updates when tagging status changes, appeals are granted or declined, and partner enablement events occur. This eliminates the need to poll for status and ensures your team is notified immediately when remediation is required.",
        externalLink: { label: "View Webhook Notifications Setup Guide", to: "/resources/webhooks/guide" }
      }
    ]
  },
  {
    id: "bcd",
    name: "Branded Call Display",
    fullName: "TruContact Branded Call Display",
    tagline: "Improve customer engagement by adding rich branded content to the mobile call display",
    description: "Branded Call Display (BCD) enhances outbound calls with rich visual content displayed on the recipient's mobile device. This includes your company logo, business name, call reason, and other contextual information that helps recipients identify and trust your calls, dramatically improving answer rates.",
    benefits: [
      "Up to 56% improvement in call answer rates",
      "Display company logo and brand on recipient's phone",
      "Show call reason to increase trust and engagement",
      "Up to 32% increase in incremental income",
      "Differentiate from spam and unknown callers"
    ],
    setupSteps: [
      {
        step: 1,
        title: "Authenticate",
        description: "Obtain an access token to authorize API calls.",
        apiEndpointId: "auth-token",
        details: "Use your credentials to authenticate with the TCS platform. The returned access token must be included in the Authorization header of all subsequent requests."
      },
      {
        step: 2,
        title: "Create Account",
        description: "Set up your enterprise account on the TCS platform.",
        apiEndpointId: "create-account",
        details: "Create an enterprise account with SDPR service enabled. This establishes your organization's identity on the platform."
      },
      {
        step: 3,
        title: "Attach TCS Configuration",
        description: "Enable TCS services and configure carrier distributors.",
        apiEndpointId: "attach-account-tcs",
        details: "Attach TCS configuration to your account, specifying the lead generation source and which carrier distributors should display your branded content."
      },
      {
        step: 4,
        title: "Attach Features",
        description: "Enable the Branded Call Display feature on your account.",
        apiEndpointId: "attach-feature",
        details: "Attach features including RICH-BCD with per-carrier partner enablement. You can also attach AUTH-BCD and NAME-BCD in the same request for different branding tiers."
      },
      {
        step: 5,
        title: "Create Image",
        description: "Upload your company logo image for branded call display.",
        apiEndpointId: "create-image",
        details: "Upload your image via a public URL. The image is processed and stored internally. Save the returned id — it will be used as image_id when creating an image profile in the next step."
      },
      {
        step: 6,
        title: "Create Image Profile",
        description: "Create a profile linking your image for carrier vetting.",
        apiEndpointId: "create-image-profile",
        details: "Create an image profile using the image_id from the previous step. The profile is automatically submitted for vetting across all carrier partners. Poll the Get Image Profile endpoint until vetting is complete before proceeding."
      },
      {
        step: 7,
        title: "Create Caller Profile",
        description: "Define your brand's visual identity for outbound calls.",
        apiEndpointId: "attach-bcd-caller-profile",
        details: "Create a caller profile with your branded_caller_name, call_reason, and the image_profile_id from the previous step for logo display. The RICH-BCD service is configured with per-carrier partner statuses."
      },
      {
        step: 8,
        title: "Register Phone Numbers",
        description: "Add your telephone numbers for branded display.",
        apiEndpointId: "create-tn-asset",
        details: "Register each telephone number (TN) and link it to your branded caller profile. Use full_ownership: true for numbers you own directly, or full_ownership: false for BYOC numbers managed through third-party carriers like Twilio or Genesys."
      },
      {
        step: 9,
        title: "Register for Webhooks",
        description: "Subscribe to real-time vetting, partner enablement, and image profile notifications.",
        apiEndpointId: "",
        details: "BCD setup involves carrier vetting and per-partner enablement that progresses asynchronously. Register for webhook notifications to receive real-time updates when image profile vetting completes, partner enablement transitions occur (Enable-Completed, Enable-Failed, Suspend-Completed, etc.), and TN-level vetting succeeds — eliminating the need to poll status endpoints.",
        externalLink: { label: "View Webhook Notifications Setup Guide", to: "/resources/webhooks/guide" }
      }
    ]
  },
  {
    id: "scp",
    name: "Spoofed Call Protection",
    fullName: "TruContact Spoofed Call Protection",
    tagline: "Digitally sign outbound calls to prevent fraudsters from spoofing your numbers",
    description: "Spoofed Call Protection (SCP) uses STIR/SHAKEN technology to digitally sign your outbound calls, proving to carriers and call recipients that the call genuinely originates from your organization. This prevents bad actors from spoofing your phone numbers to conduct fraud, protecting both your brand reputation and your customers.",
    benefits: [
      "Prevent fraudsters from spoofing your phone numbers",
      "Protect your brand reputation and customer trust",
      "Meet STIR/SHAKEN regulatory compliance requirements",
      "Reduce illegal robocalls made using your numbers",
      "Improve call answer rates with authenticated calls"
    ],
    setupSteps: [
      {
        step: 1,
        title: "Authenticate",
        description: "Obtain an access token to authorize API calls.",
        apiEndpointId: "auth-token",
        details: "Use your credentials to authenticate with the TCS platform. The returned access token must be included in the Authorization header of all subsequent requests."
      },
      {
        step: 2,
        title: "Create Account",
        description: "Set up your enterprise account on the TCS platform.",
        apiEndpointId: "create-account",
        details: "Create an enterprise account with SDPR service enabled. This establishes your organization's identity on the platform."
      },
      {
        step: 3,
        title: "Attach TCS Configuration",
        description: "Enable TCS services and configure carrier distributors.",
        apiEndpointId: "attach-account-tcs",
        details: "Attach TCS configuration to your account, specifying the lead generation source and which carrier distributors (AT&T, T-Mobile, Verizon) should be enabled."
      },
      {
        step: 4,
        title: "Attach Features",
        description: "Enable the Spoofed Call Protection feature on your account.",
        apiEndpointId: "attach-feature",
        details: "Attach features including SPOOF-CALL-PROTECTION with per-carrier partner enablement (att, tmobile, verizon). Multiple features can be attached in a single request."
      },
      {
        step: 5,
        title: "Create Caller Profile",
        description: "Define how your organization appears on outbound calls.",
        apiEndpointId: "attach-scp-caller-profile",
        details: "Create a caller profile with CCID-ORIG and SPOOF-CALL-PROTECTION service configuration. Each carrier partner status will be set to TU-Review-Requested."
      },
      {
        step: 6,
        title: "Register Phone Numbers",
        description: "Add your telephone numbers to be protected.",
        apiEndpointId: "create-tn-asset",
        details: "Register each telephone number (TN) as an asset and link it to the SCP caller profile created in the previous step (e.g., Your Company Name_SCP_20260225-212320). Pass its id as caller_profile_id in the request — the response will echo the profile name under caller_profile and within each SPOOF-CALL-PROTECTION partner_data entry. Use full_ownership: true for numbers you own directly, or full_ownership: false for BYOC numbers managed through third-party carriers like Twilio or Genesys."
      },
      {
        step: 7,
        title: "Register for Webhooks",
        description: "Subscribe to real-time vetting and partner enablement notifications.",
        apiEndpointId: "",
        details: "SCP relies on per-carrier partner enablement that progresses asynchronously. Register for webhook notifications to receive real-time updates when partner_status transitions occur (Enable-Completed, Enable-Failed, Suspend-Completed, Resume-Completed, etc.) for each TN — eliminating the need to poll status endpoints.",
        externalLink: { label: "View Webhook Notifications Setup Guide", to: "/resources/webhooks/guide" }
      }
    ]
  }
];

export const getProduct = (id: string) => products.find(p => p.id === id);
