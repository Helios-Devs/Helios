import { Event } from "../index";
import {
	Interaction,
	CacheType,
	CommandInteraction,
	Guild,
	MessageButton,
	MessageActionRow,
	MessageEmbed, Formatters
} from "discord.js";
import { serverInterface } from "../../models/server";
import { customClient } from "../../index";

export let buttonInteraction: Event = {
	name: 'interactionCreate',
	once: false,
	execute: async (interaction: Interaction<CacheType>, client: customClient) => {
		if(interaction.isButton()){
			if(interaction.customId.startsWith('da-')){ // DECLINE APPEAL
				try {
					let declined = new MessageButton().setStyle('SECONDARY').setLabel('DECLINED').setDisabled(true).setCustomId('DISABLED')
					let declinedRow = new MessageActionRow().addComponents([declined])
					await interaction.update({embeds: interaction.message.embeds, components: [declinedRow]})
				}catch (e) {
					console.log(e)
				}
			}
			else if(interaction.customId.startsWith('aa-')){ // ACCEPT APPEAL
				if(!interaction.guild) return;

				try {
					let accepted = new MessageButton().setStyle('SECONDARY').setLabel('ACCEPTED').setDisabled(true).setCustomId('DISABLED')
					let acceptedRow = new MessageActionRow().addComponents([accepted])

					let memberID = interaction.customId.replace('aa-', '')
					interaction.guild.bans.remove(memberID)
					await interaction.update({embeds: interaction.message.embeds, components: [acceptedRow]})
				}catch (e) {
					console.log(e)
				}
			}
			else if(interaction.customId.startsWith('ba-')){ // BAN APPEAL
				try {
					let guildID = interaction.customId.replace('ba-', '')
					let appealed = new MessageButton().setStyle('SECONDARY').setLabel('APPEALED').setDisabled(true).setCustomId('DISABLED')
					let appealedRow = new MessageActionRow().addComponents([appealed])
					let acceptAppeal = new MessageButton().setStyle('SUCCESS').setLabel('ACCEPT').setCustomId(`aa-${interaction.user.id}`)
					let declineAppeal = new MessageButton().setStyle('DANGER').setLabel('DECLINE').setCustomId(`da-${interaction.user.id}`)
					let verdictRow = new MessageActionRow().addComponents([acceptAppeal, declineAppeal])

					let guild = await client.guilds.fetch(guildID).catch(e => {})
					if(!guild) return;
					let server: serverInterface = await client.servers.fetch(guild)
					let channel = await guild.channels.fetch(server.appealChannel)
					if(!channel || channel.type !== 'GUILD_TEXT') return;

					let {reason, user} = await guild.bans.fetch(interaction.user.id)
					let avatar = user.avatarURL()

					let appealEmbed = new MessageEmbed()
						.setTitle('Ban Appeal')
						.setColor("BLURPLE")
						.addField('User', Formatters.inlineCode(user.tag), true)
						.addField('Ban reason', Formatters.inlineCode(reason ?? 'Unknown'), true)

					if(avatar){
						appealEmbed.setThumbnail(avatar)
					}

					await interaction.update({content: `${interaction.message.content}`, components: [appealedRow]})
					await channel.send({embeds: [appealEmbed], components: [verdictRow]})

				}catch (e) {
					console.log(e)
				}
			}
		}
	}
}
