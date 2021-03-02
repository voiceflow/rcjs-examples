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

    chatbot.on(TraceType.SPEAK, async (trace) => {
      // Update the user interface with the new responses
      setTraces(prevTraces => [...prevTraces, trace])

      // Extract the audio file
      const { src } = trace.payload;

      // Play the TTS file
      const audio = new Audio(src);
      audio.play();

      // Wait until the HTMLAudioElement loads the audio-file's length - This is important otherwise
      // audio.duration might end up being `undefined` in the next line.
      await new Promise(res => audio.onloadedmetadata = () => res() );

      // Now wait until the audio-file has finished playing
      await new Promise(res => setTimeout(res, audio.duration * 1000));
    }, [])

    return chatbot;
  }, []);

  const clearUI = React.useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [inputRef]);

  const onInteract = React.useCallback(async () => {
    const userInput = inputRef.current.value ?? '';
    clearUI();
    setTraces([]);
    await chatbot.sendText(userInput);
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
