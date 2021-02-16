import React from "react";
import RuntimeClient from "@voiceflow/runtime-client-js";

function App() {
  const [isEnd, setIsEnd] = React.useState(true);
  const [traces, setTraces] = React.useState([]);
  const ref = React.useRef(null);

  const chatbot = React.useMemo(() => new RuntimeClient({
    versionID: '602beb117504b8001c22b6ae'
  }), []);

  const handleSend = React.useCallback(async () => {
    const userInput = ref.current.value;
    const context = isEnd ? await chatbot.start() : await chatbot.sendText(userInput);
    setTraces(context.getResponse());
    setIsEnd(context.isEnding());
  }, [chatbot, isEnd])

  return (
    <>
      <input ref={ref} type="text" placeholder="Enter your response..." />
      <button type="button" onClick={handleSend}>{isEnd ? 'Start' : 'Send'}</button>
      <ul>
        {
          traces.map(trace => <li>{trace.payload.message}</li>)
        }
      </ul>
    </>
  );
}

export default App;
