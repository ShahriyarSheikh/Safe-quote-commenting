import { Schema, model } from "mongoose";
import { SecurityHelper } from "../common/security.helper";


type Comments= { id: string, content: string }

export  var BlogDetails: Schema = new Schema({
    title:String,
    details:String,
    author:String,
    comments:Object,
});

export const BlogDetailsDB = model("blogdetails",BlogDetails)