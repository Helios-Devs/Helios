// Libraries
import { Client, Intents } from 'discord.js';
import { ToadScheduler } from 'toad-scheduler';
import { Mongoose } from 'mongoose';
require('dotenv').config();

// Core
import { Command, commands } from './commands';
import { events } from './events/';

// Helpers
import { servers } from './helpers/server';

// Custom client class
export class customClient extends Client {
  commands: Command[] = commands;
  prefix = 'h!';
  owners: number[] = [719292655963734056, 778110527892488233];
  db!: Mongoose;
  servers = servers;
  scheduler = new ToadScheduler();
}

// Client options
const client = new customClient({
  intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

// Event Loader
for (const event of events) {
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Client login (Bot start)
void client.login(process.env.TOKEN);
