const apiKey = 'sk_9ad92292a8a8724a61b3addd3ef007542296d5b783cb07dc';
const agentId = 'agent_0901m0nw3030e8j8qmr5r664mxcs';

async function updateAgent() {
  const res = await fetch('https://api.elevenlabs.io/v1/convai/agents/' + agentId, {
    headers: { 'xi-api-key': apiKey }
  });
  const agent = await res.json();
  
  // 1. Update the System Prompt
  agent.conversation_config.agent.prompt.prompt = "You are Senti, a solar AI agent. Your goal is to pre-qualify New Jersey homeowners for a $0-down Power Purchase Agreement (PPA) program. Tell them that they can replace their current high utility bill with cheaper, cleaner solar energy for zero dollars out of pocket.\n\nTo run their report, you need three things: their full address, their email, and their phone number.\n\nCRITICAL RULE: NEVER call the generate_solar_report tool unless you explicitly have their street number, street name, city, state, email, AND phone number. If they are missing any of those, politely ask them for the missing information so you can send them their customized $0-down PPA qualification report.";

  // 2. Update the Tool Parameters to require Phone Number
  const newTool = {
    type: "client",
    name: "generate_solar_report",
    description: "Evaluates the user's roof using Google Solar API and emails them a custom solar report.",
    parameters: {
      type: "object",
      properties: {
        address: { type: "string", description: "The full home address provided by the user (street, city, state)" },
        email: { type: "string", description: "The email address to send the report to" },
        phone: { type: "string", description: "The user's phone number" }
      },
      required: ["address", "email", "phone"]
    }
  };

  agent.conversation_config.agent.prompt.tools = agent.conversation_config.agent.prompt.tools.filter(t => t.name !== 'generate_solar_report');
  agent.conversation_config.agent.prompt.tools.push(newTool);

  const patchRes = await fetch('https://api.elevenlabs.io/v1/convai/agents/' + agentId, {
    method: 'PATCH',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversation_config: agent.conversation_config })
  });
  console.log("Agent Patched:", patchRes.ok);
}
updateAgent();
