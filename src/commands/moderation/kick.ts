import { CommandInteraction, Formatters, Guild, Message, User } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../index';
import { customClient } from '../../index';

async function kickMember(member: User, guild: Guild, reason: string) {
  try {
    const dmChannel = await member.createDM();
    await dmChannel.send(`You have been kicked from \`${guild.name}\` for \`${reason}\`.`);
  } catch (e) {}

  try {
    await guild.members.kick(member);
    return {
      content: `Successfully kicked: ${Formatters.inlineCode(member.tag)}`
    };
  } catch (e: any) {
    if (e?.message === 'Missing Permissions') {
      return {
        content: `Failed to kick: ${Formatters.inlineCode(member.tag)} due to a lack of permissions!`
      };
    } else {
      return {
        content: `Failed to kick: ${Formatters.inlineCode(member.tag)}`
      };
    }
  }
}

export const kick: Command = {
  name: 'kick',
  alias: ['boot'],
  desc: 'Kicks someone from your guild!',
  category: 'Moderation 🧑‍⚖️',
  args: ['<@member>', '<reason>'],
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks someone from your guild!')
    .addUserOption((option) => option.setName('user').setDescription('Member to kick').setRequired(true))
    .addStringOption((option) => option.setName('reason').setDescription('Reason for the kick').setRequired(true)),
  perms: ['KICK_MEMBERS'],
  bPerms: ['SEND_MESSAGES', 'KICK_MEMBERS'],
  execute: async function (message: Message, client: customClient, args: any[]) {
    if (message.mentions.users.size > 0) {
      const guild = message.guild;
      const reason = args.slice(1).join(' ');

      if (!guild || !reason)
        return await message.reply({
          content: `Failed to run command. Usage:\n` + Formatters.inlineCode(`${client.prefix}kick <@member> <reason>`)
        });

      for (const member of message.mentions.users) {
        await message.reply(await kickMember(member[1], guild, reason));
      }
    } else {
      await message.reply({ content: 'Please mention at least one user!' });
    }
  },
  slashExecute: async function (interaction: CommandInteraction, client: customClient) {
    const member = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const guild = interaction.guild;
    if (!member || !guild || !reason)
      return await interaction.reply({
        content: `Failed to run command. Usage:\n` + Formatters.inlineCode(`${client.prefix}kick <@member> <reason>`)
      });
    if (member) {
      await interaction.reply(await kickMember(member, guild, reason));
    } else {
      await interaction.reply({ content: 'Please mention at least one user!' });
    }
  }
};
