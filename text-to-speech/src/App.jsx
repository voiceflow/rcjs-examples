import React from 'react';
import RuntimeClientFactory, { TraceEvent, TraceType } from "@voiceflow/runtime-client-js";
import config from "./config.json"

function App() {
  const [isConvoOver, setConvoOver] = React.useState(true);
  const [traces, setTraces] = React.useState([]);
  const inputRef = React.useRef(null);

  const chatbot = React.useMemo(() => {
    const rcfactory = new RuntimeClientFactory({
      ...config,
      dataConfig: {
        tts: true
      }
    });

    const chatbot = rcfactory.createClient();

    chatbot.on(TraceEvent.BEFORE_PROCESSING, context => setConvoOver(context.isEnding()), []);

    chatbot.on(TraceType.SPEAK, trace => setTraces(prevTraces => [...prevTraces, trace]), [])

    return chatbot;
  }, []);

  const clearUI = React.useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [inputRef]);

  const onInteract = React.useCallback(async () => {
    clearUI();
    await chatbot.sendText(inputRef.current.value ?? '');
  }, [chatbot, inputRef, clearUI]);

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
