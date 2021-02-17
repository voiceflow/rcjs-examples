# Hamburger Order
Hamburger Order is a command-line interface (CLI) written in Node which uses `runtime-client-js` to interact with a Voiceflow app named "Voiceflow Burgers" for ordering hamburgers.

Use `node index.js` to start the application.

## Usage

After starting the CLI with `node index.js`, the CLI will begin a conversation with the Voiceflow app whose `versionID` was provided to the `RuntimeClient` constructor. When the `>>>` prompt appears, you can enter text to advance the conversation session. 

When the CLI asks you "What would you like to order today?", you can respond with any phrase similar to the following:

- I would like a `{size}`
- I would like a `{burger}`
- I would like a `{size}` `{burger}`

Where `{size}` can be "small" or "large", `{burger}` can be "hamburger" or "cheeseburger". 

Voiceflow General Projects are powered by an NLP/NLU engine, so instead of saying the above phrases, you could use any response that has the same meaning, but different phrasing. For example, you can say, "I want to order a hamburger" or "a cheeseburger please."

General Projects also support Dialog Management. We require that the user provides both a value for `{size}` and `{burger}`, and so, the VF app will prompt the user to fill in that missing information. For example, if the size is missing, the user is can respond with something like "large", "a small would be nice", or "I'm feeling a large today"

An example output illustrating CLI usage is shown below:

```bash
$ node index.js

>>> Beginning conversation flow...
Welcome to Voiceflow Burgers
What would you like to order today?

>>> I would like a cheeseburger

>>> The app responded with...
The size is missing, please specify the size.

>>> small

>>> The app responded with...
You have ordered a small cheeseburger 
Would you like to order something else?

>>> yes

>>> The app responded with...
Welcome to Voiceflow Burgers
What would you like to order today?

>>> I would like a hamburger

>>> The app responded with...
The size is missing, please specify the size.

>>> large

>>> The app responded with...
You have ordered a large hamburger 
Would you like to order something else?

>>> no

>>> Conversation has ended. Would you like to start again? [y/n]: n

>>> Closing the app
$
```

## Explanation

### Initializing the Application

In `chatbot.js`, we instantiate a `RuntimeClient`, which you can think of as an instance of our Voiceflow Burgers VF app. We pass in a `config` object in to the constructor containing our settings for the app. 

```js
const RuntimeClient = require("@voiceflow/runtime-client-js").default;
const { displayTraces } = require("./frontend");
const config = require("./config.json");

const app = new RuntimeClient(config);
```

We import the `config` object from a `./config.json` file with the below shape:

```json
{
    "versionID": "6022adee3c078f001c878cae",
}
```

The `versionID` is a unique identifier for a project you've built on Voiceflow, so passing this value into the `RuntimeClient` lets the SDK know which specific Voiceflow app you want to start a conversation with.

### Starting the Conversation

To start a conversation with the Voiceflow Burgers app, you call `app.start()`, then access the app's response or **traces** using `context.getResponse()`. We do this in the `startInteraction()` method. Here, we perform the `.start()` call then pass the result, `context.getResponse()`, into our frontend, `displayTraces()`.

```js
const startInteraction = async () => {
    const context = await app.start();

    displayTraces('>>> Beginning conversation flow...', context.getResponse());
};
```

The `displayTraces()` function is a helper for displaying pieces or **traces** of the app's entire response. We iterate through each of the `.traces` using `.forEach()`, then access the string containing the "actual" dialogue in `trace.payload.message` and display it on the terminal.

```js
const displayTraces = (header, traces) => {
    console.log();
    console.log(header);
    traces.forEach(trace => {
        console.log(trace.payload.message);
    });
    console.log();
    process.stdout.write('>>> ');
};
```

The above code is what produces the initial output shown below

```bash
>>> Beginning conversation flow...
Welcome to Voiceflow Burgers
What would you like to order today?

>>>
```

### Advancing the Conversation

To advance the conversation, we call `app.sendText()` with the user's input. When the VF app's response arrives, we process the traces like we did above. Then, we check if the conversation session has ended using `context.isEnding()`.

