import { Schema, model } from "mongoose";

export var SettingSchema: Schema = new Schema({
    name: String,
    value: String,
});


export const SettingDB = model("settings", SettingSchema);