# rcjs-hello-world
A simple Hello World example illustrating the runtime-client-js

## Setup

1. Clone the repository and open the repo

2. Upload the `rcjs-hello-world/HelloWorld.vf` project to Voiceflow. See 
[here](https://docs.voiceflow.com/#/platform/project-creation/project-creation?id=project-creation) and click the "Import a .vf file" tab for instructions how to do this.

3. Open the imported Hello World project on Voicefow

4. Open the Test view by clicking the "Test" button on the top-right

<p align="center">
	<img width="552"  alt="Image of the Test Button on Voiceflow" src="https://user-images.githubusercontent.com/32404412/107269101-17bd3500-6a17-11eb-86b1-b0a817022aca.png">
</p>	

5. Click "Train Assistant" on the Test view sidebar to train the assistant's NLU/NLP capabilities

<p align="center">
	<img width="300" alt="Image of the Training Panel on Voiceflow" src="https://user-images.githubusercontent.com/32404412/107269251-5521c280-6a17-11eb-9d82-5a0f62bff14d.png">
</p>	

6. Inside the Hello World project, on your browser address bar, you should see a URL of the form `https://creator.voiceflow.com/project/VERSION_ID/canvas/OTHER_ID`. Copy the `VERSION_ID`. 

<p align="center">
    <img width="823" alt="Screen Shot 2021-02-09 at 10 44 56 AM" src="https://user-images.githubusercontent.com/32404412/107388450-dd5da180-6ac3-11eb-8cba-78ff4b5b9f23.png" style="zoom:50%" >
</p>

7. In `rcjs-hello-world/`, create a `config.json` with the following attributes. For the `"versionID"` attribute, the value should be the `VERSION_ID` you copied earlier.
```js
{
    "versionID": "6022adee3c078f001c878cae", // replace this with your VERSION_ID
}
```

8. Run the Hello World code using `node index.js`
