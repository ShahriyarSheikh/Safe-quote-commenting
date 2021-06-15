import { Schema, model } from "mongoose";
import { SecurityHelper } from "../common/security.helper";


export var ImportedPrivKey: Schema = new Schema({
    accountName: { type: String, unique: true },
    privKey: { type: String },
    address: { type: String },
    pubKey: { type: String },
    seedPhrase: { type: String }
});

SecurityHelper.MongoSchemaEncryptPlugin(ImportedPrivKey, ["privKey", "seedPhrase"]);
export const importedPrivKeyDB = model("importedPrivKeys", ImportedPrivKey);