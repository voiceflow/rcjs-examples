const RuntimeClient = require("@voiceflow/runtime-client-js").default;
const { makeTraceProcessor } = require("@voiceflow/runtime-client-js");
const config = require("./config.json")

const printGlobal = (text) => {
    console.log(`GLOBAL: ${text}`);
};

const makeLocalString = (text) => {
    return `LOCAL: ${text}`;
};

const globalTraceProcessor = makeTraceProcessor({
    speak: (message) => printGlobal(`SPEAK: ${message}`),
    debug: (message) => printGlobal(`DEBUG: ${message}`),
    block: (blockId) => printGlobal(`BLOCK: Entering block ${blockId}`),
    flow: (diagramID) => printGlobal(`FLOW: Entering ${diagramID}`)
});

const localTraceProcessor = makeTraceProcessor({
    speak: (message) => makeLocalString(`SPEAK: ${message}`),
    debug: (message) => makeLocalString(`DEBUG: ${message}`),
    block: (blockId) => makeLocalString(`BLOCK: Entering block ${blockId}`),
    flow: (diagramID) => makeLocalString(`FLOW: Entering ${diagramID}`)
});

// Construct a new Voiceflow app instance
const app = new RuntimeClient({
    ...config,
    dataConfig: {
        includeTypes: ['speak', 'debug', 'block', 'flow'],
        traceProcessor: globalTraceProcessor
    }
});

(async () => {
    // Start the conversation session and get the initial app response
    console.log(">>> Running the global trace processor");
    const response = await app.start();

    console.log(">>> Running the local trace processor");
    const traces = response.getResponse();
    const mappedTraces = traces.map(localTraceProcessor);
    console.log(mappedTraces);
})();
