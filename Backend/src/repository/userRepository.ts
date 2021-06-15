import { UserDB } from "../core/user.schema";
import { Service } from "typedi";
import { User } from "../model/DTO/user.model";
import { FeedBackDB } from "../core/feedBack.schema";
import { FeedBack } from "../model/DTO/feedback.model";


@Service()
export class UserRepository {
    public async saveAsync(model: User): Promise<string | false> {
        return await new UserDB(model).save().then((res) => res._id).catch(() => false);
    }

    public async updateAsync(model: User , user_name : string ): Promise<boolean> {
        return await UserDB.updateOne({username : user_name }, model).then(() => true).catch(() => false);
    }

    public async findUserByEmailAsync(email: string): Promise<User> {
        return <any>await UserDB.findOne({ email: email });
    }

    public async findUserByUsernameAsync(username: string): Promise<User> {
        return <any>await UserDB.findOne({ username: username });
    }

    public async findUserByIdAsync(userId : string): Promise<User> {
        return <any>await UserDB.findOne({ _id : userId });
    }
   
    public async findUserByUserIDAsync(userId : string): Promise<User> {
        return <any>await UserDB.findOne({facebookId : userId });
    }

    public async saveFeedBackAsync(model: FeedBack): Promise<boolean> {
        return await new FeedBackDB(model).save().then(() => true).catch(() => false);
    
}
}