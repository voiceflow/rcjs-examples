# Server Sample

This sample demonstrates how to use `runtime-client-js` on the backend and invoking the interaction methods in a request handler.

To start the project, use `node index.js`

## Usage

This sample creates a server on `https://localhost:12121`. To communicate with the `RuntimeClient`, you need to make a `POST` request to `/:userID`. The request body should include a `userInput` attribute which contains the user's response.

```json
{
    "userInput": "I would like a cheeseburger"
}
```

The server will respond with the traces making up th Voiceflow app's repsonse.

## Explanation

The main implementation being showcased is found within the Express route handler below.

For best practices, we shouldn't persist the `RuntimeClient` object itself between requests, otherwise, this leads to thousands or even millions of `RuntimeClient` objects, depending on how popular your service is.

A better approach is to take advantage of the optional `state` argument in `runtimeClientFacory.createClient(state)`. Whenever we finish servicing a request, we first export the VF app `State` using `context.toJSON().state`, then we save this `State` into our database, e.g, MongoDB.

When a new request from the same user comes in, we read the user's last conversation session state from the database and load it into a `RuntimeClient` by calling `.createClient(state)`. This allows us to regenerate the chatbot at the state where it left off. Then, we can interact with the chatbot, passing in any user input to advance the conversation as normal.

```js
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
```
