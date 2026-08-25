import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, address, panels, sunshineHours } = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // --- Dynamic Calculations ---
    // Assume average modern panel is 400 Watts
    const systemSizeKW = (panels * 400) / 1000;
    
    // Rough heuristic: Recommend 1 standard battery (e.g., 13.5 kWh) per 5-7 kW of system size
    const recommendedBatteries = Math.max(1, Math.round(systemSizeKW / 6));
    const estimatedDailyProduction = Math.round((systemSizeKW * sunshineHours) / 365);

    // Dynamic Google Maps Satellite Image of their roof
    const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=19&size=600x300&maptype=satellite&key=${apiKey}`;

    const { data, error } = await resend.emails.send({
      from: 'SentiSolar <onboarding@resend.dev>',
      to: email,
      subject: 'Your Custom Roof Report from SentiSolar',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a202c; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          
          <img src="${mapImageUrl}" alt="Satellite view of ${address}" style="width: 100%; height: auto; display: block; border-bottom: 1px solid #e2e8f0;" />
          
          <div style="padding: 30px;">
            <h1 style="color: #0f172a; margin-top: 0; font-size: 24px;">Your Solar Potential</h1>
            <p>Hi there,</p>
            <p>Thank you for requesting a solar evaluation for <strong>${address}</strong>.</p>
            
            <div style="background-color: #f8fafc; padding: 24px; border-radius: 8px; margin: 24px 0; border: 1px solid #e2e8f0;">
              <h3 style="margin-top: 0; color: #0f172a; font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em;">Roof Analysis Results</h3>
              <ul style="line-height: 2; margin-bottom: 0; padding-left: 20px;">
                <li><strong>Maximum Panel Capacity:</strong> ${panels} panels</li>
                <li><strong>Usable Sunlight:</strong> ${sunshineHours} hours/year</li>
                <li><strong>Estimated System Size:</strong> ${systemSizeKW.toFixed(1)} kW</li>
                <li><strong>Avg Daily Production:</strong> ${estimatedDailyProduction} kWh / day</li>
              </ul>
            </div>

            <div style="background-color: #f0fdf4; padding: 24px; border-radius: 8px; margin: 24px 0; border: 1px solid #bbf7d0;">
              <h3 style="margin-top: 0; color: #166534; font-size: 16px;">Battery Recommendation</h3>
              <p style="margin-bottom: 0; color: #15803d; line-height: 1.6;">
                Based on your roof's massive ${systemSizeKW.toFixed(1)} kW capacity, we recommend installing <strong>${recommendedBatteries} home battery unit${recommendedBatteries > 1 ? 's' : ''}</strong> (e.g., Tesla Powerwall or Enphase 5P) to store your excess daytime production for overnight usage and grid-outage protection.
              </p>
            </div>

            <p>Our team will review this data and reach out shortly with a formalized quote.</p>
            <p>Best,<br><strong>The SentiSolar Team</strong></p>
          </div>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Resend Error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
