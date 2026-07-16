import { LegalDocument, LegalSection } from "@/components/legal/LegalDocument";
import {
  LEGAL_BRAND,
  LEGAL_CONTACT,
  LEGAL_ENTITY,
  LEGAL_JURISDICTION,
} from "@/lib/legal/constants";
import { CANONICAL_SITE_URL, createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Terms of Service",
  description: `Terms of Service for ${LEGAL_ENTITY} (${LEGAL_BRAND}) — rules for using our Claude plugin and MCP platform.`,
  path: "/terms",
  siteUrl: CANONICAL_SITE_URL,
});

/** Terms of Service — rules for using CoolPlugz Inc. products. */
export default function TermsPage() {
  return (
    <LegalDocument title="Terms of Service">
      <LegalSection title="1. Agreement to Terms">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of the website,
          products, and services offered by {LEGAL_ENTITY} (&quot;{LEGAL_ENTITY},&quot;
          &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) through {LEGAL_BRAND} (
          {CANONICAL_SITE_URL}) (collectively, the &quot;Service&quot;).
        </p>
        <p>
          By accessing or using the Service, you agree to these Terms and our{" "}
          <a href="/privacy" className="text-charcoal underline">
            Privacy Policy
          </a>
          . If you do not agree, do not use the Service.
        </p>
      </LegalSection>

      <LegalSection title="2. Description of Service">
        <p>
          {LEGAL_ENTITY} provides a Claude plugin and MCP platform that helps developers gather
          context from connected tools, automate workflows, and interact with tasks, code, and
          communications through Claude. Features may include MCP URL provisioning, integrations
          with third-party services, subscription billing, and related tooling.
        </p>
        <p>
          We may modify, suspend, or discontinue any part of the Service at any time, with or
          without notice, subject to applicable law.
        </p>
      </LegalSection>

      <LegalSection title="3. Eligibility and Accounts">
        <p>
          You must be at least 18 years old and able to form a binding contract to use the Service.
          You are responsible for maintaining the confidentiality of your account credentials and
          for all activity under your account.
        </p>
        <p>
          You agree to provide accurate information and to notify us promptly of unauthorized use
          of your account.
        </p>
      </LegalSection>

      <LegalSection title="4. Subscriptions, Billing, and Trials">
        <p>
          Paid plans, free trials, and add-ons are described on our pricing page. By subscribing,
          you authorize us and our payment processor, Stripe, to charge applicable fees on a
          recurring basis until you cancel.
        </p>
        <ul>
          <li>Fees are billed in advance according to the plan you select</li>
          <li>Free trials convert to paid plans unless canceled before the trial ends, where applicable</li>
          <li>Taxes may apply depending on your location</li>
          <li>Except where required by law, fees are non-refundable</li>
        </ul>
        <p>
          You may cancel through your account settings or Stripe customer portal, where available.
          Cancellation stops future billing but does not entitle you to a refund for the current
          billing period unless required by law.
        </p>
      </LegalSection>

      <LegalSection title="5. Acceptable Use">
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for unlawful, harmful, fraudulent, or abusive purposes</li>
          <li>Attempt to gain unauthorized access to systems, accounts, or data</li>
          <li>Reverse engineer, scrape, or interfere with the Service except as permitted by law</li>
          <li>Upload malware or content that infringes intellectual property or privacy rights</li>
          <li>Resell, sublicense, or misuse MCP access in ways not authorized by your plan</li>
          <li>Use the Service to generate or distribute spam, harassment, or malicious content</li>
        </ul>
        <p>
          We may investigate violations and suspend or terminate access where appropriate.
        </p>
      </LegalSection>

      <LegalSection title="6. Third-Party Integrations">
        <p>
          The Service may connect to third-party platforms such as Jira, GitHub, Notion, Slack,
          Claude, and Stripe. Your use of those services is governed by their own terms and
          policies. {LEGAL_ENTITY} is not responsible for third-party services and does not control
          their availability, security, or data practices.
        </p>
        <p>
          You authorize us to access and process data from connected services solely to provide
          functionality you request.
        </p>
      </LegalSection>

      <LegalSection title="7. AI-Generated Output">
        <p>
          The Service may produce automated suggestions, drafts, code, or other output through AI
          systems. You are solely responsible for reviewing, validating, and using such output.
          AI results may be inaccurate or incomplete. Do not rely on the Service as a substitute for
          professional judgment, security review, legal advice, or human oversight where required.
        </p>
      </LegalSection>

      <LegalSection title="8. Intellectual Property">
        <p>
          The Service, including software, branding, design, documentation, and content provided
          by {LEGAL_ENTITY}, is owned by {LEGAL_ENTITY} or its licensors and is protected by
          intellectual property laws. Except for the limited rights expressly granted in these
          Terms, no rights are transferred to you.
        </p>
        <p>
          You retain ownership of content you submit or connect through the Service. You grant{" "}
          {LEGAL_ENTITY} a limited license to host, process, and display that content only as
          needed to operate the Service.
        </p>
      </LegalSection>

      <LegalSection title="9. Confidentiality and Security">
        <p>
          We implement reasonable measures to protect the Service, but you acknowledge that no
          online service is completely secure. You are responsible for securing your credentials,
          OAuth connections, and any code or data you choose to process through the Service.
        </p>
      </LegalSection>

      <LegalSection title="10. Disclaimer of Warranties">
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot; TO THE MAXIMUM
          EXTENT PERMITTED BY LAW, {LEGAL_ENTITY.toUpperCase()} DISCLAIMS ALL WARRANTIES, EXPRESS
          OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT,
          AND UNINTERRUPTED OR ERROR-FREE OPERATION.
        </p>
      </LegalSection>

      <LegalSection title="11. Limitation of Liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, {LEGAL_ENTITY.toUpperCase()} AND ITS OFFICERS,
          DIRECTORS, EMPLOYEES, AND SUPPLIERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, GOODWILL, OR
          BUSINESS INTERRUPTION, ARISING FROM YOUR USE OF THE SERVICE.
        </p>
        <p>
          OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO THE SERVICE OR THESE
          TERMS WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE TWELVE (12)
          MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM OR (B) ONE HUNDRED U.S. DOLLARS (USD
          $100).
        </p>
      </LegalSection>

      <LegalSection title="12. Indemnification">
        <p>
          You agree to defend, indemnify, and hold harmless {LEGAL_ENTITY} from claims, damages,
          losses, and expenses (including reasonable attorneys&apos; fees) arising from your use of
          the Service, your content, your connected integrations, or your violation of these Terms
          or applicable law.
        </p>
      </LegalSection>

      <LegalSection title="13. Termination">
        <p>
          You may stop using the Service at any time. We may suspend or terminate your access if
          you violate these Terms, create risk or legal exposure, or if we discontinue the Service.
          Upon termination, provisions that by nature should survive will remain in effect,
          including payment obligations, disclaimers, limitations of liability, and indemnification.
        </p>
      </LegalSection>

      <LegalSection title="14. Governing Law and Disputes">
        <p>
          These Terms are governed by the laws of the {LEGAL_JURISDICTION}, without regard to
          conflict-of-law principles. Except where prohibited, you agree that exclusive jurisdiction
          for disputes arising from these Terms or the Service lies in the state or federal courts
          located in Delaware, and you consent to personal jurisdiction there.
        </p>
      </LegalSection>

      <LegalSection title="15. Changes to These Terms">
        <p>
          We may update these Terms from time to time. The updated version will be posted on this
          page with a revised &quot;Last updated&quot; date. Continued use of the Service after
          changes become effective constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="16. Contact">
        <p>
          Questions about these Terms may be sent to:
        </p>
        <p>
          {LEGAL_ENTITY}
          <br />
          Email:{" "}
          <a href={`mailto:${LEGAL_CONTACT.legal}`} className="text-charcoal underline">
            {LEGAL_CONTACT.legal}
          </a>
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
