import { TempUserDB } from "../core/tempEmailVerification.schema";
import { Service } from "typedi";
import { TempEmailVerify } from "../model/DTO/tempUser.model";


@Service()
export class VerifyRepository {

    public async findUserByTokenAsync(token: string): Promise<TempEmailVerify> {
        return <any>await TempUserDB.findOne({ token: token });
    }

    public async saveTokenAsync(model: TempEmailVerify): Promise<boolean> {
        return await new TempUserDB(model).save().then(() => true).catch((err) => { console.log(err); return false });
    }

    public async deleteTempTokenAsync(userId: string): Promise<boolean> {
        return <any>await TempUserDB.findByIdAndDelete({ _id: userId });
    }
    public async updateAsync( user_name: string ,model: TempEmailVerify): Promise<boolean> {
        return await TempUserDB.updateOne({ username: user_name }, model).then(() => true).catch(() => false);
    }
}

