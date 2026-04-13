import Navbar from '../components/layout/Navbar';
import { Mail, Shield, Trash2, MapPin, Calendar, Bell } from 'lucide-react';

export default function GardenBookSupportPage() {
  const faqs = [
    {
      question: "Does GardenBook store my data online?",
      answer: "No. GardenBook is designed with privacy as a priority. All your garden data, photos, and plans are stored locally on your device. We do not have servers and we cannot access your data.",
      icon: <Shield className="text-brand" size={18} />
    },
    {
      question: "How do I delete my data?",
      answer: "Since all data is stored locally, deleting the GardenBook app from your iPhone or iPad will permanently remove all data associated with the app.",
      icon: <Trash2 className="text-brand" size={18} />
    },
    {
      question: "What permissions does GardenBook use?",
      answer: (
        <ul className="mt-2 space-y-2">
          <li className="flex gap-2">
            <MapPin size={14} className="mt-1 shrink-0 text-muted" />
            <span><strong>Location:</strong> Optional. Used to automatically fill in your city and state during garden setup for weather and zone information.</span>
          </li>
          <li className="flex gap-2">
            <Calendar size={14} className="mt-1 shrink-0 text-muted" />
            <span><strong>Calendar:</strong> Optional. Used if you want to add planting or harvest dates to your system calendar.</span>
          </li>
          <li className="flex gap-2">
            <Bell size={14} className="mt-1 shrink-0 text-muted" />
            <span><strong>Reminders:</strong> Optional. Used if you want the app to create tasks in your iOS Reminders app for tasks like "Water the tomatoes."</span>
          </li>
        </ul>
      ),
      icon: <Bell className="text-brand" size={18} />
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg text-text">
        <div className="mx-auto max-w-3xl px-4 pb-24 pt-20">
          
          {/* Header */}
          <div className="mb-12 border-b border-line pb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">App Support</p>
            <h1 className="mt-2 text-4xl font-bold text-text">GardenBook Support</h1>
            <p className="mt-4 text-lg text-muted leading-relaxed">
              GardenBook is a local garden planning app for iPhone and iPad. 
              I built it to be a simple, private tool for managing your home garden.
              If you have a question or need help, reach out below.
            </p>
          </div>

          {/* Contact Section */}
          <section className="mb-16 rounded-2xl border border-line bg-card p-8">
            <h2 className="text-xl font-bold text-text mb-4">Contact Support</h2>
            <p className="text-muted mb-6">
              The fastest way to get help is to send me an email directly. 
              I'm a solo developer and I'll do my best to get back to you within 48 hours.
            </p>
            <a
              href="mailto:me@garrettschumacher.com"
              className="inline-flex items-center gap-3 rounded-xl bg-brand/10 border border-brand/30 px-6 py-4 text-brand transition-all hover:bg-brand/20"
            >
              <Mail size={20} />
              <span className="font-semibold">me@garrettschumacher.com</span>
            </a>
          </section>

          {/* FAQ Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-text mb-8">Frequently Asked Questions</h2>
            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <div key={index} className="group">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-lg bg-surface p-2 group-hover:bg-brand/10 transition-colors">
                      {faq.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text mb-2">{faq.question}</h3>
                      <div className="text-muted leading-relaxed">{faq.answer}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Legal Footer */}
          <div className="mt-24 pt-8 border-t border-line text-sm text-muted flex flex-wrap gap-6">
            <a href="/apps/privacy-policy" className="hover:text-brand transition-colors underline underline-offset-4">
              Privacy Policy
            </a>
            <a href="/" className="hover:text-brand transition-colors underline underline-offset-4">
              Back to garrettschumacher.com
            </a>
          </div>

        </div>
      </main>
    </>
  );
}
