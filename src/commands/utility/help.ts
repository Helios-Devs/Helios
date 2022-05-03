import { CommandInteraction, Formatters, Message, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Command, commands } from '../index';
import { customClient } from '../../index';

async function helpEmbed(client: customClient, trigger: Message | CommandInteraction, args: any[]) {
  const results = new MessageEmbed()
    .setTitle('Help')
    .setDescription('Unknown command!')
    .setFooter({ text: `${client.user?.username} v1.0.0` })
    .setColor('BLURPLE')
    .setTimestamp();
  if (args.length > 0) {
    // command specific
    const commandName: string = args.shift()?.toLowerCase() ?? '';
    let cmd = client.commands.filter((cmd) => cmd.name === commandName);
    if (cmd.length === 0) cmd = client.commands.filter((cmd) => cmd.alias.includes(commandName));
    const command = cmd[0];
    if (command) {
      results.setTitle(`${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)} - help`);
      results.setDescription(command.desc);
      if (command.alias.length > 0) {
        let aliases = '';
        for (const alias of command.alias) {
          aliases += ' ' + Formatters.inlineCode(alias);
        }
        results.addField('Aliases', aliases);
      }
      if (command.args.length > 0) {
        results.addField('Usage', Formatters.inlineCode(`${client.prefix}${command.name} ${command.args.join(' ')}`));
      } else {
        results.addField('Usage', Formatters.inlineCode(`${client.prefix}${command.name}`));
      }
    }
  } else {
    // generalized help
    results.setDescription(`For additional information about a command: \`${client.prefix}help <command>\``);

    const sortedCommands = new Map();

    for (const command of commands) {
      let preCheck: string = sortedCommands.get(command.category);

      if (preCheck) {
        preCheck += ' ' + Formatters.inlineCode(command.name);
        sortedCommands.set(command.category, preCheck);
      } else {
        sortedCommands.set(command.category, Formatters.inlineCode(command.name));
      }
    }

    for (const command of sortedCommands.entries()) {
      results.addField(command[0], command[1]);
    }
  }
  return { embeds: [results] };
}

export const help: Command = {
  name: 'help',
  alias: [],
  desc: 'Get helpful information about commands!',
  category: 'Utility 🛠️',
  args: ['<command>'],
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get help with commands')
    .addStringOption((option) =>
      option
        .setName('command')
        .setDescription('Get information about a specific command!')
        .setRequired(false)
        .setChoices([
          ['ping', 'ping'],
          ['help', 'help']
        ])
    ),
  perms: [],
  bPerms: ['SEND_MESSAGES'],
  execute: async function (message: Message, client: customClient, args: any[]) {
    void (await message.reply(await helpEmbed(client, message, args)));
  },
  slashExecute: async function (interaction: CommandInteraction, client: customClient) {
    const args: any[] = [];
    if (interaction.options.get('command')) args.push(interaction.options.get('command')?.value);
    void (await interaction.reply(await helpEmbed(client, interaction, args)));
  }
};
