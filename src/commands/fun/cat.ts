import { CommandInteraction, Message, MessageAttachment, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../index';
import { customClient } from '../../index';
import axios from 'axios'

async function fetchCat(text: string | undefined | null){
  try{
    let response, buffer, file
    if(!text){
      response = await axios.get(`https://cataas.com/cat/gif`,  { responseType: 'arraybuffer' })
      buffer = Buffer.from(response.data, "utf-8")
      file = new MessageAttachment(buffer, 'cat.gif');
    } else{
      response = await axios.get(`https://cataas.com/cat/gif/says/${text}`,  { responseType: 'arraybuffer' })
      buffer = Buffer.from(response.data, "utf-8")
      file = new MessageAttachment(buffer, 'cat.gif');
    }

    const catEmbed = new MessageEmbed()
      .setTitle('Cat')
      .setImage('attachment://cat.gif')
      .setColor('BLURPLE')

    return { embeds: [catEmbed], files: [file] }
  }
  catch (e: any) {
    if(e.request.res.statusCode){
      return {content: `An unexpected error occurred!\nhttps://http.cat/${e.request.res.statusCode}`}
    }
    return { content: 'An unexpected error occurred!' }
  }
}

export const cat: Command = {
  name: 'cat',
  alias: ['kitty'],
  desc: 'Generate a random gif of a cat with optional caption!',
  category: 'Fun 🎉',
  args: [],
  data: new SlashCommandBuilder()
    .setName('cat')
    .setDescription('Generate a random gif of a cat with optional caption!')
    .addStringOption((option) => option.setName('caption').setDescription('Optional caption to add to the image').setRequired(false))
  ,
  perms: [],
  bPerms: ['SEND_MESSAGES'],
  execute: async function (message: Message, client: customClient, args: any[]) {
    if (!client) return;
    await message.channel.sendTyping()
    await message.reply(await fetchCat(args.join(' ')));
  },
  slashExecute: async function (interaction: CommandInteraction, client: customClient) {
    if (!client) return;
    await interaction.deferReply()
    await interaction.followUp(await fetchCat(interaction.options.getString('caption')));
  }
};
