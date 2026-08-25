const apiKey = 'sk_9ad92292a8a8724a61b3addd3ef007542296d5b783cb07dc';
const agentId = 'agent_0901m0nw3030e8j8qmr5r664mxcs';

async function updateAgent() {
  try {
    // 1. Fetch current agent
    const res = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
      headers: { 'xi-api-key': apiKey }
    });
    
    if (!res.ok) {
        throw new Error("Failed to fetch agent: " + await res.text());
    }
    
    const agent = await res.json();
    console.log("Current conversation config:", JSON.stringify(agent.conversation_config, null, 2));

    // 2. Prepare the new tool
    const newTool = {
      type: "client",
      name: "generate_solar_report",
      description: "Evaluates the user's roof using Google Solar API and emails them a custom solar report.",
      parameters: {
        type: "object",
        properties: {
          address: {
            type: "string",
            description: "The full home address provided by the user"
          },
          email: {
            type: "string",
            description: "The email address to send the report to"
          }
        },
        required: ["address", "email"]
      }
    };

    // Ensure agent.conversation_config.tools exists
    if (!agent.conversation_config) agent.conversation_config = {};
    if (!agent.conversation_config.tools) agent.conversation_config.tools = [];

    // Remove it if it already exists, then add the fresh one
    agent.conversation_config.tools = agent.conversation_config.tools.filter(t => t.name !== 'generate_solar_report');
    agent.conversation_config.tools.push(newTool);

    // 3. Patch the agent
    // Note: The ElevenLabs API often requires passing the specific config object being updated
    const patchRes = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
      method: 'PATCH',
      headers: { 
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversation_config: agent.conversation_config
      })
    });

    if (!patchRes.ok) {
      throw new Error("Failed to patch agent: " + await patchRes.text());
    }

    console.log("Successfully updated the agent with the tool!");

  } catch (error) {
    console.error("Error:", error.message);
  }
}

updateAgent();
