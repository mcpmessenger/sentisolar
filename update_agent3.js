const apiKey = 'sk_9ad92292a8a8724a61b3addd3ef007542296d5b783cb07dc';
const agentId = 'agent_0901m0nw3030e8j8qmr5r664mxcs';
async function updateAgent() {
  const patchRes = await fetch('https://api.elevenlabs.io/v1/convai/agents/' + agentId, {
    method: 'PATCH',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conversation_config: {
        agent: {
          prompt: {
            prompt: "You are Senti, a forward-thinking, service-oriented solar advisor. Your objective is to soft-qualify New Jersey homeowners for a $0-down Power Purchase Agreement (PPA).\n\nCORE GUIDELINES:\n1. Persona & Tone: Be consultative and helpful, never pushy. You are an expert advisor.\n2. The Objective: Navigate the conversation naturally to collect their email, phone number, and confirm three things: that they own the home, their electric bill is over $100, and their credit score is roughly 650 or higher.\n3. Objection Handling: When a homeowner resists, do not argue. First, validate their concern gracefully. Second, isolate the objection. Third, use a solution-selling approach by framing the $0-down PPA as a tool to solve their specific pain points (like utility rate hikes or the grid monopoly).\n4. The Reclose: After overcoming an objection, seamlessly pivot back to the qualification process by asking a low-friction question.\n\nCRITICAL RULE: NEVER call the generate_solar_report tool unless you have explicitly collected their street address, city, state, email, phone number, AND asked the 3 qualification questions (homeowner, monthly bill, and credit score).",
            tools: [
              {
                type: "client",
                name: "generate_solar_report",
                description: "Evaluates the user's roof using Google Solar API and emails them a custom solar report.",
                parameters: {
                  type: "object",
                  properties: {
                    address: { type: "string", description: "The full home address provided by the user (street, city, state)" },
                    email: { type: "string", description: "The email address to send the report to" },
                    phone: { type: "string", description: "The user's phone number" },
                    is_homeowner: { type: "boolean", description: "True if the user confirmed they own the home" },
                    monthly_bill: { type: "integer", description: "The user's approximate monthly electric bill amount" },
                    credit_qualified: { type: "boolean", description: "True if the user confirmed their credit score is roughly 650 or higher" }
                  },
                  required: ["address", "email", "phone", "is_homeowner", "monthly_bill", "credit_qualified"]
                }
              }
            ]
          }
        }
      }
    })
  });
  console.log("Agent Patched:", patchRes.ok);
}
updateAgent();
