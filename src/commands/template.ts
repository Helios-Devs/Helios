// Template for new commands

import { CommandInteraction, Formatters, Message, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from "./index";
import { customClient } from "../index";

export let test: Command = {
	name: "test",
	alias: [],
	desc: "test!",
	category: 'test 🤖',
	args: [],
	data: new SlashCommandBuilder().setName('test').setDescription('test!'),
	perms: [],
	bPerms: ['SEND_MESSAGES'],
	execute: async function (message: Message, client: customClient, args: any[]) {
		await message.reply({content: 'test'})
	},
	slashExecute: async function (interaction: CommandInteraction, client: customClient) {
		await interaction.reply({content: 'test'})
	}
}
