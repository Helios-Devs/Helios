import { Event } from '../index';
import { Interaction, CacheType } from 'discord.js';
import { customClient } from '../../index';

export const slashInteraction: Event = {
  name: 'interactionCreate',
  once: false,
  execute: async (interaction: Interaction<CacheType>, client: customClient) => {
    if (interaction.isCommand()) {
      const command = client.commands?.filter((cmd) => cmd.name === interaction.commandName);
      if (command.length > 0) {
        try {
          command[0].slashExecute(interaction, client);
        } catch (error) {
          console.log(error);
          void (await interaction.reply('An error occurred'));
        }
      }
    }
  }
};
