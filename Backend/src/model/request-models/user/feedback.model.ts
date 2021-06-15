import { IsDefined } from "class-validator";

export class UserFeedBack{
    @IsDefined()
    comments: string;
}
   