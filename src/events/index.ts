import { interactionCreate } from "./interaction/interactionCreate";
import { messageCreate } from "./message/messageCreate";
import { messageReactionAdd } from "./message/messageReactionAdd";


export const events: Event[] = [
	messageCreate,
	messageReactionAdd,
	interactionCreate
]

export interface Event {
	name: string,
	once: boolean,
	execute: Function
}
