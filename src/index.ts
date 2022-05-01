import { Client, Guild, Intents } from 'discord.js';
import { connect, Mongoose } from "mongoose";
import { Command, commands } from './commands';
import { cleanEval } from "./helpers/eval";
import { server } from "./helpers/server";


require('dotenv').config()

export class customClient extends Client {
	commands: Command[] = commands
	prefix: string = 'h!'
	owners: number[] = [719292655963734056, 778110527892488233]
	db!: Mongoose
	servers = server
}

let client = new customClient({
	intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});


client.on('ready', async () => {
	console.log(`${client.user?.tag} is ready!`)
	if(process.env.MONGO){
		client.db = await connect(process.env.MONGO)
		if(client.db.connection.readyState === 1) console.log('Database is ready!')
	}
});

client.on('messageCreate', async (message) => {
	if (!message.content.startsWith(client.prefix)) return;
	if (message.channel.type === 'DM') return;
	if (message.guild === null) return;
	let args = message.content.slice(client.prefix?.length).trim().split(' ');
	let commandName : string = args.shift()?.toLowerCase() ?? '';
	let command = client.commands.filter(cmd => cmd.name === commandName)
	if(command.length === 0) command = client.commands.filter(cmd => cmd.alias.includes(commandName));

	if (client.owners.includes(parseInt(message.author.id))){
		if (commandName === `eval`) {
			await message.reply(await cleanEval(message, client))
		}
		else if(commandName === 'settings'){
			if(args[0] === 'logs'){
				if(args[1] === 'add'){
					let server = await client.servers.fetch(message?.guild)
					let channel = message.mentions.channels.first()
					if(!channel) {
						await message.reply('Please mention a channel')
						return
					}
					await console.log(await client.servers.setLogChannel(message.guild, channel.id))
				}
			}
		}
		else if(commandName === 'test'){
			let server = await client.servers.fetch(message?.guild)
			console.log(server)
		}
	}

	if (command.length > 0) {
		try {
			command[0].execute(message, client, args)
		} catch (error) {
			console.log(error)
			await message.reply('An error occurred');
		}
	}
});

client.on('interactionCreate', async (interaction) =>{
	if(interaction.isCommand()){
		let command = client.commands?.filter(cmd => cmd.name === interaction.commandName);
		if(command.length > 0){
			try {
				command[0].slashExecute(interaction, client)
			} catch (error) {
				console.log(error)
				void interaction.reply('An error occurred');
			}
		}
	}
});

client.on('messageReactionAdd', async (reaction, user) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			return;
		}
	}
	if(!reaction.message.guild) return;
	let server = await client.servers.fetch(reaction.message.guild)
	let roles = await client.servers.fetchReactionRoles(reaction.message.guild)
	console.log(roles)
});

void client.login(process.env.TOKEN)
