import { Schema, model, Number } from 'mongoose';

export interface serverInterface {
	id: string
	loggingChannelID: string
	appealChannel: string
	muteRoleID: string
	reactionRoles: any[]
	scamBan: boolean
}

const serverSchema = new Schema<serverInterface>({
	id: String,
	loggingChannelID: String,
	appealChannel: String,
	muteRoleID: String,
	reactionRoles: [],
	scamBan: false
});

export let server = model<serverInterface>('Servers', serverSchema);
