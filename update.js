const fs = require('fs');
const file = 'app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("import Autocomplete from 'react-google-autocomplete'", "import Autocomplete from 'react-google-autocomplete'\nimport { useConversation } from '@elevenlabs/react'");

content = content.replace("const [listening, setListening] = useState(false)", "const conversation = useConversation({\n  onConnect: () => console.log('ElevenLabs connected'),\n  onDisconnect: () => console.log('ElevenLabs disconnected'),\n  onError: (e) => console.error('ElevenLabs error:', e)\n})");

const oldOnClick = "onClick={() => { setListening(!listening); setTimeout(() => setListening(false), 2200) }}";
const newOnClick = "onClick={async () => {\n  if (conversation.status === 'connected') {\n    await conversation.endSession()\n  } else {\n    try {\n      await navigator.mediaDevices.getUserMedia({ audio: true })\n      await conversation.startSession({ agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || '' })\n    } catch (err) { console.error('ElevenLabs start failed', err) }\n  }\n}}";
content = content.replace(oldOnClick, newOnClick);

content = content.replace(/listening \?/g, "conversation.status === 'connected' ?");
content = content.replace(/\{listening \? /g, "{conversation.status === 'connected' ? ");

const oldLabel = '{listening && <p className="mt-3 text-[11px] font-medium text-solar">Listening via ElevenLabs...</p>}';
const newLabel = '{conversation.status === \\'connecting\\' && <p className="mt-3 text-[11px] font-medium text-solar animate-pulse">Connecting to Agent...</p>}\n                {conversation.status === \\'connected\\' && <p className="mt-3 text-[11px] font-medium text-solar">Listening... (Speak now!)</p>}';
content = content.replace(oldLabel, newLabel);

fs.writeFileSync(file, content, 'utf8');
