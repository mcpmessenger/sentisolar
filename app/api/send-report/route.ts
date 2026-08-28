import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, address, panels, sunshineHours } = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // --- Dynamic Calculations ---
    const systemSizeKW = (panels * 400) / 1000;
    const recommendedBatteries = Math.max(1, Math.round(systemSizeKW / 6));
    const estimatedDailyProduction = Math.round((systemSizeKW * sunshineHours) / 365);

    // Dynamic Google Maps Satellite Image of their roof
    const mapImageUrl = https://maps.googleapis.com/maps/api/staticmap?center=\&zoom=19&size=600x300&maptype=satellite&key=\;

    const { data, error } = await resend.emails.send({
      from: 'SentiSolar <onboarding@resend.dev>',
      to: email,
      subject: 'Great news: Your SentiSolar Roof Report & PPA Qualification',
      html: 
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a202c; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          
          <img src="" alt="Satellite view of " style="width: 100%; height: auto; display: block; border-bottom: 1px solid #e2e8f0;" />
          
          <div style="padding: 30px;">
            <h1 style="color: #0f172a; margin-top: 0; font-size: 24px;">Your Solar Potential</h1>
            <p>Hi there,</p>
            <p>Thank you for requesting an AI solar evaluation for <strong>\</strong>.</p>
            <p>We have processed your roof's LIDAR topology, and we have great news: your home has excellent solar exposure.</p>
            
            <div style="background-color: #fffbeb; padding: 24px; border-radius: 8px; margin: 24px 0; border: 1px solid #fde68a;">
              <h3 style="margin-top: 0; color: #92400e; font-size: 16px;">?? Preliminary PPA Qualification</h3>
              <p style="margin-bottom: 0; color: #b45309; line-height: 1.6;">
                Based on your roof's capacity, your home is a prime candidate for a <strong>-Down Power Purchase Agreement (PPA)</strong>. 
                <br><br>
                Instead of paying tens of thousands of dollars to buy solar panels, a PPA allows you to simply buy the cheaper, cleaner electricity the panels generate. You lock in a predictable rate, protect your family against utility price gouging, and our partners handle 100% of the installation, monitoring, and maintenance for free.
              </p>
            </div>

            <div style="background-color: #f8fafc; padding: 24px; border-radius: 8px; margin: 24px 0; border: 1px solid #e2e8f0;">
              <h3 style="margin-top: 0; color: #0f172a; font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em;">Roof Analysis Results</h3>
              <ul style="line-height: 2; margin-bottom: 0; padding-left: 20px;">
                <li><strong>Maximum Panel Capacity:</strong> \ panels</li>
                <li><strong>Usable Sunlight:</strong> \ hours/year</li>
                <li><strong>Estimated System Size:</strong> \ kW</li>
                <li><strong>Avg Daily Production:</strong> \ kWh / day</li>
              </ul>
            </div>

            <p style="font-weight: bold;">What happens next?</p>
            <p>A Senior Solar Advisor will be calling you shortly from a local area code to review your current utility bill and finalize your -down qualification.</p>
            <p>Best,<br><strong>The SentiSolar Team</strong></p>
          </div>
        </div>
      ,
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
