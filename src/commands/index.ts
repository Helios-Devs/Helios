import { ping } from './utility/ping';
import { help } from './utility/help';
import { ban } from './moderation/ban';
import { purge } from './moderation/purge';
import { reactions } from './utility/reactions';
import { kick } from './moderation/kick';
import { eightball } from "./fun/8ball";
import { userinfo } from "./utility/userinfo";
import { cat } from './fun/cat';

export const commands: Command[] = [
	ping,
	help,
	kick,
	ban,
	purge,
	reactions,
	eightball,
	userinfo,
	cat
];

export interface Command {
	name: string;
	alias: string[];
	desc: string;
	category: string;
	args: any[];
	data: any;
	perms: any[];
	bPerms: any[];
	execute: Function;
	slashExecute: Function;
}
