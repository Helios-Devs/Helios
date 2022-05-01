import { ping } from './utility/ping'
import { help } from "./utility/help";
import { ban } from "./moderation/ban";
import { purge } from "./moderation/purge";
import { reactions } from "./utility/reactions";

export const commands: Command[] = [
    ping,
    help,
    ban,
    purge,
    reactions
]

export interface Command {
    name: string,
    alias: string[],
    desc: string,
    category: string,
    args: any[],
    data: any,
    perms: any[],
    bPerms: any[],
    execute: Function,
    slashExecute: Function
}
