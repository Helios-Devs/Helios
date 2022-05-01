import { CommandInteraction, Formatters, Message, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from "../index";
import { customClient } from "../../index";

export let reactions: Command = {
	name: "reactions",
	alias: ['rr', 'reactionroles'],
	desc: "Add a reaction role to a message!",
	category: 'Utility 🛠️',
	args: ['<usage>'],
	data: new SlashCommandBuilder().setName('reactions').setDescription('Add a reaction role to a message!'),
	perms: ['MANAGE_ROLES'],
	bPerms: ['MANAGE_ROLES', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS'],
	execute: async function (message: Message, client: customClient, args: any[]) {
		let mode = args.shift()

		if(mode === 'add'){
			try {
				let channelID = args.shift().replace(/[<#>]/g, '')
				let messageID = args.shift()
				let roleID = args.shift()
				let emoteID = args.shift()

				if(!messageID || !roleID || !emoteID || !channelID || !message.guild) return await message.channel.send({content: `Failed to run command. Usage:\n` + Formatters.inlineCode(`${client.prefix}rr add <channelID> <messageID> <roleID> <emoteID>`)})
				let channel = await message.guild.channels.fetch(channelID)
				if(!channel) return message.reply({content: 'Unable to find channel'})
				if(channel.type !== 'GUILD_TEXT') return message.reply({content: 'Invalid channel'})

				let target: Message = await channel.messages.fetch(messageID)
				try{
					await target.react(emoteID)
				} catch (e) {
					return message.reply('Unable to add reaction to specified message!')
				}
				let rr = await client.servers.setReactionRoles(message.guild, messageID, roleID, emoteID)
				if(rr.status){
					await message.reply({content: 'Reaction role created successfully!'})
				} else{
					if(rr.message === 'EmoteInUse'){
						await message.reply({content: 'Reaction is already in use!'})
					} else if(rr.message === 'MaxRoles'){
						await message.reply({content: 'Reaction is already in use!'})
					} else {
						await message.reply({content: 'Unknown error occurred!'})
					}
				}
			} catch (e) {
				await message.channel.send({content: `Failed to run command. Usage:\n` + Formatters.inlineCode(`${client.prefix}rr add <channelID> <messageID> <roleID> <emoteID>`)})
			}

		}
		else if(mode === 'remove' || mode === 'delete'){
			try{
				let channelID = args.shift().replace(/[<#>]/g, '')
				let messageID = args.shift()
				let emoteID = args.shift()

				if(!messageID || !emoteID || !message.guild) return await message.channel.send({content: `Failed to run command. Usage:\n` + Formatters.inlineCode(`${client.prefix}rr remove <channelID> <messageID> <emoteID>`)})
				let channel = await message.guild.channels.fetch(channelID)
				if(!channel) return message.reply({content: 'Unable to find channel'})
				if(channel.type !== 'GUILD_TEXT') return message.reply({content: 'Invalid channel'})

				let target: Message = await channel.messages.fetch(messageID)
				try {
					let emote = emoteID.replace('<:', '').replace('>', '').split(':')[1] //@ts-ignore
					await target.reactions.cache.get(emote).remove()
				} catch (e) {
					return message.reply('Unable to remove reaction from specified message!')
				}

				let rr = await client.servers.fetchReactionRoles(message.guild)
				let server = await client.servers.fetch(message.guild)
				server.reactionRoles = rr.filter(role => role.emoteID !== emoteID)
				await server.save()
				await message.reply({content: 'Reaction role removed successfully!'})
			} catch(e) {
				await message.channel.send({content: `Failed to run command. Usage:\n` + Formatters.inlineCode(`${client.prefix}rr remove <channelID> <messageID> <emoteID>`)})
			}
		}
		else {
			await message.reply({content: 'Mode unrecognised'})
		}
	},
	slashExecute: async function (interaction: CommandInteraction, client: customClient) {
		await interaction.reply({content: 'test'})
	}
}
