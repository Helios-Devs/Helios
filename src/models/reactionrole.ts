import { Schema, model } from 'mongoose';

interface reactionRoleInterface {
  messageID: string;
  roleID: string;
  emoteID: string;
}

const reactionSchema = new Schema<reactionRoleInterface>({
  messageID: String,
  roleID: String,
  emoteID: String
});

export const reactionRole = model<reactionRoleInterface>('ReactionRoles', reactionSchema);
