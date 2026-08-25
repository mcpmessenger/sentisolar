import Link from 'next/link'
import { Sun } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-paper text-navy px-6 py-12 md:px-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity mb-12">
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-navy text-white">
            <Sun className="h-4 w-4 text-solar" strokeWidth={2.3} />
          </div>
          <span className="text-[17px] font-semibold tracking-[-0.04em] text-navy">SentiSolar</span>
        </Link>
        
        <h1 className="text-4xl font-semibold tracking-[-0.04em] mb-4">Privacy Policy & Disclosures</h1>
        <p className="text-muted text-sm mb-12">Last Updated: August 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-navy/80">
          <section>
            <h2 className="text-xl font-medium text-navy mb-3">1. Transparency in AI & Automated Communications</h2>
            <p>SentiSolar utilizes advanced Artificial Intelligence (including ElevenLabs conversational AI) to provide instant solar estimates. By opting into our services, you acknowledge that you may interact with an AI voice agent.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-navy mb-3">2. TCPA Consent & Do Not Call (DNC) Rights</h2>
            <p>When you provide your phone number and submit a request for a solar report, you are providing express written consent to be contacted by SentiSolar and our verified installation partners. This contact may occur via automated dialing systems, AI-generated voice calls, or SMS text messages.</p>
            <p className="mt-3 font-medium text-navy">Important Disclosures:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Your consent to receive automated calls/texts is <strong>not</strong> required as a condition of purchasing any goods or services.</li>
              <li>You may revoke this consent and opt-out at any time by replying 'STOP' to our text messages, or by stating 'Add me to your Do Not Call list' during a voice call.</li>
              <li>Upon receiving an opt-out request, SentiSolar will immediately add your number to our internal Do Not Call (DNC) registry and cease automated communications.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-medium text-navy mb-3">3. Data Collection & Usage</h2>
            <p>We collect your address, email, and phone number solely for the purpose of analyzing your home's solar potential and connecting you with solar solutions. We do not sell your personal data to unverified third-party data brokers.</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-navy mb-3">4. Contact Us</h2>
            <p>If you have any questions about this policy or wish to manually be added to our DNC list, please email: <strong>compliance@sentisolar.com</strong></p>
          </section>
        </div>
      </div>
    </main>
  )
}