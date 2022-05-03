// Template for new commands

import { CommandInteraction, Formatters, Message, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from './index';
import { customClient } from '../index';

export const test: Command = {
  name: 'test',
  alias: [],
  desc: 'test!',
  category: 'test 🤖',
  args: [],
  data: new SlashCommandBuilder().setName('test').setDescription('test!'),
  perms: [],
  bPerms: ['SEND_MESSAGES'],
  execute: async function (message: Message, client: customClient, args: any[]) {
    if (!client) return;
    await message.reply({ content: 'test' });
  },
  slashExecute: async function (interaction: CommandInteraction, client: customClient) {
    if (!client) return;
    await interaction.reply({ content: 'test' });
  }
};
