const displayTraces = (header, traces) => {
    console.log();
    console.log(header);
    traces.forEach(trace => {
        console.log(trace.payload.message);
    });
    console.log();
    process.stdout.write('>>> ');
};

const displayPrompt = () => {
    console.log();
    process.stdout.write('>>> Conversation has ended. Would you like to start again? [y/n]: ');
}

const displayEnd = () => {
    console.log();
    console.log('>>> Closing the app');
}

module.exports = {
    displayTraces,
    displayPrompt,
    displayEnd
}