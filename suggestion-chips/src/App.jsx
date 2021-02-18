import React from 'react';
import RuntimeClientFactory from "@voiceflow/runtime-client-js";
import config from "./config.json"

function App() {
  const chatbot = React.useMemo(() => {
    const factory = new RuntimeClientFactory(config);
    return factory.createClient();
  }, []);

  const [isConvoOver, setConvoOver] = React.useState(true);
  const [traces, setTraces] = React.useState([]);
  const [chips, setChips] = React.useState([]);
  const inputRef = React.useRef(null);

  const setContext = React.useCallback((context) => {
    setTraces(context.getResponse());
    setConvoOver(context.isEnding());
    setChips(context.getChips());
  }, []);

  const clearUI = React.useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [inputRef]);

  const onInteract = React.useCallback(async () => {
    const context = isConvoOver 
      ? await chatbot.start()
      : await chatbot.sendText(inputRef.current.value ?? '');
    
    setContext(context);
    clearUI();
  }, [chatbot, inputRef, isConvoOver, setContext, clearUI]);

  const createChipsCallback = React.useCallback((suggestion) => {
    return async () => {
      const context = await chatbot.sendText(suggestion);
      setContext(context);
      clearUI();
    };
  }, [clearUI, chatbot, setContext])

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
