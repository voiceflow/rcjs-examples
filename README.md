# Runtime Client JS Examples
This is a mega-repo where you can find various examples demonstrating the functionality of the Voiceflow Runtime Client. React is used in some examples, however, the SDK is **framework-agnostic**, so the concepts can apply to other frameworks or libraries such as Angular, Vue, or even jQuery.

## Setup

First clone this repo.

To setup any example, follow the below steps.

1. `cd sample` where `sample` is folder name of the sample you want to try out.

2. Find the `.vf` file in `/sample`, e.g, the `hello-world` folder has a `HelloWorld.vf` file. This file contains a ready-made Voiceflow project which will be integrated with the JavaScript code.

2. Upload the `.vf` file to Voiceflow to import the project. See 
[here](https://docs.voiceflow.com/#/platform/project-creation/project-creation?id=project-creation) and click the "Import a .vf file" tab for instructions how to do this.

3. Open the imported project on Voiceflow

4. Open the Test view by clicking the "Test" button on the top-right. Click Test will also trigger the project to be uploaded to our servers, where it can be accessed by the sample project.

<p align="center">
	<img width="552"  alt="Image of the Test Button on Voiceflow" src="https://user-images.githubusercontent.com/32404412/107269101-17bd3500-6a17-11eb-86b1-b0a817022aca.png">
</p>	

5. Click "Train Assistant" on the Test view sidebar to train the assistant's NLU/NLP capabilities. Note, this is unnecessary for some projects, so if you cannot click "Train Assistant" then you are free to skip this step.

<p align="center">
	<img width="300" alt="Image of the Training Panel on Voiceflow" src="https://user-images.githubusercontent.com/32404412/107269251-5521c280-6a17-11eb-9d82-5a0f62bff14d.png">
</p>	

6. Inside the Hello World project, on your browser address bar, you should see a URL of the form `https://creator.voiceflow.com/project/VERSION_ID/canvas/OTHER_ID`. Copy the `VERSION_ID`. 

<p align="center">
    <img width="823" alt="Screen Shot 2021-02-09 at 10 44 56 AM" src="https://user-images.githubusercontent.com/32404412/107388450-dd5da180-6ac3-11eb-8cba-78ff4b5b9f23.png" style="zoom:50%" >
</p>

7. In each sample folder, there is a `config.json` template provided. Paste the `VERSION_ID` you copied earlier into the `"versionID"` attribute to finish setup.
```js
{
    "versionID": "6022adee3c078f001c878cae", // replace this with your VERSION_ID
}
```

8. Run the Hello World code using `node index.js`
