import { CommandInteraction, Formatters, Message, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from "../index";
import { customClient } from "../../index";

export let purge: Command = {
	name: "purge",
	alias: ['prune', 'cleanup'],
	desc: "Purges messages from a channel!",
	category: 'Moderation 🧑‍⚖️',
	args: [],
	data: new SlashCommandBuilder().setName('purge').setDescription('Purges messages from a channel!'),
	perms: ['MANAGE_MESSAGES'],
	bPerms: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
	execute: async function (message: Message, client: customClient, args: any[]) {
		let count = parseInt(args.shift()) + 1
		let userReason = args.join(' ')
		if(count && !(isNaN(count)) && count > 0 && count <= 100){
			let messages = await message.channel.messages.fetch({limit: count})
			if(messages && message.channel.type !== 'DM' && message.guild !== null){
				let logChannelID = await client.servers.fetchLogChannel(message.guild)
				let logChannel
				let reason = ''
				if(logChannelID) logChannel = await message.guild.channels.fetch(logChannelID);
				if(userReason.length > 0) reason = `Reason: ` + Formatters.inlineCode(userReason) + `\n`;

				message.channel.bulkDelete(messages, true)

				if(logChannel && logChannel.type === "GUILD_TEXT"){
					let bulkDeleteEmbed = new MessageEmbed()
						.setDescription(
							`Bulk deletion in <#${message.channel.id}> by <@${message.author.id}>\n` +
							reason +
							Formatters.codeBlock('diff',`- Deleted ${messages.size} messages!`)
						)
						.setColor('BLURPLE')
						.setTimestamp(message.createdTimestamp)
						.setFooter({text: `${client.user?.username} v1.0.0`})
					return await logChannel.send({embeds: [bulkDeleteEmbed]})
				} else {
					return await message.channel.send({
						content:
							`Bulk deletion of ${messages.size} ${messages.size > 0 ? 'message': 'messages'} by <@${message.author.id}>` +
							`${reason.length> 0 ? `. Reason - ${userReason}`: ''}`
					})
				}
			}

		}
		else {
			return await message.channel.send({content: `Failed to run command. Usage:\n` + Formatters.inlineCode(`${client.prefix}purge <amount> <reason>`)})
		}
	},
	slashExecute: async function (interaction: CommandInteraction, client: customClient) {
		await interaction.reply({content: 'test'})
	}
}
