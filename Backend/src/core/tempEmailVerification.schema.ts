import { Schema, model } from "mongoose";

export var TempEmailVerification: Schema = new Schema({
    username : String ,
    token: String,
    expireAt: {
        type: Date,
        required: true
    },
    isTokenVerified : Boolean ,
    
});

TempEmailVerification.index({ expireAt : 1}, { expireAfterSeconds : 0 });

export const TempUserDB = model("TempEmailVerification", TempEmailVerification);
