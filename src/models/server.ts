import { Schema, model, Number } from 'mongoose';

interface serverInterface {
	id: string
	loggingChannelID: string
	muteRoleID: string
	reactionRoles: any[]
	scamBan: boolean
}

const serverSchema = new Schema<serverInterface>({
	id: String,
	loggingChannelID: String,
	muteRoleID: String,
	reactionRoles: [],
	scamBan: false
});

export let server = model<serverInterface>('Servers', serverSchema);
