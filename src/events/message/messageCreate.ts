import { Event } from "../index";
import { Message } from "discord.js";
import { customClient } from "../../index";
import { cleanEval } from "../../helpers/eval";

export let messageCreate: Event = {
	name: 'messageCreate',
	once: false,
	execute: async (message: Message<boolean>, client: customClient) => {
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
			else if(commandName === 'dbserver'){
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
	}
}
