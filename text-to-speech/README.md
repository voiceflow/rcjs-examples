# Text-to-Speech Sample

This sample demonstrates the text-to-speech (TTS) functionality that is available on the Runtime Client. 

To start the project, use `yarn start`

## Usage

This sample is similar to the "Hamburger Order React" sample. However, the VF app's responses are displayed as buttons. You can click these buttons to play the audio file that is included with the traces in the response.

## Explanation

The Runtime Client can request that our servers synthesize the Voiceflow app's response text into a playable audio file. To enable this, simply set the `tts` option in `RuntimeClientFactory` to `true` (see `App.jsx`).

```js
const chatbot = React.useMemo(() => {
  const rcfactory = new RuntimeClientFactory({
    ...config,
    dataConfig: {
      tts: true
    }
  });
  return rcfactory.createClient();
}, []);
```

When `tts` is enabled to be true, the `SpeakTrace`s returned by the `RuntimeClient` will contain an additional `src` property, which is the URL of the TTS audio-file. You can access the `src` property through `trace.payload.src`, as shown below:

```ts
// METHOD 1 - Awaiting context
const context = await chatbot.sendText("Some user input");

context.getTrace().forEach(trace => {
  if (trace.type === TraceType.AUDIO) {
    playAudio(trace.payload.src);
  }
});

// METHOD 2 - Events-system
chatbot.on(TraceType.AUDIO, trace => playAudio(trace.payload.src));
```



### Asynchronous Playback

If you played with the sample, you'll notice that we play each response's audio one at a time, with enough time for the audio to finish. We are not playing a single audio-file, but in fact, coordinating several smaller audio-files to play in sequence. The `RuntimeClient`'s **event-system** makes this easy to setup. 

Whenever you call an interaction method of `RuntimeClient` and the client receives a list of traces (representing the response from our servers) then the event-system iterates through the list and fires `TraceType.XYZ` event whenever it encounters an `XYZTrace`. A useful property of this system, is that a trace is processed, only if all previous traces were processed.

You can exploit the **ordering** of `TraceType` events by defining an `async` handler that sleeps for however long the audio-file is. The next trace will not processed until the `async` handler of the current trace awakens. This gives sufficient time for the current audio-file to finish.

```js
    chatbot.on(TraceType.SPEAK, async (trace) => {
      // Add the current trace to the list of responses
      setTraces(prevTraces => [...prevTraces, trace])

      // Extract the audio file URL
      const { src } = trace.payload;

      // Play the TTS audio
      const audio = new Audio(src);
      audio.play();

      // Wait until the HTMLAudioElement loads the audio-file's length - This is a browser-specific quirk
      await new Promise(res => audio.onloadedmetadata = () => res() );

      // Now wait until the audio has finished
      await new Promise(res => setTimeout(res, audio.duration * 1000));
      
      // When the last Promise resolves, the async handler will return and we move onto the next
      // trace to play its audio-file.
    }, [])
```



### Audio Buttons

In this sample, we display the response text not as text nodes, but as buttons. 

To implement click handlers for the buttons, we need to create a **handler factory** which accepts an audio-file and creates a click handler which will play that audio-file. We can pass the handlers constructed by the callback factory into each of the UI buttons.

We define `createOnPlayAudio` to be our handler factory and it accepts an `audioSrc`, where `audioSrc` is a filepath to some audio file. This function returns a click event handler.

```js
  const createOnPlayAudio = React.useCallback((audioSrc) => {
    return () => {
      const audio = new Audio(audioSrc);
      audio.play();
    }
  }, [])
```

The below React code iterates through the `traces` received by the `RuntimeClient`, and for each trace, renders a `<button>` to the webpage. Inside the `<button>`, we've displayed the response text using `{message}`. 

Most importantly, we invoke the handler factory to construct a unique click handler for each button. Each button's click handler triggers the correct audio-file that corresponds to the button's text.

```jsx
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
```



