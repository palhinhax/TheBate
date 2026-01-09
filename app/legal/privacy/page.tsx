import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - TheBatee",
  description: "Privacy policy and data protection information for TheBatee",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm">
        <p className="text-muted-foreground">
          <strong>Effective Date:</strong> January 9, 2026
          <br />
          <strong>Last Updated:</strong> January 9, 2026
        </p>

        <section>
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p>
            TheBatee (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal data when you use our Platform.
          </p>
          <p>
            This policy complies with the General Data Protection Regulation (GDPR) and other applicable data protection laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">2. Data We Collect</h2>
          
          <h3 className="text-xl font-semibold">2.1 Account Information</h3>
          <ul className="ml-6 list-disc space-y-1">
            <li><strong>Email address:</strong> Required for account creation and communication</li>
            <li><strong>Username:</strong> Public identifier for your account</li>
            <li><strong>Name:</strong> Optional display name</li>
            <li><strong>Password:</strong> Stored as a secure hash (never stored in plain text)</li>
            <li><strong>Profile picture:</strong> Optional image upload</li>
          </ul>

          <h3 className="text-xl font-semibold">2.2 Content Data</h3>
          <ul className="ml-6 list-disc space-y-1">
            <li>Topics you create</li>
            <li>Comments you post</li>
            <li>Votes and reactions</li>
            <li>Reports you submit</li>
          </ul>

          <h3 className="text-xl font-semibold">2.3 Usage Data</h3>
          <ul className="ml-6 list-disc space-y-1">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Pages visited and time spent</li>
            <li>Referral source</li>
            <li>Language preferences</li>
          </ul>

          <h3 className="text-xl font-semibold">2.4 Cookies and Tracking</h3>
          <p>
            We use cookies for authentication and preferences. Third-party services (Google AdSense, analytics) may set additional cookies. You can disable cookies in your browser settings, but some features may not work.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">3. How We Use Your Data</h2>
          <ul className="ml-6 list-disc space-y-2">
            <li><strong>Provide Services:</strong> To operate the Platform, authenticate users, and display content</li>
            <li><strong>Communication:</strong> To send account-related emails (verification, password reset)</li>
            <li><strong>Moderation:</strong> To enforce our Terms of Service and detect violations</li>
            <li><strong>Analytics:</strong> To understand usage patterns and improve the Platform</li>
            <li><strong>Advertising:</strong> To display relevant ads via Google AdSense</li>
            <li><strong>Legal Compliance:</strong> To comply with legal obligations and prevent illegal activity</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">4. Legal Basis for Processing (GDPR)</h2>
          <p>We process your data based on:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li><strong>Consent:</strong> When you create an account and accept these terms</li>
            <li><strong>Contractual Necessity:</strong> To provide the services you requested</li>
            <li><strong>Legitimate Interest:</strong> To improve the Platform, prevent abuse, and ensure security</li>
            <li><strong>Legal Obligation:</strong> To comply with applicable laws</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">5. Data Sharing and Disclosure</h2>
          <p>
            <strong>5.1 Public Content:</strong> Your username, topics, comments, and votes are publicly visible to all users.
          </p>
          <p>
            <strong>5.2 Third-Party Services:</strong> We use:
          </p>
          <ul className="ml-6 list-disc space-y-1">
            <li><strong>Neon (PostgreSQL):</strong> Database hosting</li>
            <li><strong>Vercel:</strong> Platform hosting</li>
            <li><strong>Google AdSense:</strong> Advertising</li>
            <li><strong>Email Service Provider:</strong> For transactional emails</li>
          </ul>
          <p>
            <strong>5.3 Legal Requirements:</strong> We may disclose data if required by law, court order, or to prevent harm.
          </p>
          <p>
            <strong>5.4 No Sale of Data:</strong> We do not sell your personal data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">6. Data Retention</h2>
          <ul className="ml-6 list-disc space-y-1">
            <li><strong>Active Accounts:</strong> Data is retained as long as your account is active</li>
            <li><strong>Deleted Accounts:</strong> Data is permanently deleted within 30 days of account deletion</li>
            <li><strong>Legal Holds:</strong> Data may be retained longer if required by law or for legal proceedings</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">7. Your Rights (GDPR)</h2>
          <p>You have the right to:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Rectification:</strong> Correct inaccurate data</li>
            <li><strong>Erasure:</strong> Delete your account and data (&quot;right to be forgotten&quot;)</li>
            <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
            <li><strong>Object:</strong> Object to certain data processing activities</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
            <li><strong>Complaint:</strong> File a complaint with your local data protection authority</li>
          </ul>
          <p>
            To exercise these rights, contact us at:{" "}
            <a href="mailto:privacy@thebatee.com" className="text-primary underline">
              privacy@thebatee.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">8. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your data:
          </p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Passwords are hashed using bcrypt</li>
            <li>HTTPS encryption for all connections</li>
            <li>Regular security updates and monitoring</li>
            <li>Access controls and authentication</li>
          </ul>
          <p>
            However, no system is 100% secure. You are responsible for keeping your password confidential.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">9. Children&apos;s Privacy</h2>
          <p>
            The Platform is not intended for children under 13. We do not knowingly collect data from children under 13. If you believe a child has provided data, contact us immediately at{" "}
            <a href="mailto:privacy@thebatee.com" className="text-primary underline">
              privacy@thebatee.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">10. International Data Transfers</h2>
          <p>
            Your data may be transferred to and processed in countries outside the European Economic Area (EEA), including the United States. We ensure appropriate safeguards are in place to protect your data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes by email or a notice on the Platform. Continued use constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">12. Contact</h2>
          <p>
            For questions about this Privacy Policy or to exercise your rights, contact us at:
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:privacy@thebatee.com" className="text-primary underline">
              privacy@thebatee.com
            </a>
          </p>
          <p>
            <strong>Legal:</strong>{" "}
            <a href="mailto:legal@thebatee.com" className="text-primary underline">
              legal@thebatee.com
            </a>
          </p>
        </section>

        <section className="mt-12 rounded-lg border bg-muted/50 p-6">
          <h3 className="mb-3 text-lg font-semibold">Summary (Not Legally Binding)</h3>
          <p className="text-sm text-muted-foreground">
            We collect your email, username, and content you post. Your data is used to provide the service, improve the Platform, and comply with laws. We do not sell your data. You can delete your account anytime. We use cookies and third-party services like Google AdSense. You have GDPR rights including access, deletion, and portability. Contact privacy@thebatee.com for questions.
          </p>
        </section>
      </div>
    </div>
  );
}
