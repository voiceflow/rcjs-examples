import React from 'react';
import RuntimeClientFactory, { TraceEvent, TraceType } from "@voiceflow/runtime-client-js";
import config from "./config.json"

function App() {
  const [isConvoOver, setConvoOver] = React.useState(true);
  const [traces, setTraces] = React.useState([]);
  const [chips, setChips] = React.useState([]);
  const inputRef = React.useRef(null);

  // Construct the chatbot
  const chatbot = React.useMemo(() => {
    const factory = new RuntimeClientFactory(config);
    const chatbot = factory.createClient();

    // Handler runs when RuntimeClient receives response from Runtime servers
    chatbot.on(TraceEvent.BEFORE_PROCESSING, context => {
      setConvoOver(context.isEnding());
      setChips(context.getChips());
    });

    // Handler runs when RuntimeClient is processing a SpeakTrace in the response
    chatbot.on(TraceType.SPEAK, trace => {
      setTraces(prevTraces => [...prevTraces, trace]);
    });

    return chatbot;
  }, []);

  // Used to clear the input field and the previous response bubbles
  const clearUI = React.useCallback(() => {
    if (inputRef.current) inputRef.current.value = '';
    setTraces([]);
  }, [inputRef]);

  // Main workhorse function that runs all associated logic for sending a request
  const getResponse = React.useCallback(async (userInput) => {
    clearUI();
    return chatbot.sendText(userInput);
  }, [chatbot, clearUI]);

  // Handler for Send/Start button
  const onInteract = React.useCallback(async () => {
    await getResponse(inputRef.current.value ?? '');
  }, [getResponse, inputRef]);

  // Handler for suggestion chip buttons
  const createChipsCallback = React.useCallback((suggestion) => {
    return async () => await getResponse(suggestion);
  }, [getResponse])

  return (
    <div>
      <label>Input:</label><input type="text" ref={inputRef}></input>
      <button onClick={onInteract}>{ isConvoOver ? 'Start' : 'Send' }</button>
      <h2>Dialogue</h2>
      <ul>
        {
          traces.map(({ payload: { message }}) => <li>{message}</li> )
        }
      </ul>
      {
        !!chips.length && (
          <div>
            <h2>Suggestions</h2>
            {chips.map(({ name }) => <button onClick={createChipsCallback(name)}>{name}</button>)}
          </div>
        )
      }
    </div>
  );
}

export default App;
