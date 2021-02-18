# Text-to-Speech Sample

This sample demonstrates the text-to-speech (TTS) functionality that is available on the Runtime Client. 

To start the project, use `yarn start`

## Usage

This sample is similar to the "Hamburger Order React" sample. However, the VF app's responses are displayed as buttons. You can click these buttons to play the audio file that is included with the traces in the repsponse.

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

We define a quick-and-dirty and audio player function called `createOnPlayAudio` which accepts an `audioSrc`, where `audioSrc` is a filepath to some audio file. This function creates a `onClick` handler, which we will use to play the audio files returned by the Runtime Client.

```js
  const createOnPlayAudio = React.useCallback((audioSrc) => {
    return () => {
      const audio = new Audio(audioSrc);
      audio.play();
    }
  }, [])
```

We hook this callback up to some buttons in React. If you aren't familiar with React, don't worry. Basically, this code creates a number of buttons and binds the handler created by the `createOnPlayAudio` function to the `"click"` event of the `<button>`. Clicking the suggestion buttons will trigger the click handler and play the audio file `src`. 

Now, what is `src`? Take a look at the `traces` variable below, which is the return value of `context.getResponse()`. The `.getResponse()` method is currently configured to return speak-type traces, which contain a TTS audio filename. For each speak `trace`, we can access the audio filename through `trace.payload.src`. We pass this filename into `createOnPlayAudio` as `src`.

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
