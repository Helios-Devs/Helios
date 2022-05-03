import { Event } from '../index';
import { Message } from 'discord.js';
import { customClient } from '../../index';
import { cleanEval } from '../../helpers/eval';

export const messageCreate: Event = {
  name: 'messageCreate',
  once: false,
  execute: async (message: Message<boolean>, client: customClient) => {
    if (!message.content.startsWith(client.prefix)) return;
    if (message.channel.type === 'DM') return;
    if (message.guild === null) return;
    const args = message.content.slice(client.prefix?.length).trim().split(' ');
    const commandName: string = args.shift()?.toLowerCase() ?? '';
    let command = client.commands.filter((cmd) => cmd.name === commandName);
    if (command.length === 0) command = client.commands.filter((cmd) => cmd.alias.includes(commandName));

    if (client.owners.includes(parseInt(message.author.id))) {
      if (commandName === `eval`) {
        await message.reply(await cleanEval(message, client));
      } else if (commandName === 'settings') {
        await client.servers.fetch(message?.guild);
        const channel = message.mentions.channels.first();
        if (args[0] === 'add') {
          if (args[1] === 'log') {
            if (!channel) {
              await message.reply('Please mention a channel');
              return;
            }
            await console.log(await client.servers.setLogChannel(message.guild, channel.id));
          }
          if (args[1] === 'appeal') {
            if (!channel) {
              await message.reply('Please mention a channel');
              return;
            }
            await console.log(await client.servers.setAppealChannel(message.guild, channel.id));
          }
        }
      } else if (commandName === 'dbserver') {
        const server = await client.servers.fetch(message?.guild);
        console.log(server);
      }
    }

    if (command.length > 0) {
      try {
        command[0].execute(message, client, args);
      } catch (error) {
        console.log(error);
        await message.reply('An error occurred');
      }
    }
  }
};
