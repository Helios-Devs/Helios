import { CommandInteraction, Formatters, Message, User } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from "../index";
import { customClient } from "../../index";

async function banMember(member: User, guild: any, ban: { delete: number, reason: string }){
	let dmChannel = await member.createDM()
	await dmChannel.send(`You have been banned from \`${guild.name}\` for \`${ban.reason}\`.`)
	return {content: `Banned: ` + Formatters.inlineCode(member.tag)}
}
export let ban: Command = {
	name: "ban",
	alias: ['banish'],
	desc: "Bans someone from your guild!",
	category: 'Moderation 🧑‍⚖️',
	args: ['<@member>'],
	data: new SlashCommandBuilder().setName('ban').setDescription('Bans someone from your guild!').addUserOption(option =>
		option.setName('user').setDescription('Who to ban?').setRequired(true)
	).addStringOption(option =>
		option.setName('reason').setDescription('Reason for the ban?').setRequired(false)
	),
	perms: ['BAN_MEMBERS'],
	bPerms: ['SEND_MESSAGES', 'BAN_MEMBERS'],
	execute: async function (message: Message, client: customClient, args: any[]) {
		if(message.mentions.users.size > 0){
			let guild = message.guild
			let reason = args.slice(1).join(' ')
			// @ts-ignore
			for(let member of message.mentions.users){
				await message.reply(await banMember(member[1], guild, { delete: 0, reason: reason }))
			}
		}
		else {
			await message.reply({content: 'Please mention at least one user!'})
		}
	},
	slashExecute: async function (interaction: CommandInteraction, client: customClient) {
		let member = interaction.options.get('user')
		let reason = interaction.options.get('reason')
		let guild = interaction.guild
		if(!member) return;
		// @ts-ignore
		await interaction.reply(await banMember(member.user, guild, { delete: 0, reason: reason }))
	}
}
