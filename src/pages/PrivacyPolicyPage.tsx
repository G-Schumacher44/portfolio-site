import Navbar from '../components/layout/Navbar';
import { Shield, Lock, EyeOff, Database } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Data Collection & Use",
      content: "GardenBook is a local-first application. We do not collect, store, or transmit any of your personal data to external servers. All information you enter—including garden plans, plant varieties, and notes—stays exclusively on your device.",
      icon: <EyeOff className="text-brand" size={18} />
    },
    {
      title: "Device Permissions",
      content: "The app may request access to your Location (to determine planting zones), Calendar (to add gardening tasks), and Reminders (to create notifications). These permissions are optional and the data remains on your device.",
      icon: <Lock className="text-brand" size={18} />
    },
    {
      title: "Third-Party Services",
      content: "We do not use third-party analytics, tracking, or advertising SDKs. Your usage of the app is completely private.",
      icon: <Shield className="text-brand" size={18} />
    },
    {
      title: "Data Deletion",
      content: "You are in full control of your data. Deleting the GardenBook app from your device will permanently remove all data stored within the app.",
      icon: <Database className="text-brand" size={18} />
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg text-text">
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-20">
          
          {/* Header */}
          <div className="mb-12 border-b border-line pb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Legal</p>
            <h1 className="mt-2 text-4xl font-bold text-text">Privacy Policy</h1>
            <p className="mt-4 text-lg text-muted">
              Last Updated: April 13, 2026
            </p>
          </div>

          <div className="prose prose-invert max-w-none mb-16">
            <p className="text-lg text-muted leading-relaxed">
              This policy applies to the GardenBook application for iOS and iPadOS. 
              My philosophy is simple: your data belongs to you, and I don't want it.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <section key={index} className="group">
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-lg bg-surface p-2 group-hover:bg-brand/10 transition-colors">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-text mb-3">{section.title}</h2>
                    <p className="text-muted leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Contact Section */}
          <section className="mt-16 rounded-2xl border border-line bg-card p-8">
            <h2 className="text-xl font-bold text-text mb-4">Questions?</h2>
            <p className="text-muted mb-6">
              If you have any questions about this privacy policy, please feel free to contact me.
            </p>
            <a
              href="mailto:me@garrettschumacher.com"
              className="text-brand hover:underline font-semibold"
            >
              me@garrettschumacher.com
            </a>
          </section>

          {/* Footer Navigation */}
          <div className="mt-24 pt-8 border-t border-line text-sm text-muted">
            <a href="/" className="hover:text-brand transition-colors underline underline-offset-4">
              Back to garrettschumacher.com
            </a>
          </div>

        </div>
      </main>
    </>
  );
}
