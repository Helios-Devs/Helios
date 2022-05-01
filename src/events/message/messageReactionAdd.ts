import { Event } from "../index";
import { MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import { customClient } from "../../index";

export let messageReactionAdd: Event = {
	name: 'messageReactionAdd',
	once: false,
	execute: async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser, client: customClient) => {
		if(reaction.partial) {
			try {
				await reaction.fetch();
			} catch (error) {
				console.error('Something went wrong when fetching the message:', error);
				return;
			}
		}
		if(!reaction.message.guild || (!reaction.emoji.id && !reaction.emoji.name)) return;
		let server = await client.servers.fetch(reaction.message.guild)
		let roles = await client.servers.fetchReactionRoles(reaction.message.guild)
		if(roles.filter(role=> role.emoteID.includes(reaction.emoji.id || reaction.emoji.name)).length < 1) return;
		let guild = await reaction.message.guild.fetch()
		let role = roles.filter(role=> role.emoteID.includes(reaction.emoji.id || reaction.emoji.name))[0]
		let member = await guild.members.fetch(user.id)
		let rr = await guild.roles.fetch(role.roleID)

		if(rr) {
			const userReactions = reaction.message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));

			try {// @ts-ignore
				for (const reaction of userReactions.values()) {
					await reaction.users.remove(user.id);
				}
			} catch (error) {
				return console.log('Failed to remove reactions.');
			}

			try {
				if(member.roles.cache.has(rr.id)){
					await member.roles.remove(rr)
				}else{
					await member.roles.add(rr)
				}
			} catch (e: any) {
				if(e.message == 'Missing Permissions'){
					reaction.message.channel.send('Missing Permissions. Try hoisting the Helios role higher on the role tree')
				}
			}
		}
	}
}
