import { Guild } from "discord.js";
import { models } from "../models/models";

export let servers = {
	fetch: async (guild: Guild) => {
		let server = await models.server.findOne({id: guild.id})
		if(server) {
			return server
		} else {
			let server = new models.server({
				id: guild.id,
				loggingChannelID: '',
				muteRoleID: '',
				reactionRoles: [],
				scamBan: false
			})
			void await server.save()
			return server;
		}
	},
	fetchLogChannel : async (guild: Guild) : Promise<undefined|string> => {
		let server = await models.server.findOne({id: guild.id})
		console.log(guild.id, server)
		if(!server) return;
		if(!server.loggingChannelID) return;
		return server.loggingChannelID
	},
	setLogChannel: async (guild: Guild, channelID: string) => {
		let server = await models.server.findOne({id: guild.id})
		if(!server) return;
		server.loggingChannelID = channelID
		await server.save()
		return models.server.findOne({id: guild.id});
	},
	fetchReactionRoles: async (guild: Guild) => {
		let server = await models.server.findOne({id: guild.id})
		if(server) {
			return server.reactionRoles
		} else {
			return [];
		}
	},
	setReactionRoles: async (guild: Guild, messageID: string, roleID: string, emoteID: string) => {
		let server = await models.server.findOne({id: guild.id})
		if(!server) return { status: false, message: 'NoServer'};
		if((await server.reactionRoles.filter(r=> r.emoteID === emoteID)).length > 0) return { status: false, message: 'EmoteInUse'};
		if(server.reactionRoles.length === 10) return { status: false, message: 'MaxRoles'};
		let reactionRole = new models.reactionRole({
			messageID: messageID,
			roleID: roleID,
			emoteID: emoteID
		})
		server.reactionRoles.push(reactionRole)
		await server.save()
		return {status: true, message: await models.server.findOne({id: guild.id}) }
	}
}
