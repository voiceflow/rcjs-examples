# Hamburger Order React Sample

## Running the Sample

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). You can run the project using `yarn start`

## Usage

When you open the app using `yarn start`, you will see a mostly empty webpage with a single input field and a button. 

<img width="338" alt="Screen Shot 2021-02-17 at 11 32 07 AM" src="https://user-images.githubusercontent.com/32404412/108235466-d530e200-7113-11eb-9a18-2068e4b6759f.png">

When the button says "Start", you can click it to begin a conversation session. You are allowed to type any user input before you hit Start, but that input will be ignored for the initial interaction. 

The input value will be sent to the chatbot (the `RuntimeClient` instance), which in turn, makes a request to a Voiceflow runtime server. When a response is received, each trace will be displayed as a list item, as shown below:

<img width="308" alt="Screen Shot 2021-02-17 at 9 58 53 AM" src="https://user-images.githubusercontent.com/32404412/108235150-926f0a00-7113-11eb-883a-642e2edd4d4a.png">

When the button says "Send", you should first enter your response in the input field, then hit "Send" to advance the conversation. The `RuntimeClient` will again contact our servers and get the VF app's response. When it arrives, the response will be displayed on the webpage.

If the button text goes back to "Start", then the current conversation session has ended. Pressing "Start" will begin a new conversation session and you can follow these instructions again from the top.

## Explanation

This is a minimal working example that demonstrates how to use the Voiceflow Runtime Client on a React project. 

