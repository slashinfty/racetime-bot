const randomString = require('randomized-string');
const WebSocket = require('ws');

/**
 * Class for connecting to races via WebSocket
 */
module.exports = class Race {
    /**
     * Private properties only accessed internally
     */
    #connection;

    constructor(name, url) {
        this.name = name;
        this.#connection = new WebSocket(url);
        this.reconnected = false;

        /**
         * The self constant allows class functions to be called within this.#connection events listeners
         */
        const self = this;

        /**
         * Function for when connection is opened
         * Can be completely rewritten or omitted
         */
        this.#connection.onopen = () => {
            console.log(`connection to ${this.name} established`);
        }

        /**
         * Function for when connection is closed
         * Can be completely rewritten or omitted
         */
         this.#connection.onclose = () => {
            console.log(`connection to ${this.name} terminated`);
        }

        /**
         * Function for when the race room sends a message
         * This is the primary function of the bot
         */
        this.#connection.onmessage = (message) => {
            /**
             * Extracts the data of the message
             * The different message types are explained here: https://github.com/racetimeGG/racetime-app/wiki/Category-bots#receiving-messages
             */
            const data = JSON.parse(message.data);
            /**
             * Continue here
             * You will likely want to do different things based on data.type
             * To send a message to the WebSocket, use self.sendMessage()
             * Use self.reconnected to determine if this is the first time connecting to a race
             */
        }
    }

    /**
     * Function to send messages to the WebSocket
     * If sending a message action, this function will automatically generate a random string for the guid property
     */
    sendMessage(action, data = undefined) {
        if (data === undefined) {
            this.#connection.send(JSON.stringify({'action': action}));
        } else {
            if (action === 'message') {
                data = {...data, 'guid': randomString.generate()};
            }
            this.#connection.send(JSON.stringify({'action': action, 'data': data}));
        }
    }

    /**
     * Function to reconnect to the WebSocket
     */
    reconnect(url) {
        this.#connection.close();
        this.#connection = new WebSocket(url);
        this.reconnected = true;
    }

    /**
     * Function to close the WebSocket connection
     */
    close() {
        this.#connection.close();
    }
}