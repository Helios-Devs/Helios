import { Event } from "./index";
import { } from "discord.js";
import { customClient } from "../index";


export let discordJSEvent: Event = {
	name: 'discordJSEvent',
	once: false,
	execute: async (eventArgs, client: customClient) => {
	}
}
