import { Schema, model } from "mongoose";

export var PushToken: Schema = new Schema({
    userId: { type: String, unique: true },
    token: { type: String }
});

export const pushToken = model("pushTokens", PushToken);