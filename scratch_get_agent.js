const apiKey = 'sk_9ad92292a8a8724a61b3addd3ef007542296d5b783cb07dc';
const agentId = 'agent_0901m0nw3030e8j8qmr5r664mxcs';

async function getAgent() {
  const res = await fetch(\https://api.elevenlabs.io/v1/convai/agents/\\, {
    headers: { 'xi-api-key': apiKey }
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
getAgent();
