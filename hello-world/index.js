const RuntimeClient = require("@voiceflow/runtime-client-js").default;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // $TODO - Remove this

// Construct a new Voiceflow app instance
const app = new RuntimeClient({
    versionID: 'XXXXXXXXXXXXXXXXXXXXXXXXX'
});

(async () => {
    // Start the conversation session and get the initial app response
    const response1 = await app.start();
    const traces1 = response1.getResponse();

    // Output the app's response
    traces1.forEach(trace => {
        console.log(trace.payload.message);
    });

    // Feed in some user input and get the app's response
    const response2 = await app.sendText("Next");
    const traces2 = response2.getResponse();

    // Output the app's response
    traces2.forEach(trace => {
        console.log(trace.payload.message);
    });

    // After .start() or .sendText(), check if the conversation session has ended or not.
    console.log(`conversationEnded=${response2.isEnding()}`);
})();
