const RuntimeClient = require("@voiceflow/runtime-client-js").default;
const { displayTraces } = require("./frontend");
const config = require("./config.json");

const app = new RuntimeClient(config);

const startInteraction = async () => {
    const context = await app.start();

    displayTraces('>>> Beginning conversation flow...', context.getResponse());
};

const continueInteraction = async (userInput) => {
    const context = await app.sendText(userInput);
    const traces = context.getResponse();

    if (traces.length) {
        displayTraces(`>>> The app responded with...`, traces);
    } 

    return context.isEnding();
}

module.exports = {
    startInteraction,
    continueInteraction
}