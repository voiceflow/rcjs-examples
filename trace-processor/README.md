# Trace Processor

This sample is meant to show off the `makeTraceProcessor `utility for the Runtime Client. To run this project, finish the setup described by the README in `rcjs-examples`, then call `node index.js`.

## Usage

There is no additional action on your part required aftter starting the project. This script will automatically contact the VF app for you and run the trace processor function on the response.

## Explanation

### Setup
First, the `RuntimeClientFactory` is configured so that the `.getResponse()` method of a `Context` returns only speak-type traces by default. The `makeTraceProcessor` utility is only really useful if you've enabled other trace types besides "speak." To return other trace types from `.getResponse()`, we must enable this by passing in an array of trace types into `includeTypes`. Here we enable debug, block, and flow traces.

We also pass in a `globalTraceProcessor`, which is a "trace processor" function. We'll explain what it does and how to create one shortly.

```js
const rcfactory = new RuntimeClientFactory({
    ...config,
    dataConfig: {
        includeTypes: ['speak', 'debug', 'block', 'flow'],
        traceProcessor: globalTraceProcessor
    }
});
const app = rcfactory.createClient();
```

### Global Trace Processor
To create the `globalTraceProcessor`, we invoke the `makeTraceProcessor` utility and pass in a handler map. The handler map is an object whose keys are the names of trace types and whose values are handlers for that trace type. 

The utility will return a function that accept a `GeneralTrace`, determine the trace type, and then invoke the handler you defined for that type. For a complete description of all of the trace types and handler signatures, see the API reference.

**Note:** If `globalTraceProcessor` receives a trace type that wasn't given an explicit handler, then the `globalTraceProcessor` throws an exception. Make sure the trace that you pass into `globalTraceProcessor` is of a trace type that you expect.

```js
const globalTraceProcessor = makeTraceProcessor({
    speak: (message) => printGlobal(`SPEAK: ${message}`),
    debug: (message) => printGlobal(`DEBUG: ${message}`),
    block: (blockId) => printGlobal(`BLOCK: Entering block ${blockId}`),
    flow: (diagramID) => printGlobal(`FLOW: Entering ${diagramID}`)
});
```

Since we passed `globalTraceProcessor` into the `RuntimeClientFactory` constructor earlier, this makes it so that the `globalTraceProcessor` is **automatically** called every time you invoke an interaction method, like `.start()` or `.sendText()` on a `RuntimeClient` instance.

Hence, every time an interaction method is being called, you can imagine a `.forEach()` call is made afterwards, as shown below:
```js
const context = await app.start();
context.getResponse().forEach(globalTraceProcessor);    // this call is implicit
```

This is why the `.start()` call in `index.js` triggers the `globalTraceProcessor`.

### Local Trace Processor
In the event where you might not want to call a trace processor immediately when a response is received, you can always invoke the trace processor explicitly in your own code. 

To do this, we can define a separate local trace processor

```js
const localTraceProcessor = makeTraceProcessor({
    speak: (message) => makeLocalString(`SPEAK: ${message}`),
    debug: (message) => makeLocalString(`DEBUG: ${message}`),
    block: (blockId) => makeLocalString(`BLOCK: Entering block ${blockId}`),
    flow: (diagramID) => makeLocalString(`FLOW: Entering ${diagramID}`)
});
```

Then, we can simply invoke `.getResponse()` method to retrieve the traces and manually call a higher-order function ourselves. Note that this method offers a bit more flexibility, since we can choose to use a function such as `.map()` instead of `.forEach()`.

```js
    console.log(">>> Running the local trace processor");
    const traces = response.getResponse();
    const mappedTraces = traces.map(localTraceProcessor);
    console.log(mappedTraces);
```
