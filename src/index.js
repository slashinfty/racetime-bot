const Bot = require('./Bot.js');

/**
 * Client ID and secret can be obtained from the Bots section of the Manage Category page
 * Category is the URL extension
 * Example: if the URL is https://racetime.gg/sml2, then sml2 would be input as the category
 */
const botInstance = new Bot({
    clientId: '',
    clientSecret: '',
    category: ''
});

/**
 * Start the bot
 */
botInstance.initialize();