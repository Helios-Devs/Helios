// Libraries
import { Client, Guild, Intents } from 'discord.js';
import { ToadScheduler, SimpleIntervalJob, Task } from "toad-scheduler";
import { connect, Mongoose } from "mongoose";
require('dotenv').config()

// Core
import { Command, commands } from './commands';
import { Event, events } from './events/';

// Helpers
import { servers } from "./helpers/server";

// Custom client class
export class customClient extends Client {
	commands: Command[] = commands
	prefix: string = 'h!'
	owners: number[] = [719292655963734056, 778110527892488233]
	db!: Mongoose
	servers = servers
	scheduler = new ToadScheduler()
}

// Client options
let client = new customClient({
	intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

// Event Loader
for (let event of events) {
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

// Client login (Bot start)
void client.login(process.env.TOKEN)
