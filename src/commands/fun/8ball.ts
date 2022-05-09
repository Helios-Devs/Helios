import { CommandInteraction, Message, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../index';
import { customClient } from '../../index';

function eightBallEmbed(question: string) {
	return new MessageEmbed()
		.setTitle('8ball')
		.setDescription('Ask the magic 8ball a question!')
		.setFields(
			{
				name: 'Question',
				value: question,
			},
			{
				name: 'Answer',
				value: randomString(),
			}
		)
		.setTimestamp();
}

export const eightball: Command = {
	name: '8ball',
	alias: ['eightball', 'eight-ball'],
	desc: 'Ask the magic 8 ball a question',
	category: 'Fun ⚽',
	args: ['<question>'],
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Ask the magic 8 ball a question')
		.addStringOption((option) => option.setName('question').setDescription('Question to ask the magic 8 ball').setRequired(true)),
	perms: [],
	bPerms: ['SEND_MESSAGES'],
	execute: function (message: Message, client: customClient, args: any[]) {
		if(args.length < 1) return;
		return message.reply({ embeds: [eightBallEmbed(args.join(' '))] });
	},
	slashExecute: function (interaction: CommandInteraction) {
		return interaction.reply({ embeds: [eightBallEmbed(interaction.options.getString('question') as string)] });
	}
};


function randomString() {
	const strings = [
		"It is certain",
		"It is decidedly so",
		"Without a doubt",
		"You may rely on it",
		"As I see it, yes",
		"Most likely",
		"Outlook good",
		"Signs point to yes",
		"Reply has been seen",
		"Ask again later",
		"Better not tell you now",
		"Cannot predict now",
		"Concentrate and ask again",
		"Don't count on it",
		"My reply is no",
		"My sources say no",
		"Outlook not so good",
		"Very doubtful"
	]

	return strings[Math.floor(Math.random() * strings.length)];
}