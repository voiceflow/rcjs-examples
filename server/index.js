const RuntimeClientFactory = require("@voiceflow/runtime-client-js").default;
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

// handler for requests to our chatbot
app.post("/:userID", async (req, res) => {
    const { userID } = req.params;
    const { userInput } = req.body;

    // pull the current conversation session of the user from our DB
    const state = await db.read(userID);
    const firstInteraction = !state;

    // if `state` is `undefined` then allocate a new client
    const client = runtimeClientFactory.createClient(state); 

    // send the next user request
    const context = firstInteraction ? await client.start() : await client.sendText(userInput)

    // check if we need to cleanup the conversation session
    if (context.isEnding()) {
        db.delete(userID);
    } else {
        await db.insert(userID, context.toJSON().state);
    }

    // send the traces
    res.send(context.getResponse());
});

const PORT = 12121;
app.listen(PORT, () => console.log(`App starting on PORT ${PORT}`));
