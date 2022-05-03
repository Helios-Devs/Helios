import { Event } from '../index';
import { Message } from 'discord.js';
import { customClient } from '../../index';

async function count(message: Message<boolean>) {
  const channel = message.channel;
  if (!channel || channel.type !== 'GUILD_TEXT') return;
  if (!channel.name.includes('counting')) return;

  const messages = await channel.messages.fetch();
  if (messages.size < 2) return;

  const newMessage = [...messages.values()][0];
  const oldMessage = [...messages.values()][1];

  const newNumber = parseInt(newMessage.content);
  const oldNumber = parseInt(oldMessage.content);
  try {
    if (isNaN(newNumber)) {
      newMessage.delete();
    }

    if (isNaN(oldNumber)) {
      oldMessage.delete();
    }
  } catch (e) {}

  if (isNaN(newNumber) || isNaN(oldNumber)) return;

  if (newNumber - oldNumber === 1) {
    return message.react('👍');
  } else if (newNumber === 1) {
    return message.react('👍');
  } else {
    return message.react('�');
  }
}

export const counting: Event = {
  name: 'messageCreate',
  once: false,
  execute: async (message: Message<boolean>, client: customClient) => {
    console.log(client);
    await count(message);
  }
};
