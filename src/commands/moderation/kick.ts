import { CommandInteraction, Formatters, Message, User } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from "../index";
import { customClient } from "../../index";

async function kickMember(member: User, guild: any, reason: string) {
	let dmChannel = await member.createDM()
	await dmChannel.send(`You have been kicked from \`${guild.name}\` for \`${reason}\`.`)
	return {content: `Kicked: ` + Formatters.inlineCode(member.tag)}
}

export let kick: Command = {
	name: "kick",
	alias: ['boot'],
	desc: "Kicks someone from your guild!",
	category: 'Moderation 🧑‍⚖️',
	args: ['<@member>'],
	data: new SlashCommandBuilder().setName('kick').setDescription('Kicks someone from your guild!').addUserOption(option =>
		option.setName('user').setDescription('Who to kick?').setRequired(true)
	).addStringOption(option =>
		option.setName('reason').setDescription('Reason for the kick?').setRequired(false)
	),
	perms: ['KICK_MEMBERS'],
	bPerms: ['SEND_MESSAGES', 'KICK_MEMBERS'],
	execute: async function (message: Message, client: customClient, args: any[]) {
		if (message.mentions.users.size > 0) {
			let guild = message.guild
			let reason = args.slice(1).join(' ')
			// @ts-ignore
			for (let member of message.mentions.users) {
				await message.reply(await kickMember(member[1], guild, reason));
			}
		} else {
			await message.reply({ content: 'Please mention at least one user!' })
		}
	},
	slashExecute: async function (interaction: CommandInteraction, client: customClient) {
		let member = interaction.options.get('user')
		let reason = interaction.options.get('reason')
		let guild = interaction.guild
		if (!member) return;
		await interaction.reply(await kickMember(member.user as User, guild, `${reason}`))
	}
}