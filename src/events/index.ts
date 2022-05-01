import { interactionCreate } from "./interaction/interactionCreate";
import { messageCreate } from "./message/messageCreate";
import { messageReactionAdd } from "./message/messageReactionAdd";
import { ready } from "./client/ready";


export const events: Event[] = [
	ready,
	messageCreate,
	messageReactionAdd,
	interactionCreate
]

export interface Event {
	name: string,
	once: boolean,
	execute: Function
}
