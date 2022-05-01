import { Event } from "../index";
import { Client } from "discord.js";
import { customClient } from "../../index";
import { connect } from "mongoose";


export let ready: Event = {
	name: 'ready',
	once: false,
	execute: async (argclient: Client<true>, client: customClient) => {
		console.log(`${client.user?.tag} is ready!`)
		if(process.env.MONGO){
			client.db = await connect(process.env.MONGO)
			if(client.db.connection.readyState === 1) console.log('Database is ready!')
		}
	}
}
