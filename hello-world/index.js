const { default: RuntimeClientFactory, TraceType } = require("@voiceflow/runtime-client-js");
const config = require("./config.json");

// Quick and dirty way to overcome certificates check. In production, you should be generating 
// certificates instead.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// Construct a new Voiceflow app instance
const factory = new RuntimeClientFactory(config);
const app = factory.createClient();

// Add some listeners to process the data in the app response
app.on(TraceType.SPEAK, (trace) => console.log(trace.payload.message));

(async () => {
    // Start the conversation session and get the initial app response (OPTIONAL).
    await app.start();

    // Feed in some user input and get the app's response
    await app.sendText("Next");
})();
