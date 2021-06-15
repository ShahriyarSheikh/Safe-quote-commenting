import { Schema, model } from "mongoose";
import { SecurityHelper } from "../common/security.helper";

export var Feedback: Schema = new Schema({
    userId:String,
    username: String,
    fullname: String,
    email: String,
    phone: String,
    comments: String,
});


export const FeedBackDB = model("feedback", Feedback);