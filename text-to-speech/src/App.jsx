import React from 'react';
import RuntimeClient from "@voiceflow/runtime-client-js";
import config from "../config.json"

function App() {
  const chatbot = React.useMemo(() => new RuntimeClient({
    ...config,
    dataConfig: {
      tts: true
    }
  }), []);

  const [isConvoOver, setConvoOver] = React.useState(true);
  const [traces, setTraces] = React.useState([]);
  const inputRef = React.useRef(null);

  const setContext = React.useCallback((context) => {
    setTraces(context.getResponse());
    setConvoOver(context.isEnding());
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

  const createOnPlayAudio = React.useCallback((audioSrc) => {
    return () => {
      const audio = new Audio(audioSrc);
      audio.play();
    }
  }, [])

  return (
    <div>
      <label>Input:</label><input type="text" ref={inputRef}></input>
      <button onClick={onInteract}>{ isConvoOver ? 'Start' : 'Send' }</button>
      <h2>Dialogue</h2>
      <ul>
        {
          traces.map(({ payload: { message, src }}) => (
            <button 
              onClick={createOnPlayAudio(src)}
              style={{ display: 'block' }}
            >
                {message}
            </button> 
          ))
        }
      </ul>
    </div>
  );
}

export default App;
