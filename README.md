# racetime-bot
A Node.js library to help you create chat bots for racetime.gg 

## Purpose

The racetime application allows categories to set up their own bots, which can interact with ongoing races in order to supply information and similar actions.

This library provides a basic template for creating these bots.

## Setup

#### Requirements

* Node >= 17.5

#### Installation

Initialize a Node.js project (with `npm init`), then, in the directory, run `npx racetime-bot`.

Your `package.json` file will be updated with required dependencies (which will be installed), and a folder named `src` (or `_src` if `src` already exists) will be created, and three files will be added (`index.js`, `Bot.js`, and `Race.js`).

## Getting Started

You should read the racetime-app documentation on [Category bots](https://github.com/racetimeGG/racetime-app/wiki/Category-bots) to understand what you need to get started. You don't need a thorough understanding of the technical side of things to build your own bot, but it is helpful to be able to understand how messages are structured, and how they are used.

Explore the newly created files, as there are comments to help you customize the bot's behavior.

## Contributing

If you have something you wish to contribute, feel free to submit a pull request on this repo. You can also talk on our #dev Discord channel following the link at the top of this page.

## Special Thanks

Inspired by the Python [racetime-bot](https://github.com/racetimeGG/racetime-bot) library.