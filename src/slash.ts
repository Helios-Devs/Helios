import { commands } from './commands';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
require('dotenv').config();

const slashCommands = [];

for (const command of commands) {
  slashCommands.push(command.data.toJSON());
}

if (typeof process.env.TOKEN === 'string') {
  const rest = new REST().setToken(process.env.TOKEN);
  (async () => {
    try {
      console.log('Started refreshing application (/) commands.');

      await rest.put(Routes.applicationGuildCommands(`${process.env.CLIENTID}`, `${process.env.GUILDID}`), { body: slashCommands });

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  })();
}
