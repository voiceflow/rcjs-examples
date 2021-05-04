import React from "react";
import RuntimeClientFactory, { TraceType, TraceEvent } from "@voiceflow/runtime-client-js";
import config from "./config.json"

function App() {
  // The UI state
  const [isEnd, setIsEnd] = React.useState(true);   // track whether the conversation has ended
  const [traces, setTraces] = React.useState([]);   // stores the current response from the VF app
  const ref = React.useRef(null);

  const chatbot = React.useMemo(() => {
    // Constructing a `RuntimeClient` instance named `chatbot`
    const factory = new RuntimeClientFactory({...config, dataConfig: { stopTypes: ["custom"] }});
    const chatbot = factory.createClient();

    // Handler runs before we start processing traces received from the Runtime server response
    chatbot.on(TraceEvent.BEFORE_PROCESSING, (context) => {
      setIsEnd(context.isEnding());
      setTraces([]);
    });

    chatbot.onResponse((trace) => {
      console.log('onresponse trace', trace);
      if (trace.payload.data.name === 'custom') {
        console.log("v1 trace", trace);
        return 1;
      }
    })

    // Handler runs when the Runtime Client iterates over a SpeakTrace in the Runtime server response
    chatbot.on(TraceType.SPEAK, (trace) => setTraces(prevTraces => [...prevTraces, trace]));

    return chatbot;
  }, []);

  const handleSend = React.useCallback(async () => {
    // Get the user's response to the VF app's dialogue
    const userInput = ref.current.value;

    // Call an Interaction Method to advance the conversation based on `userInput`.
    await chatbot.sendText(userInput);
  }, [chatbot])

  return (
    <>
      <input ref={ref} type="text" placeholder="Enter your response..." />
      <button type="button" onClick={handleSend}>{isEnd ? 'Start' : 'Send'}</button>
      <ul>
        {
          traces.map(trace => <li>{trace.payload.message}</li>) // displays the VF App response
        }
      </ul>
    </>
  );
}

export default App;
