const { default: RuntimeClientFactory, TraceType } = require("@voiceflow/runtime-client-js");
const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config.json");

const app = express();

app.use(bodyParser.json());

const runtimeClientFactory = new RuntimeClientFactory(config);

// this should be replaced with a real database like MongoDB
const mockDatabase = {};
const db = {
    read: async (userID) => mockDatabase[userID],
    insert: async (userID, state) => mockDatabase[userID] = state,
    delete: async (userID) => delete mockDatabase[userID]
};

// Quick and dirty way to elide certificates check. This should be replaced by a proper certificate in production.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// handler for requests to our chatbot
app.post("/:userID", async (req, res) => {
    const { userID } = req.params;
    const { userInput } = req.body;

    // pull the current conversation session of the user from our DB
    const state = await db.read(userID);

    // if `state` is `undefined` then allocate a new client
    const client = runtimeClientFactory.createClient(state); 

    // send the next user request
    const context = await client.sendText(userInput)

    // check if we need to cleanup the conversation session or update the db with the latest state
    if (context.isEnding()) {
        db.delete(userID);
    } else {
        await db.insert(userID, context.toJSON().state);
    }

    // send the traces
    res.send(context.getTrace()
        .filter(({ type }) => type === TraceType.SPEAK)
        .map(({ payload }) => payload.message));
});

const PORT = 12121;
app.listen(PORT, () => console.log(`App starting on PORT ${PORT}`));
