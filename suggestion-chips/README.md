# Suggestion Chips Sample

This sample demonstrates the Suggestion Chips functionality that is available on the Runtime Client. 

To start the project, use `yarn start`

## Explanation

Voiceflow General Projects implement Natural Language Processing (NLP) and Natural Language Functionality (NLU) functionality to enable intelligent detection of user intents. The NLP/NLU modules can perform intent matching, but also return suggested responses to trigger intents that it's expecting next. \

You can use these suggestion strings to implement user interface "chips", which can be clicked by the user to automatically send the suggestion as their response.

The suggestion chips functionality requires no additional setup. Simply call the `context.getChips()` method to get a list of the suggestion data.

```js
const context = await app.sendText(userInput);
const chips = context.getChips();
console.log(chips);

/*
[
  { name: "I'm feeling a cheeseburger  today" },
  { name: ""I'd like a hamburger  please" },
  { name: "A cheeseburger  please" }
]
*/
```

To use these suggestions, simply pass in the suggestion value into an interaction method like `.sendText()`, as you would with "normal" user input.

```js
const suggestion = chips[0].name;
const context = await chatbot.sendText(suggestion);
```
