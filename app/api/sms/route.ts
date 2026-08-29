import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const incomingMsg = formData.get('Body');
    const fromNumber = formData.get('From');
    
    if (!incomingMsg) {
      return new NextResponse('<Response></Response>', { status: 400, headers: { 'Content-Type': 'text/xml' } });
    }

    const systemPrompt = You are Elise, a National Solar Advisor for SentiSolar. 
Your goal is to soft-qualify homeowners for -down Power Purchase Agreements (PPAs) or Cash/Loan solar options. 
Keep your texts extremely brief, conversational, and human-like (1 to 2 short sentences max). You are texting, not writing emails. Do not use hashtags, robotic formatting, or bullet points. Act like a real person texting from a phone.
Qualifying criteria to gather naturally over the chat:
1. Are they the homeowner?
2. Is their electric bill over /mo?
3. Is their credit score roughly 650 or higher?
If they object to PPA and want to buy cash/loan, enthusiastically agree. 
Once they meet all criteria, tell them a Senior Advisor will call them shortly.;

    // Fetch reply from OpenAI
    const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': Bearer 
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: incomingMsg.toString() }
        ],
        max_tokens: 100,
        temperature: 0.7
      })
    });

    const openAiData = await openAiRes.json();
    
    let replyText = "Sorry, I'm having trouble connecting right now.";
    if (openAiData.choices && openAiData.choices.length > 0) {
        replyText = openAiData.choices[0].message.content.trim();
    }

    // Generate TwiML response for Twilio
    const twiml = <?xml version="1.0" encoding="UTF-8"?><Response><Message></Message></Response>;
    
    return new NextResponse(twiml, {
      status: 200,
      headers: { 'Content-Type': 'text/xml' }
    });
  } catch (error) {
    console.error("SMS Error:", error);
    return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response><Message>Sorry, our system is temporarily down.</Message></Response>', { status: 500, headers: { 'Content-Type': 'text/xml' } });
  }
}
