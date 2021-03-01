# Runtime Client JS Examples
This is a mega-repo where you can find various examples demonstrating the functionality of the Voiceflow Runtime Client SDK. React is used in some examples, however, the SDK is **framework-agnostic**, so the concepts can apply to other frameworks or libraries such as Angular, Vue, or even jQuery.

## Setup

First, clone this repo.

To setup any example, follow the below steps.

1. `cd sample` where `sample` is folder name of the sample you want to try out.

2. Find the `.vf` file in `/sample`, e.g, the `hello-world` folder has a `hello-world.vf` file. This file contains a ready-made Voiceflow project which will be integrated with the JavaScript code.

3. Upload the `.vf` file to [Voiceflow](https://creator.voiceflow.com) to import the project. See [here](https://docs.voiceflow.com/#/platform/project-creation/project-creation?id=project-creation) and click the "Import a .vf file" tab for instructions on how to do this.

4. In the browser address bar of the workspace you uploaded the `.vf` file to, you should see a URL of the form `https://creator.voiceflow.com/workspace/WORKSPACE_ID`. Append `/api-keys` to the end of this and you will be taken to a screen where you can create an API key for the workspace. Click on `Create New API Key`, give it a name, and save it somewhere as you will need it for later.

<p align="center">
	<img width="552"  alt="Image of the Test Button on Voiceflow" src="https://user-images.githubusercontent.com/32006038/109540734-e2918900-7a90-11eb-84d6-99cd613d81cc.png">
</p>

5. Open the imported project on Voiceflow

<p align="center">
	<img width="552"  alt="Image of the Test Button on Voiceflow" src="https://user-images.githubusercontent.com/32404412/107429772-4cea8580-6af2-11eb-87bd-a30f171b0ae3.png">
</p>	

6. Open the Test view by clicking the "Test" button on the top-right. Clicking "Test" will also trigger the project to be uploaded to our servers as an executable program.

<p align="center">
	<img width="552"  alt="Image of the Test Button on Voiceflow" src="https://user-images.githubusercontent.com/32404412/107269101-17bd3500-6a17-11eb-86b1-b0a817022aca.png">
</p>	

7. In the Test View, click "Train Assistant" on the Test view sidebar to train the assistant's NLU/NLP capabilities. **Note**: this is unnecessary for some of the samples, so if you cannot click "Train Assistant" then this means training is not required and you are free to skip this step.

<p align="center">
	<img width="300" alt="Image of the Training Panel on Voiceflow" src="https://user-images.githubusercontent.com/32404412/107269251-5521c280-6a17-11eb-9d82-5a0f62bff14d.png">
</p>	

8. Now, on your browser address bar, you should see a URL of the form `https://creator.voiceflow.com/project/VERSION_ID/canvas/OTHER_ID`. Copy the `VERSION_ID` part of this URL. 

<p align="center">
    <img width="823" alt="Screen Shot 2021-02-09 at 10 44 56 AM" src="https://user-images.githubusercontent.com/32404412/107388450-dd5da180-6ac3-11eb-8cba-78ff4b5b9f23.png" style="zoom:50%" >
</p>


9. In each sample folder, there is a `config.json` template provided. Paste the `VERSION_ID` you copied earlier into the `"versionID"` attribute and paste the API key you generated earlier into the `"apiKey"` attribute to finish integrating the Voiceflow app to the sample.
```js
{
    "versionID": "6022adee3c078f001c878cae", // replace this with your VERSION_ID
    "apiKey": "VF.xxxxxxxx.xxxxxxxx"         // replace this with your API key
}
```

10. Run `yarn` to install any necessary dependencies.

11. Depending on the project, you can start the project with `node index.js` or `yarn start`. Check the README.md in the individual samples' folders for any instructions specific to that project.

## Contributing

Feel free to contribute any sample you feel would be helpful for the user. Please ensure to do the following:

1. Create a `config.json` file that is loaded into the `RuntimeClientFactory` constructor (if possible).
2. Create a `.vf` file for that sample.
3. Write a README.md for the sample explaining any unusual setup, usage, or code in your sample.