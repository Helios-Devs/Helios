import { Client, Guild, Intents } from 'discord.js';
import { connect, Mongoose } from "mongoose";
import { Command, commands } from './commands';
import { Event, events } from './events/';
import { servers } from "./helpers/server";
require('dotenv').config()

export class customClient extends Client {
	commands: Command[] = commands
	prefix: string = 'h!'
	owners: number[] = [719292655963734056, 778110527892488233]
	db!: Mongoose
	servers = servers
}

let client = new customClient({
	intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

for (let event of events) {
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}


void client.login(process.env.TOKEN)
