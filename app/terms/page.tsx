import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6 text-navy">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      <p className="mb-4">Last Updated: August 28, 2026</p>
      
      <h2 className="text-xl font-semibold mt-8 mb-4">1. SMS Messaging Program</h2>
      <p className="mb-4">By checking the consent box on our website, you agree to receive automated AI voice calls and SMS text messages from SentiSolar. These messages include updates about your solar roof report and qualification status.</p>
      
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Message Frequency:</strong> Message frequency varies based on your interaction with our AI advisor.</li>
        <li><strong>Cost:</strong> Message and data rates may apply.</li>
        <li><strong>Opt-Out:</strong> You can cancel the SMS service at any time. Just text "STOP". After you send the SMS message "STOP" to us, we will send you an SMS message to confirm that you have been unsubscribed.</li>
        <li><strong>Help:</strong> If you are experiencing issues with the messaging program you can reply with the keyword "HELP" for more assistance.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-4">2. Use of Service</h2>
      <p className="mb-4">Our service provides estimates based on Google Solar API LIDAR data. Actual solar production and financial savings may vary.</p>

      <h2 className="text-xl font-semibold mt-8 mb-4">3. Contact</h2>
      <p className="mb-4">For support, email us at support@sentisolar.com.</p>
    </div>
  );
}
