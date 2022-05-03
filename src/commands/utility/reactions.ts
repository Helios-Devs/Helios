import { CommandInteraction, Formatters, Message } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../index';
import { customClient } from '../../index';

export const reactions: Command = {
  name: 'reactions',
  alias: ['rr', 'reactionroles'],
  desc: 'Add a reaction role to a message!',
  category: 'Utility 🛠️',
  args: ['<usage>'],
  data: new SlashCommandBuilder().setName('reactions').setDescription('Add a reaction role to a message!'),
  perms: ['MANAGE_ROLES'],
  bPerms: ['MANAGE_ROLES', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS'],
  execute: async function (message: Message, client: customClient, args: any[]) {
    if (!client) return;
    const mode = args.shift();

    if (mode === 'add') {
      try {
        const channelID = args.shift().replace(/[<#>]/g, '');
        const messageID = args.shift();
        const roleID = args.shift();
        const emoteID = args.shift();

        if (!messageID || !roleID || !emoteID || !channelID || !message.guild)
          return await message.channel.send({
            content: `Failed to run command. Usage:\n` + Formatters.inlineCode(`${client.prefix}rr add <channelID> <messageID> <roleID> <emoteID>`)
          });
        const channel = await message.guild.channels.fetch(channelID);
        if (!channel) return message.reply({ content: 'Unable to find channel' });
        if (channel.type !== 'GUILD_TEXT') return message.reply({ content: 'Invalid channel' });

        const target: Message = await channel.messages.fetch(messageID);
        try {
          await target.react(emoteID);
        } catch (e) {
          return message.reply('Unable to add reaction to specified message!');
        }
        const rr = await client.servers.setReactionRoles(message.guild, messageID, roleID, emoteID);
        if (rr.status) {
          await message.reply({
            content: 'Reaction role created successfully!'
          });
        } else {
          if (rr.message === 'EmoteInUse') {
            await message.reply({ content: 'Reaction is already in use!' });
          } else if (rr.message === 'MaxRoles') {
            await message.reply({ content: 'Reaction is already in use!' });
          } else {
            await message.reply({ content: 'Unknown error occurred!' });
          }
        }
      } catch (e) {
        await message.channel.send({
          content: `Failed to run command. Usage:\n` + Formatters.inlineCode(`${client.prefix}rr add <channelID> <messageID> <roleID> <emoteID>`)
        });
      }
    } else if (mode === 'remove' || mode === 'delete') {
      try {
        const channelID = args.shift().replace(/[<#>]/g, '');
        const messageID = args.shift();
        const emoteID = args.shift();

        if (!messageID || !emoteID || !message.guild)
          return await message.channel.send({
            content: `Failed to run command. Usage:\n` + Formatters.inlineCode(`${client.prefix}rr remove <channelID> <messageID> <emoteID>`)
          });
        const channel = await message.guild.channels.fetch(channelID);
        if (!channel) return message.reply({ content: 'Unable to find channel' });
        if (channel.type !== 'GUILD_TEXT') return message.reply({ content: 'Invalid channel' });

        const target: Message = await channel.messages.fetch(messageID);
        try {
          const emote = emoteID.replace('<:', '').replace('>', '').split(':')[1];
          const react = await target.reactions.cache.get(emote);
          if (react) await react.remove();
        } catch (e) {
          return message.reply('Unable to remove reaction from specified message!');
        }

        const rr = await client.servers.fetchReactionRoles(message.guild);
        const server = await client.servers.fetch(message.guild);
        server.reactionRoles = rr.filter((role) => role.emoteID !== emoteID);
        await server.save();
        await message.reply({ content: 'Reaction role removed successfully!' });
      } catch (e) {
        await message.channel.send({
          content: `Failed to run command. Usage:\n` + Formatters.inlineCode(`${client.prefix}rr remove <channelID> <messageID> <emoteID>`)
        });
      }
    } else {
      await message.reply({ content: 'Mode unrecognised' });
    }
  },
  slashExecute: async function (interaction: CommandInteraction, client: customClient) {
    if (!client) return;
    await interaction.reply({ content: 'test' });
  }
};
