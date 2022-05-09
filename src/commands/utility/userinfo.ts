import { CommandInteraction, GuildMember, Message, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../index';
import { customClient } from '../../index';

function embed(member: GuildMember) {
	const embed = new MessageEmbed();

	embed.setTitle(`${member.user.username}'s information`);
	embed.setThumbnail(member.displayAvatarURL({ dynamic: true, size: 1024 }));

	embed.addField('ID', member.user.id);
	embed.addField('Tag', member.user.tag);
	embed.addField('Created at', `<t:${member.user.createdTimestamp}:R>`);
	embed.addField('Joined', `<t:${member.joinedTimestamp}:R>`);


	embed.setTimestamp();

	return embed;
}

export const userinfo: Command = {
	name: 'userinfo',
	alias: ['info', 'user'],
	desc: 'Get information about a user.',
	category: 'Utility 🛠️',
	args: ['<user>'],
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Get information about a user.')
		.addUserOption((option) => option.setName('user').setDescription('User to get information from.')),
	perms: [],
	bPerms: ['SEND_MESSAGES'],
	execute: async function (message: Message, client: customClient, args: any[]) {
		if(args.length < 1) return;
		const user = await message.guild?.members.fetch(args[0].replace(/[<@!>]/g, '') || message.author.id)
			.catch(() => {
				message.reply('Could not find that user.');
			});

		if (!user) return;
		return message.reply({ embeds: [embed(user)] });
	},
	slashExecute: async function (interaction: CommandInteraction, client: customClient) {
		const user = await interaction.guild?.members.fetch(interaction.options.getUser('user') || interaction.user)
			.catch(() => {
				interaction.reply('Could not find that user.');
			});

		if (!user) return;
		return interaction.reply({ embeds: [embed(user)] });
	}
};