const { rtggClient } = require('rtgg.js');
const { FormData } = require('formdata-node');
const Timeout = require('await-timeout');

const Race = require('./Race.js');

/**
 * Main class for the bot
 */
module.exports = class Bot {
    /**
     * Private properties only accessed internally
     */
    #id;
    #secret;
    #token;
    #mainTimeout;
    #tokenTimeout;

    constructor(options) {
        this.#id = options.clientId;
        this.#secret = options.clientSecret;
        this.#token;
        this.#mainTimeout = new Timeout();
        this.#tokenTimeout = new Timeout();

        /**
         * API is access to all public endpoints of racetime.gg (documentation: https://github.com/slashinfty/rtgg.js/blob/main/docs/classes/rtggClient.md)
         * Races is an array of races being monitored (as WebSocket connections)
         */
        this.api = new rtggClient();
        this.category = options.category;
        this.races = [];
    }

    /**
     * Private function that regenerates the access token prior to expiring
     */
    async #regenerateToken() {
        // Set up request
        const body = new FormData();
        body.set('client_id', this.#id);
        body.set('client_secret', this.#secret);
        body.set('grant_type', 'client_credentials');
        // Get the token
        const response = await fetch('https://racetime.gg/o/token', {
            method: 'post',
            body: body
        });
        const data = await response.json();
        // Set the token and schedule the next token grab
        this.#token = data.access_token;
        await this.#tokenTimeout.set(data.expires_in * 500);
        this.#regenerateToken();
    }

    /**
     * Private function to find new races
     */
    async #findRaces() {
        // Get all open and ongoing races
        const races = await this.api.races();
        console.log(new Date(Date.now()));
        // Filter based on category and if an existing connection already exists
        const newRaces = races.filter(race => race.category.slug === this.category && this.races.find(existingRace => existingRace.name === race.name) === undefined);
        // Connect to any new races
        newRaces.forEach(race => this.races.push(new Race(race.name, `wss://racetime.gg/ws/o/bot/${race.name.split(/(?<=.)\//)[1]}?token=${this.#token}`)));
        await this.#mainTimeout.set(30000);
        this.#findRaces();
    }

    /**
     * Function that generates an access token and looks for new races every 30 seconds
     */
    async initialize() {
        this.#regenerateToken();
        this.#findRaces();
    }

    /**
     * Function to cease bot activity, including closing active WebSocket connections
     */
    async destroy() {
        this.#mainTimeout.clear();
        this.#tokenTimeout.clear();
        this.races.forEach(race => race.close());
    }

    /**
     * Create a new race room and connect to it
     * The object passed as a parameter should have all form data listed here: https://github.com/racetimeGG/racetime-app/wiki/Category-bots#start-and-edit-races
     */
    async createRace(options) {
        // Set up request
        const body = new FormData();
        for (const key in options) {
            body.set(key, options[key]);
        }
        const response = await fetch(`https://racetime.gg/o/${this.category}/startrace`, {
            method: 'post',
            headers: {
                "Authorization": `Bearer ${this.#token}`
            },
            body: body
        });
        // If there's a problem with the submission
        if (response.status === 422) {
            throw 'Unprocessable Entity';
        }
        // Connect to the new race
        const raceName = response.headers.get('location');
        this.races.push(new Race(raceName.split(/^\//)[1], `wss://racetime.gg/ws/o/bot/${raceName.split(/(?<=.)\//)[1]}?token=${this.#token}`));
    }
}