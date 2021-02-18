const RuntimeClientFactory = require("@voiceflow/runtime-client-js").default;
const { displayTraces } = require("./frontend");
const config = require("./config.json");

const factory = new RuntimeClientFactory(config);
const app = factory.createClient();

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