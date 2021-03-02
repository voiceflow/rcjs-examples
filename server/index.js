const { default: RuntimeClientFactory, TraceType } = require("@voiceflow/runtime-client-js");
const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config.json");

// Quick and dirty way to elide certificates check. This should be replaced by a proper certificate in production.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Standard Express app setup
const app = express();
app.use(bodyParser.json());

// This should be replaced with a real database like MongoDB
const mockDatabase = {};
const db = {
    read: async (userID) => mockDatabase[userID],
    insert: async (userID, state) => mockDatabase[userID] = state,
    delete: async (userID) => delete mockDatabase[userID]
};

// Instantiate a global `runtimeClientFactory` service for your entire backend.
const runtimeClientFactory = new RuntimeClientFactory(config);

// Handler for requests to our chatbot
app.post("/:userID", async (req, res) => {
    const { userID } = req.params;
    const { userInput } = req.body;

    // Pull the current conversation session for the user from our DB. If this session doesn't exist
    // then `state` is `undefined`
    const state = await db.read(userID);

    // If `state` is `undefined` then `.createClient()` creates a new state. Otherwise, construct a
    // `RuntimeClient` that wraps the pre-existing `state`
    const client = runtimeClientFactory.createClient(state); 

    // Use the `userInput` to advance the conversation session
    const context = await client.sendText(userInput)

    // Check if the conversation session has ended or not, then, delete or update the DB copy of the 
    // conversation session, respectively.
    if (context.isEnding()) {
        db.delete(userID);
    } else {
        await db.insert(userID, context.toJSON().state);
    }

    // Respond with the traces
    res.send(context.getTrace()
        .filter(({ type }) => type === TraceType.SPEAK)
        .map(({ payload }) => payload.message));
});

const PORT = 12121;
app.listen(PORT, () => console.log(`App starting on PORT ${PORT}`));
