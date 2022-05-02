import { CommandInteraction, Formatters, Guild, Message, MessageActionRow, MessageButton, User } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from "../index";
import { customClient } from "../../index";

async function banMember(member: User, guild: Guild, ban: { delete: number, reason: string }){

	let appeal = new MessageButton().setStyle('PRIMARY').setLabel('APPEAL').setCustomId(`ba-${guild.id}`)
	let appealRow = new MessageActionRow().addComponents([appeal])

	try {

		let dmChannel = await member.createDM()
		await dmChannel.send({
			content: `You have been banned from \`${guild.name}\` for \`${ban.reason}\`. \nIf you are unable to appeal, join: https://discord.gg/EW5SxFY8sw and try again!`,
			components: [appealRow]
		})

		await guild.members.ban(member, {days: ban.delete, reason: ban.reason})

		return {content: `Successfully banned: ` + Formatters.inlineCode(member.tag)}
	} catch (e: any) {
		if(e?.message === 'Missing Permissions'){
			return {content: `Failed to ban: ${Formatters.inlineCode(member.tag)} due to a lack of permissions!`}
		} else{
			return {content: `Failed to ban: ${Formatters.inlineCode(member.tag)}`}
		}
	}

}

export let ban: Command = {
	name: "ban",
	alias: ['banish'],
	desc: "Bans someone from your guild!",
	category: 'Moderation 🧑‍⚖️',
	args: ['<@member>', '<delete_messages>', '<reason>'],
	data: new SlashCommandBuilder().setName('ban').setDescription('Bans someone from your guild!').addUserOption(option =>
		option.setName('user').setDescription('Member to ban').setRequired(true)
	).addNumberOption(option =>
		option.setName('delete_messages').setDescription('How much of their recent message history to delete')
			.addChoices([['Don\'t Delete Any', 0], ['24 Hours', 1], ['Previous 7 Days', 7]])
			.setRequired(true)
	).addStringOption(option =>
		option.setName('reason').setDescription('Reason for the ban').setRequired(true)
	),
	perms: ['BAN_MEMBERS'],
	bPerms: ['SEND_MESSAGES', 'BAN_MEMBERS'],
	execute: async function (message: Message, client: customClient, args: any[]) {
		if (message.mentions.users.size > 0) {
			let guild = message.guild
			let reason = args.slice(1).join(' ')

			if(!guild || !reason) return await message.reply({content: `Failed to run command. Usage:\n` + Formatters.inlineCode(`${client.prefix}ban <@member> <delete_messages> <reason>`)});

			for (let member of message.mentions.users) {
				await message.reply(await banMember(member[1], guild, { delete: 0, reason: reason }));
			}
		} else {
			await message.reply({ content: 'Please mention at least one user!' })
		}
	},
	slashExecute: async function (interaction: CommandInteraction, client: customClient) {
		let member = interaction.options.getUser('user')
		let reason = interaction.options.getString('reason')
		let days = interaction.options.getNumber('delete_messages') ?? 0
		let guild = interaction.guild
		if (!member || !guild || !reason) return await interaction.reply({content: `Failed to run command. Usage:\n` + Formatters.inlineCode(`${client.prefix}ban <@member> <delete_messages> <reason>`)});
		if (member) {
			await interaction.reply(await banMember(member, guild, { delete: days, reason: reason }))
		} else {
			await interaction.reply({ content: 'Please mention at least one user!' })
		}
	}
}