We do all of this in `continueInteraction()` found in `chatbot.js`. Notice how the logic is roughly similar to the `startInteraction()` method: interact with the app with `.sendText()`, get the traces with `.getResponse()`, and display the traces with `displayTraces()`. This is the common pattern for using a `RuntimeClient` instance.

Note, however, we also return `context.isEnding()` to check if the conversation session has ended in some later code. 

```js
const continueInteraction = async (userInput) => {
    const context = await app.sendText(userInput);
    const traces = context.getResponse();

    if (traces.length) {
        displayTraces(`>>> The app responded with...`, traces);
    } 

    return context.isEnding();
}
```

The above code is what produces the following output:

```
>>> I would like a cheeseburger

>>> The app responded with...
The size is missing, please specify the size.

>>> 
```

**NOTE:** We can also check `context.isEnding()` after a call to `.start()`, but in the design of the Voiceflow Burgers app, we know for sure that we don't immediately terminate when we start up a conversation (you can open up the Voiceflow Burgers project on Voiceflow to confirm this). Therefore, `context.isEnding()` is always `false` after a `.start()` call, so we don't really *need* to include this unnecessary check after `.start()`.

The `context.isEnding()` function returns a boolean indicating if the current conversation has ended or not. After this is returned by `continueInteraction()`, we check the value at `index.js`, shown below:

To explain the below code, we are attaching a handler that is run when the user enters text through standard input. When user `textInput` comes in, we send the input into the `continueInteraction()` function we discussed earlier to advance the conversation. This handler is how user input is forwarded to the chatbot.

```js
const displayPrompt = () => {
    console.log();
    process.stdout.write('>>> Conversation has ended. Would you like to start again? [y/n]: ');
}

const stdin = process.openStdin();
stdin.addListener("data", async (data) => {
    const textInput = data.toString().trim();

    if (!isEnding) {
        isEnding = await continueInteraction(textInput);
        if (isEnding) displayPrompt(); 
        return 
    }

    if (textInput === 'y') {
        await resetConversationSession();
    } else {
        displayEnd();
        process.exit();
    }
});
```

Once `continueInteraction()` returns, we can check if the conversation has ended or not, then we assign this state to `isEnding`. Immediately after we assign to `isEnding`, we need to check if should call `displayPrompt()` to display a message asking if the user wants to restart the conversation.

If `isEnding` is `false`, then the conversation is ongoing, so the `"data"` handler should return and await the user's next response from standard input.

If `isEnding` is `true`, then the conversation has ended and so we should call `displayPrompt()`. Thus, the next time the `"data"` handler is triggered, we decide if we terminate or restart the conversation.

### Terminating and Restarting the Conversation

When the previous invocation of the `"data"` handler set `isEnding` to `true`, the current invocation needs to decide whether to close the app or restart it. Recall that the previous invocation prints the following message out to console

```
>>> Conversation has ended. Would you like to start again? [y/n]: 
```

Then, the current invocation expects to receive a string with value `"y"` or not. If `"y"` is received, then the `resetConversationSession()` method is called to restart the CLI from the beginning. Otherwise, if any other input is received, the CLI interprets this as a "No" and terminates the app with a `process.exit()` call, as shown below.

```js
stdin.addListener("data", async (data) => {
    const textInput = data.toString().trim();
  
  	// as before...

    if (textInput === 'y') {
        await resetConversationSession();
    } else {
        displayEnd();
        process.exit();
    }
});
```

Note, the `RuntimeClient` does not have any resources like active socket connections that need to be cleaned up. There is no explicit action on your end needed to terminate and cleanup the `RuntimeClient`. 

To restart a conversation, simply call `.start()` whenever you need to. For example, in the CLI, we define a function called `resetConversationSession()` to restart the CLI app by calling `startInteraction()`. Recall that `startInteraction()` function executes the `.start()` method of the `RuntimeClient`. 

```js
const resetConversationSession = async () => {
    await startInteraction();
    isEnding = false;
}
```
