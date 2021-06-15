import { Schema, model } from "mongoose";
import { SecurityHelper } from "../common/security.helper";

export var WalletSecret: Schema = new Schema({
    userId:String,
    accountName: {type:String},
    walletAddress: { type: String},
    isWalletActiveForUser:Boolean
});

// SecurityHelper.MongoSchemaEncryptPlugin(WalletSecret, ["walletAddress"]);
export const WalletSecretDB = model("walletsecret", WalletSecret);
