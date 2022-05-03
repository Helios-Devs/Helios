import { Event } from './index';
import {} from 'discord.js';
import { customClient } from '../index';

export const discordJSEvent: Event = {
  name: 'discordJSEvent',
  once: false,
  execute: async (eventArgs: any, client: customClient) => {
    console.log(eventArgs, client);
  }
};
