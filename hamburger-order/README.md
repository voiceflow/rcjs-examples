# rcjs-cli
A command-line interface in Node that uses the runtime-client-js to interact with a Voiceflow app for ordering hamburgers.

## Setup

1. Open this repo on your command line

2. Upload the `rcjs-cli/FirstKitchen.vf` file to Voiceflow. This file contains the project data for the "First Kitchen" app for ordering hamburgers. See 
[here](https://docs.voiceflow.com/#/platform/project-creation/project-creation?id=project-creation) and click the "Import a .vf file" tab for instructions how to do this.

3. Open the imported First Kitchen project on Voicefow

4. Open the Test view by clicking the "Test" button on the top-right

<p align="center">
	<img width="552"  alt="Image of the Test Button on Voiceflow" src="https://user-images.githubusercontent.com/32404412/107269101-17bd3500-6a17-11eb-86b1-b0a817022aca.png">
</p>	

5. Click "Train Assistant" on the Test view sidebar to train the assistant's NLU/NLP capabilities

<p align="center">
	<img width="300" alt="Image of the Training Panel on Voiceflow" src="https://user-images.githubusercontent.com/32404412/107269251-5521c280-6a17-11eb-9d82-5a0f62bff14d.png">
</p>	

6. Inside the First Kitchen project, on your browser address bar, you should see a URL of the form `https://creator.voiceflow.com/project/VERSION_ID/canvas/OTHER_ID`. Copy the `VERSION_ID`. 

<p align="center">
    <img width="823" alt="Screen Shot 2021-02-09 at 10 44 56 AM" src="https://user-images.githubusercontent.com/32404412/107388450-dd5da180-6ac3-11eb-8cba-78ff4b5b9f23.png" style="zoom:50%" >
</p>

7. In `rcjs-cli/`, create a `config.json` with the following attributes. For the `"versionID"` attribute, the value should be the `VERSION_ID` you copied earlier.
```js
{
    "versionID": "6022adee3c078f001c878cae", // replace this with your VERSION_ID
}
```

8. Run the CLI wih `node index.js`

## Usage

After starting the CLI with `node index.js`, the CLI with connect with the Voiceflow app we imported using the Runtime Client SDK. When the `>>>` prompt appears, you can enter text to advance the conversation flow. 

An example of usage is shown below:

```bash
$ node index.js

>>> Beginning conversation flow...
Welcome to First Kitchen
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
Welcome to First Kitchen
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

A connection to the Voiceflow app is initialized in `chatbot.js`

```js
const RuntimeClient = require("@voiceflow/runtime-client-js").default;
const { displayTraces } = require("./frontend");
const config = require("./config.json");

const app = new RuntimeClient(config);
```

Here, we instantiate a `RuntimeClient`, which you can think of as an instance of our Voiceflow app for ordering hamburgers.

A `config` object is passed into the `RuntimeClient` for initialization. We imported this object from a `./config.json` file with the following form:

```json
{
    "versionID": "6022adee3c078f001c878cae",
}
```

This JSON object is used to initialize the `RuntimeClient`. In particular, the `versionID` is a unique identifier for a project you've built on Voiceflow, so passing this value into the `RuntimeClient` lets the SDK know which Voiceflow app we want to start a conversation with.

### Starting the Conversation

To start a conversation with the First Kitchen app, we use the `.start()` method, then access the app's response or **traces** using `.getResponse()`

Shown below, we've defined a `startInteraction()` function in `chatbot.js`, which invokes `.start()` to begin a new conversation session with the app, then passes the response into our frontend, the `displayTraces()` function. 

```js
const startInteraction = async () => {
    const context = await app.start();

    displayTraces('>>> Beginning conversation flow...', context.getResponse());
};
```

The `displayTraces()` function is a general function for displaying the pieces, called "traces", of the app's entire response. We iterate through each of the `.traces` using the `.forEach()` method, then access the string containing the "actual" dialogue in `trace.payload.message` and display it on the command line.

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

This code is what produces the initial output shown below

```bash
>>> Beginning conversation flow...
Welcome to First Kitchen
What would you like to order today?

>>>
```

### Advancing the Conversation

To advance the conversation, we need to call `.sendText()` and pass in a string representing the user's response. Then, we process the response traces like we did before. Finally, we need to check if the conversation session has terminated using the `.isEnding()` method.

Below, we defined a `continueInteraction()` function in `chatbot.js`. This is very similar to the `startInteraction()` method, so we won't explain it here. However, note that we return `context.isEnding()`.

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

This code is what produces the following output:

```
>>> I would like a cheeseburger

>>> The app responded with...
The size is missing, please specify the size.

>>> 
```

The `context.isEnding()` function returns a boolean indicating if the current conversation has ended or not. We check this value in `index.js`, shown below.

```js
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

We listen for standard input by attaching a handler for the `"data"` event. When data comes in, we check if the conversation has ended or not, then we assign this state to `isEnding`.

If `isEnding` is `false`, then the conversation is still ongoing, so we return and await the user's response.

If `isEnding` is `true`, then we pass the user input to `continueInteraction()` to advance the conversation. We then check `isEnding` to determine if `displayPrompt()` should be called. The `displayPrompt()` function outputs a message asking the user if they want to restart the conversation from the beginning. 

```js
const displayPrompt = () => {
    console.log();
    process.stdout.write('>>> Conversation has ended. Would you like to start again? [y/n]: ');
}
```

When `isEnding` is set to `true`, the expected input is either: `"y"` to restart the conversation or any other input to end the conversation. Thus, the next time the user enters input, the `"data"` handler will either restart the conversation by calling `resetConversationSession()` or terminate the CLI with `process.exit()`.

Note: Although we didn't check `context.isEnding()` after we called `.start()`, we may have to, if, for example, your Voiceflow app runs from start to finish without prompting for a user input at any point. We left out the `context.isEnding()` after `.start()` because we know the first thing our Voiceflow app does is prompt for user input. 

### Terminating and Restarting the Conversation

The `RuntimeClient` does not have any active connections such as sockets and stores the current execution state locally. There is no explicit action on your end needed to terminate and cleanup the `RuntimeClient`. 

To restart a conversation, simply call `.start()` whenever you need to. In the CLI, we define a function called `resetConversationSession()` to restart the CLI app by calling `startInteraction()`. Recall that `startInteraction()` function simply executes the `.start()` method of the `RuntimeClient`. 

```js
const resetConversationSession = async () => {
    await startInteraction();
    isEnding = false;
}
```
