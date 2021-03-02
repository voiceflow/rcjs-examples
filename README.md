# Runtime Client JS Examples
This is a mega-repo where you can find various examples demonstrating the functionality of the Voiceflow Runtime Client SDK. React is used in some examples, however, the SDK is **framework-agnostic**, so the concepts can apply to other frameworks or libraries such as Angular, Vue, or even jQuery.

## Setup

First, clone this repo, then to setup any example, follow the below steps:

1. `cd sample` where `sample` is folder name of the sample you want to try out.
2. Find the `.vf` file in `/sample`, e.g, the `hello-world` folder has a `hello-world.vf` file. This file contains a ready-made Voiceflow project which will be integrated with the JavaScript code.
3. Follow the instructions [here](https://github.com/voiceflow/runtime-client-js/blob/master/docs/setting-up-vf-app.md) to import the `.vf` file into Voiceflow and to obtain the `VERSION_ID` and API keys.
4. In each sample folder, there is a `config.json` template provided. Paste the `VERSION_ID` and API keys you copied earlier into the attributes, as described below

```js
{
    "versionID": "679812r0fb3husergfde", // replace this with your VERSION_ID
    "apiKey" : "VF.62002nffjeUFWQDUu39.hv342wUoqw81234jnswJ231siq" // replace with your apiKey
}
```

5. Run `yarn` to install any necessary dependencies.
6. Depending on the project, you can start the project with `node index.js` or `yarn start`. Check the README.md in the individual samples' folders for any additional setup instructions specific to that project.



## Contributing

Feel free to contribute any sample you feel would be helpful for the user. Please ensure to do the following:

1. Create a `config.json` file that is loaded into the `RuntimeClientFactory` constructor (if possible).
2. Create a `.vf` file for that sample.
3. Write a README.md for the sample explaining any unusual setup, usage, or code in your sample.