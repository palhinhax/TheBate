import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - TheBatee",
  description: "Terms and conditions for using TheBatee platform",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm">
        <p className="text-muted-foreground">
          <strong>Effective Date:</strong> January 9, 2026
          <br />
          <strong>Last Updated:</strong> January 9, 2026
        </p>

        <section>
          <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p>
            By accessing or using TheBatee (&quot;the Platform&quot;, &quot;we&quot;,
            &quot;our&quot;, or &quot;us&quot;), you agree to be bound by these Terms of Service. If
            you do not agree to these terms, you must not use the Platform.
          </p>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the Platform
            constitutes acceptance of modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">2. Eligibility</h2>
          <p>
            You must be at least 13 years old to use this Platform. By using the Platform, you
            represent that you meet this age requirement.
          </p>
          <p>
            If you are under 18, you confirm that you have parental or guardian consent to use the
            Platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">3. User-Generated Content</h2>
          <p>
            <strong>3.1 Your Responsibility:</strong> All content you post (topics, comments, votes)
            is your sole responsibility. We are not responsible for any content posted by users.
          </p>
          <p>
            <strong>3.2 Content License:</strong> By posting content, you grant us a worldwide,
            non-exclusive, royalty-free license to use, reproduce, modify, and display your content
            on the Platform.
          </p>
          <p>
            <strong>3.3 No Pre-Moderation:</strong> We do not pre-screen content. Content is posted
            directly by users. However, we reserve the right to review and remove content at any
            time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">4. Prohibited Content and Conduct</h2>
          <p>You agree NOT to post content or engage in conduct that:</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>Hate Speech:</strong> Promotes hatred, discrimination, or violence against
              individuals or groups based on race, ethnicity, religion, gender, sexual orientation,
              disability, or nationality.
            </li>
            <li>
              <strong>Harassment:</strong> Threatens, bullies, harasses, or intimidates any person
              or entity.
            </li>
            <li>
              <strong>Illegal Content:</strong> Violates any local, national, or international law
              or regulation.
            </li>
            <li>
              <strong>Violence:</strong> Glorifies, incites, or threatens violence or physical harm.
            </li>
            <li>
              <strong>Sexual Content:</strong> Contains pornographic, sexually explicit, or child
              exploitation material.
            </li>
            <li>
              <strong>Misinformation:</strong> Deliberately spreads false information that could
              cause harm.
            </li>
            <li>
              <strong>Spam:</strong> Posts repetitive, unsolicited, or promotional content.
            </li>
            <li>
              <strong>Impersonation:</strong> Impersonates any person or entity.
            </li>
            <li>
              <strong>Intellectual Property:</strong> Infringes on copyrights, trademarks, or other
              intellectual property rights.
            </li>
            <li>
              <strong>Platform Abuse:</strong> Attempts to hack, manipulate votes, create fake
              accounts, or disrupt the Platform.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">5. Content Moderation and Removal</h2>
          <p>
            <strong>5.1 Our Rights:</strong> We reserve the absolute right, at our sole discretion,
            to:
          </p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Remove any content for any reason or no reason</li>
            <li>Suspend or ban user accounts temporarily or permanently</li>
            <li>Edit or modify content if necessary for legal compliance</li>
            <li>Report illegal activity to law enforcement</li>
            <li>Refuse service to anyone</li>
          </ul>
          <p>
            <strong>5.2 No Obligation:</strong> We are under no obligation to monitor, review, or
            moderate content. The presence of content does not constitute endorsement.
          </p>
          <p>
            <strong>5.3 Reporting:</strong> Users can report content that violates these terms. We
            will review reports but are not obligated to take action.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">6. Disclaimer of Liability</h2>
          <p>
            <strong>6.1 No Warranties:</strong> The Platform is provided &quot;AS IS&quot; and
            &quot;AS AVAILABLE&quot; without warranties of any kind, express or implied.
          </p>
          <p>
            <strong>6.2 No Liability for User Content:</strong> We are not liable for any
            user-generated content, including defamatory, offensive, or illegal content posted by
            users.
          </p>
          <p>
            <strong>6.3 Third-Party Content:</strong> We are not responsible for any harm caused by
            third-party content, links, or advertisements on the Platform.
          </p>
          <p>
            <strong>6.4 Maximum Liability:</strong> To the fullest extent permitted by law, our
            total liability for any claims arising from your use of the Platform shall not exceed
            €100 (one hundred euros) or the equivalent amount in your local currency.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">7. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless TheBatee, its operators,
            administrators, and affiliates from any claims, damages, losses, liabilities, and
            expenses (including legal fees) arising from:
          </p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Your use of the Platform</li>
            <li>Your content or conduct</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party rights</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">8. DMCA and Copyright</h2>
          <p>
            If you believe content on the Platform infringes your copyright, contact us at:{" "}
            <strong>legal@thebatee.com</strong>
          </p>
          <p>
            We will review DMCA takedown requests and may remove infringing content. Repeat
            infringers will have their accounts terminated.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">9. Governing Law and Jurisdiction</h2>
          <p>
            These Terms are governed by the laws of Portugal. Any disputes shall be resolved in the
            courts of Portugal.
          </p>
          <p>
            If you are accessing the Platform from outside Portugal, you are responsible for
            compliance with your local laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">10. Severability</h2>
          <p>
            If any provision of these Terms is found to be invalid or unenforceable, the remaining
            provisions shall remain in full force and effect.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">11. Contact</h2>
          <p>
            For questions about these Terms, contact us at:{" "}
            <a href="mailto:legal@thebatee.com" className="text-primary underline">
              legal@thebatee.com
            </a>
          </p>
        </section>

        <section className="mt-12 rounded-lg border bg-muted/50 p-6">
          <h3 className="mb-3 text-lg font-semibold">Summary (Not Legally Binding)</h3>
          <p className="text-sm text-muted-foreground">
            By using TheBatee, you agree to be respectful and follow the rules. We can remove
            content or ban users who violate these terms. You are responsible for what you post. We
            are not liable for user content or any damages arising from your use of the Platform.
            Hate speech, harassment, illegal content, and spam are prohibited.
          </p>
        </section>
      </div>
    </div>
  );
}
