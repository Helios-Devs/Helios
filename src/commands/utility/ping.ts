import { CommandInteraction, Formatters, Message, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../index';
import { customClient } from '../../index';

export const ping: Command = {
  name: 'ping',
  alias: ['latency'],
  desc: "Check the bot's round-trip latency!",
  category: 'Utility 🛠️',
  args: [],
  data: new SlashCommandBuilder().setName('ping').setDescription("Check the bot's round-trip latency!"),
  perms: [],
  bPerms: ['SEND_MESSAGES'],
  execute: async function (message: Message, client: customClient, args: any[]) {
    const latency = new MessageEmbed()
      .setTitle('Latency')
      .setFooter({ text: `${client.user?.username} v1.0.0` })
      .setColor('RED')
      .setTimestamp();
    message.reply({ content: 'Calculating..', embeds: [latency] }).then((msg) => {
      latency
        .setColor('GREEN')
        .addField('🏓 Round-trip:', Formatters.inlineCode(String(msg.createdTimestamp - message.createdTimestamp)))
        .addField('🌐 API:', Formatters.inlineCode(String(Math.round(client.ws.ping))));
      void msg.edit({ content: 'Results:', embeds: [latency] });
    });
  },
  slashExecute: async function (interaction: CommandInteraction, client: customClient) {
    const latency = new MessageEmbed()
      .setTitle('Latency')
      .setFooter({ text: `${client.user?.username} v1.0.0` })
      .setColor('RED')
      .setTimestamp();
    interaction.reply({ content: 'Calculating..', embeds: [latency], fetchReply: true }).then((msg) => {
      if (!(msg instanceof Message)) return;
      latency
        .setColor('GREEN')
        .addField('🏓 Round-trip:', Formatters.inlineCode(String(msg.createdTimestamp - interaction.createdTimestamp)))
        .addField('🌐 API:', Formatters.inlineCode(String(Math.round(client.ws.ping))));
      void interaction.editReply({ content: 'Results:', embeds: [latency] });
    });
  }
};
//
