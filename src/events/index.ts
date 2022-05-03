import { messageCreate, messageReactionAdd } from './message/';
import { slashInteraction, buttonInteraction } from './interaction/';
import { ready } from './client/ready';
//import { counting } from './counting';

export const events: Event[] = [
  ready,
  messageCreate,
  messageReactionAdd,
  slashInteraction,
  buttonInteraction
  //counting
];

export interface Event {
  name: string;
  once: boolean;
  execute: Function;
}
