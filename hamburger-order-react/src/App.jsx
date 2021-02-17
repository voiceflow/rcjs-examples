import React from "react";
import RuntimeClient from "@voiceflow/runtime-client-js";
import config from "./config.json"

function App() {
  const [isEnd, setIsEnd] = React.useState(true);   // track whether the conversation has ended
  const [traces, setTraces] = React.useState([]);   // stores the current response from the VF app
  const ref = React.useRef(null);

  // Create a `RuntimeClient` instance to connect with your Voiceflow app.
  const chatbot = React.useMemo(() => new RuntimeClient(config), []);

  // Main workhorse logic
  const handleSend = React.useCallback(async () => {
    // Get the user's response to the VF app's dialogue
    const userInput = ref.current.value;

    // Call an Interaction method to start a conversation or advance a conversation based on user input.
    const context = isEnd ? await chatbot.start() : await chatbot.sendText(userInput);
  
    // Store the results of the interaction and then add the data in your JSX to render the response.
    setTraces(context.getResponse());
    setIsEnd(context.isEnding());
  }, [chatbot, isEnd])

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
