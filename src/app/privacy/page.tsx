import { LegalDocument, LegalSection } from "@/components/legal/LegalDocument";
import {
  LEGAL_BRAND,
  LEGAL_CONTACT,
  LEGAL_ENTITY,
} from "@/lib/legal/constants";
import { CANONICAL_SITE_URL, createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: `Privacy Policy for ${LEGAL_ENTITY} (${LEGAL_BRAND}) — how we collect, use, and protect your data.`,
  path: "/privacy",
  siteUrl: CANONICAL_SITE_URL,
});

/** Privacy Policy — how CoolPlugz Inc. handles personal data. */
export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy Policy">
      <LegalSection title="1. Introduction">
        <p>
          {LEGAL_ENTITY} (&quot;{LEGAL_ENTITY},&quot; &quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;) operates {LEGAL_BRAND} ({CANONICAL_SITE_URL}), a Claude plugin and MCP
          platform that helps developers gather context from tools such as Jira, GitHub, Notion, and
          Slack.
        </p>
        <p>
          This Privacy Policy explains how we collect, use, disclose, and safeguard information when
          you use our website, products, and services (collectively, the &quot;Service&quot;). By
          using the Service, you agree to the practices described here.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p>
          <strong>Account information.</strong> When you sign in, we collect your email address and
          basic account details needed to authenticate you and manage your subscription.
        </p>
        <p>
          <strong>Billing information.</strong> Payments are processed by Stripe. We receive
          subscription status, customer identifiers, and limited billing metadata from Stripe. We do
          not store full payment card numbers on our servers.
        </p>
        <p>
          <strong>Connected tool data.</strong> If you connect third-party services (such as Jira,
          GitHub, Notion, or Slack), we access data from those services only as needed to provide
          the Service — for example, tasks, pull requests, messages, and related metadata you
          authorize through OAuth.
        </p>
        <p>
          <strong>Usage and technical data.</strong> We may collect log data, device and browser
          information, IP address, pages visited, and interaction data to operate, secure, and
          improve the Service.
        </p>
        <p>
          <strong>Communications.</strong> If you contact us or join a waitlist, we collect the
          information you provide, such as your email address and message content.
        </p>
      </LegalSection>

      <LegalSection title="3. How We Use Information">
        <ul>
          <li>Provide, maintain, and improve the Service</li>
          <li>Authenticate users and manage accounts</li>
          <li>Process subscriptions and deliver MCP access</li>
          <li>Sync and display data from connected third-party tools at your direction</li>
          <li>Send transactional emails, such as sign-in links and billing notices</li>
          <li>Monitor security, prevent abuse, and enforce our Terms of Service</li>
          <li>Comply with legal obligations</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Legal Bases for Processing">
        <p>
          Where applicable under laws such as the GDPR, we process personal data based on: (a)
          performance of a contract with you; (b) our legitimate interests in operating and
          securing the Service; (c) your consent, where required; and (d) compliance with legal
          obligations.
        </p>
      </LegalSection>

      <LegalSection title="5. How We Share Information">
        <p>We do not sell your personal information. We may share information with:</p>
        <ul>
          <li>
            <strong>Service providers</strong> that help us operate the Service, such as hosting,
            email delivery, payment processing, analytics, and infrastructure partners
          </li>
          <li>
            <strong>Connected integrations</strong> only when you authorize them and only to the
            extent required to provide requested functionality
          </li>
          <li>
            <strong>Legal and safety recipients</strong> when required by law, court order, or to
            protect rights, safety, and security
          </li>
          <li>
            <strong>Business transfers</strong> in connection with a merger, acquisition,
            reorganization, or sale of assets, subject to appropriate safeguards
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Data Retention">
        <p>
          We retain personal information for as long as needed to provide the Service, fulfill the
          purposes described in this policy, comply with legal obligations, resolve disputes, and
          enforce agreements. Retention periods may vary depending on the type of data and your
          account status.
        </p>
      </LegalSection>

      <LegalSection title="7. Security">
        <p>
          We use reasonable administrative, technical, and organizational measures designed to
          protect personal information. No method of transmission or storage is completely secure,
          and we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="8. Your Rights and Choices">
        <p>
          Depending on your location, you may have rights to access, correct, delete, restrict, or
          object to certain processing of your personal information, and to receive a portable copy
          of your data. You may also withdraw consent where processing is consent-based.
        </p>
        <p>
          To exercise these rights, contact us at{" "}
          <a href={`mailto:${LEGAL_CONTACT.privacy}`} className="text-charcoal underline">
            {LEGAL_CONTACT.privacy}
          </a>
          . We may need to verify your identity before responding.
        </p>
        <p>
          You can disconnect third-party integrations at any time through the Service or the
          relevant third-party account settings.
        </p>
      </LegalSection>

      <LegalSection title="9. International Transfers">
        <p>
          We may process and store information in the United States and other countries where we
          or our service providers operate. Where required, we use appropriate safeguards for
          cross-border transfers.
        </p>
      </LegalSection>

      <LegalSection title="10. Children&apos;s Privacy">
        <p>
          The Service is not directed to children under 16, and we do not knowingly collect
          personal information from children under 16. If you believe a child has provided us
          personal information, contact us and we will take appropriate steps to delete it.
        </p>
      </LegalSection>

      <LegalSection title="11. Third-Party Links and Services">
        <p>
          The Service may link to or integrate with third-party websites and services. Their privacy
          practices are governed by their own policies. We encourage you to review those policies
          before connecting an account or sharing data.
        </p>
      </LegalSection>

      <LegalSection title="12. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. We will post the revised version on
          this page and update the &quot;Last updated&quot; date. Material changes may be
          communicated by email or in-product notice where appropriate.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact Us">
        <p>
          Questions about this Privacy Policy or our data practices may be sent to:
        </p>
        <p>
          {LEGAL_ENTITY}
          <br />
          Email:{" "}
          <a href={`mailto:${LEGAL_CONTACT.privacy}`} className="text-charcoal underline">
            {LEGAL_CONTACT.privacy}
          </a>
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
