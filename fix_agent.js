const apiKey = 'sk_9ad92292a8a8724a61b3addd3ef007542296d5b783cb07dc';
const agentId = 'agent_0901m0nw3030e8j8qmr5r664mxcs';

async function fixAgent() {
  const res = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
    headers: { 'xi-api-key': apiKey }
  });
  const agent = await res.json();
  
  const newTool = {
    type: "client",
    name: "generate_solar_report",
    description: "Evaluates the user's roof using Google Solar API and emails them a custom solar report.",
    parameters: {
      type: "object",
      properties: {
        address: { type: "string", description: "The full home address provided by the user" },
        email: { type: "string", description: "The email address to send the report to" }
      },
      required: ["address", "email"]
    }
  };

  if (!agent.conversation_config.agent.prompt.tools) {
    agent.conversation_config.agent.prompt.tools = [];
  }
  agent.conversation_config.agent.prompt.tools = agent.conversation_config.agent.prompt.tools.filter(t => t.name !== 'generate_solar_report');
  agent.conversation_config.agent.prompt.tools.push(newTool);

  const patchRes = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
    method: 'PATCH',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversation_config: agent.conversation_config })
  });
  console.log("Fixed:", patchRes.ok);
}
fixAgent();
