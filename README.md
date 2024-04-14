# react-interview-q1

## Developer notes:

* I converted the project to typescript for better type safety and to improve my own usage in professional environments using TS but outside of renaming the file to .ts and adding types to the functions, the core functionality of the mock-api was left as implemented as directed.
* However, the above point causes some issues. Since the timeout for the mock-api is encapsulated in a promise, there is no access to cancel the timeout and therefore this application can easily run into race conditions. In a production environment, this would be resolved by creating an abortController to a fetch call that can be used to cancel any previous lookups to the api.
* A debounce call could/should be added to the text input to prevent spamming of fetch calls on every button press.
* Validation "icons" were added to notify the user of completed fields or fields that are fetching data from the server.
* Buttons are hidden or disabled depending on the context of the user.
* Colors are mostly neutral and more time could be spent creating a more thematic experience.
* Max width was set on the container to prevent form fields from stretching too far on wide screens and making content less readable so that the field input remains responsive on nearly any display size.
* Ideally the state logic for this could could be moved to its own hook using a useReducer to manage all state changes.


## Instructions

Fork this repo first into your own github account. Make sure to thoroughly read the instructions and implement the react component to meet the provided requirements. Send back a link to your cloned repo. You are expected to make implementation choices around customer experience and efficiency. Please make sure to explain your choices in comments.

## Requirements

Please build the following form component
![form component mock](./mock.png)

* Name input should be validated using the provided mock API to check whether the chosen name is taken or not.
* Name input should be validated as the user is typing.
* Location dropdown options should be fetched using the provided mock API.
* Component should have a responsive layout
* Component should be appropriately styled
* Unit tests are not required
