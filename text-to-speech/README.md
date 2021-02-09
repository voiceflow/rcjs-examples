# Text-to-Speech Sample

This sample demonstrates the text-to-speech (TTS) functionality that is available on the Runtime Client. 

To start the project, use `yarn start`

## Explanation

The Runtime Client can request that our servers synthesize the Voiceflow app's response text into a playable audio file. To enable this, simply set the `tts` option in `RuntimeClient` to `true` (see `App.jsx`).

```js
  const chatbot = React.useMemo(() => new RuntimeClient({
    ...config,
    dataConfig: {
      tts: true
    }
  }), []);
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

We hook this callback up to some buttons in React. If you aren't familiar with React, don't worry. Basically, this code creates a number of buttons and binds the handler created by the `createOnPlayAudio` function to the `"click"` event of the `<button>`. Thus, clicking the suggestion buttons will trigger the click handler and play the audio file `src`. 

But what is `src`? The `traces` variable below is the return value of `context.getResponse()`. Since we have not specified an `includeTypes`, the `.getResponse()` method only returns speak-type traces, which contain a TTS audio file. For each speak `trace`, we can access the TTS audio file through `trace.payload.src`. So we pass this in to `createOnPlayAudio` as `src`.

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
