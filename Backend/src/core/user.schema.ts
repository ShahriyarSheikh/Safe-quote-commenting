import { Schema, model } from "mongoose";
import { SecurityHelper } from "../common/security.helper";

export var UserSchema: Schema = new Schema({
    email: { type: String, unique: true },
    username: { type: String, unique: true },
    fullname: String,
    dob: String,
    gender: String,
    isEmailVerified : Boolean,
    isUserBlocked: Boolean,
    city: String,
    phoneNumber: String,
    profileImg: String,
    isWalletCreated:Boolean,
    facebookId: String,
    userSecrets: {
        hash: String,
        salt: String
    }
});

SecurityHelper.MongoSchemaEncryptPlugin(UserSchema, ["userSecrets.hash", "userSecrets.salt"]);

export const UserDB = model("Users", UserSchema);
