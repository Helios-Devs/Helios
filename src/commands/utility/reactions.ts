import { CommandInteraction, Formatters, Message, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from "../index";
import { customClient } from "../../index";

export let reactions: Command = {
	name: "reactions",
	alias: ['rr', 'reactionroles'],
	desc: "Add a reaction role to a message!",
	category: 'Utility 🛠️',
	args: ['<mode>', '<messageID>', '<roleID>', '<emoteID>'],
	data: new SlashCommandBuilder().setName('reactions').setDescription('Add a reaction role to a message!'),
	perms: ['MANAGE_ROLES'],
	bPerms: ['MANAGE_ROLES'],
	execute: async function (message: Message, client: customClient, args: any[]) {
		let mode = args.shift()
		let messageID = args.shift()
		let roleID = args.shift()
		let emoteID = args.shift()

		if(!messageID || !roleID || !emoteID || !message.guild) return await message.channel.send({content: `Failed to run command. Usage:\n` + Formatters.inlineCode(`${client.prefix}rr <mode> <messageID> <roleID> <emoteID>`)})
		if(mode === 'add'){
			let test = await client.servers.setReactionRoles(message.guild, messageID, roleID, emoteID)
			console.log(test)
			await message.reply({content: 'Mode tested'})
		} else if(mode === 'remove' || mode === 'delete'){

		} else{
			await message.reply({content: 'Mode unrecognised'})
		}
	},
	slashExecute: async function (interaction: CommandInteraction, client: customClient) {
		await interaction.reply({content: 'test'})
	}
}
