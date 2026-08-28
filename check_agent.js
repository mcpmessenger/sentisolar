const apiKey = 'sk_9ad92292a8a8724a61b3addd3ef007542296d5b783cb07dc';
const agentId = 'agent_0901m0nw3030e8j8qmr5r664mxcs';
async function checkAgent() {
  const res = await fetch('https://api.elevenlabs.io/v1/convai/agents/' + agentId, {
    headers: { 'xi-api-key': apiKey }
  });
  const agent = await res.json();
  console.log("PROMPT HAS PHONE:", agent.conversation_config.agent.prompt.prompt.includes("phone number"));
  const tool = agent.conversation_config.agent.prompt.tools.find(t => t.name === 'generate_solar_report');
  console.log("TOOL HAS PHONE:", tool.parameters.required.includes("phone"));
}
checkAgent();
