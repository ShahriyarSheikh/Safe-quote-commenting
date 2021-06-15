import { Schema, model } from "mongoose";
import { SecurityHelper } from "../common/security.helper";

export var TempUserSession: Schema = new Schema({
    _id: String,
    token: String,
    expireAt: {
        type: Date,
        required: true
    }
});

TempUserSession.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
SecurityHelper.MongoSchemaEncryptPlugin(TempUserSession, ["token"]);
export const TempUserSessionDB = model("TempUserSession", TempUserSession);
