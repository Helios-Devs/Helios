import { messageCreate, messageReactionAdd } from "./message/";
import { slashInteraction, buttonInteraction } from "./interaction/";
import { ready } from "./client/ready";

export const events: Event[] = [
	ready,
	messageCreate,
	messageReactionAdd,
	slashInteraction,
	buttonInteraction
]

export interface Event {
	name: string,
	once: boolean,
	execute: Function
}
