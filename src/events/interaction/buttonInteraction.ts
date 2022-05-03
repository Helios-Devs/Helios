import { Event } from '../index';
import { Interaction, CacheType, MessageButton, MessageActionRow, MessageEmbed, Formatters } from 'discord.js';
import { serverInterface } from '../../models/server';
import { customClient } from '../../index';

export const buttonInteraction: Event = {
  name: 'interactionCreate',
  once: false,
  execute: async (interaction: Interaction<CacheType>, client: customClient) => {
    if (interaction.isButton()) {
      if (interaction.customId.startsWith('da-')) {
        // DECLINE APPEAL
        try {
          const declined = new MessageButton().setStyle('SECONDARY').setLabel('DECLINED').setDisabled(true).setCustomId('DISABLED');
          const declinedRow = new MessageActionRow().addComponents([declined]);
          await interaction.update({
            embeds: interaction.message.embeds,
            components: [declinedRow]
          });
        } catch (e) {
          console.log(e);
        }
      } else if (interaction.customId.startsWith('aa-')) {
        // ACCEPT APPEAL
        if (!interaction.guild) return;

        try {
          const accepted = new MessageButton().setStyle('SECONDARY').setLabel('ACCEPTED').setDisabled(true).setCustomId('DISABLED');
          const acceptedRow = new MessageActionRow().addComponents([accepted]);

          const memberID = interaction.customId.replace('aa-', '');
          interaction.guild.bans.remove(memberID).catch((e) => {
            console.log(e);
          });
          await interaction.update({
            embeds: interaction.message.embeds,
            components: [acceptedRow]
          });

          const member = await client.users.fetch(memberID);
          const dmChannel = await member.createDM();
          const guildChannels = [...(await interaction.guild.channels.fetch()).values()].filter((channel) => channel.type === 'GUILD_TEXT');

          if (guildChannels.length > 0) {
            const guildChannel = guildChannels[0];
            await dmChannel.send({
              content: `You have been unbanned from \`${interaction.guild.name}\`.\nInvite Link: <${await interaction.guild.invites.create(guildChannel.id, { maxUses: 1 })}>.`
            });
          } else {
            await dmChannel.send({
              content: `You have been unbanned from \`${interaction.guild.name}\`.`
            });
          }
        } catch (e) {
          console.log(e);
        }
      } else if (interaction.customId.startsWith('ba-')) {
        // BAN APPEAL
        try {
          const guildID = interaction.customId.replace('ba-', '');
          const appealed = new MessageButton().setStyle('SECONDARY').setLabel('APPEALED').setDisabled(true).setCustomId('DISABLED');
          const appealedRow = new MessageActionRow().addComponents([appealed]);
          const acceptAppeal = new MessageButton().setStyle('SUCCESS').setLabel('ACCEPT').setCustomId(`aa-${interaction.user.id}`);
          const declineAppeal = new MessageButton().setStyle('DANGER').setLabel('DECLINE').setCustomId(`da-${interaction.user.id}`);
          const verdictRow = new MessageActionRow().addComponents([acceptAppeal, declineAppeal]);

          const guild = await client.guilds.fetch(guildID).catch((e) => {
            console.log(e);
          });
          if (!guild) return;
          const server: serverInterface = await client.servers.fetch(guild);
          const channel = await guild.channels.fetch(server.appealChannel);
          if (!channel || channel.type !== 'GUILD_TEXT') return;

          const { reason, user } = await guild.bans.fetch(interaction.user.id);
          const avatar = user.avatarURL();

          const appealEmbed = new MessageEmbed()
            .setTitle('Ban Appeal')
            .setColor('BLURPLE')
            .addField('User', Formatters.inlineCode(user.tag), true)
            .addField('Ban reason', Formatters.inlineCode(reason ?? 'Unknown'), true);

          if (avatar) {
            appealEmbed.setThumbnail(avatar);
          }

          await interaction.update({
            content: `${interaction.message.content}`,
            components: [appealedRow]
          });
          await channel.send({
            embeds: [appealEmbed],
            components: [verdictRow]
          });
        } catch (e: any) {
          if (e.message === 'Unknown Ban') {
            const appealed = new MessageButton().setStyle('SECONDARY').setLabel('APPEALED').setDisabled(true).setCustomId('DISABLED');
            const appealedRow = new MessageActionRow().addComponents([appealed]);
            return await interaction.update({
              content: `${interaction.message.content}`,
              components: [appealedRow]
            });
          } else {
            console.log(e);
          }
        }
      }
    }
  }
};
