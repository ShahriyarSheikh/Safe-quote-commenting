import { TempUserSessionDB } from "../core/tempUserSessions.schema";
import { Service } from "typedi";
import { TempUserSession } from "../model/DTO/tempUserSession.model";


@Service()
export class TempUserSessionRepository {

    public async findUserSessionByIdAsync(userId: string): Promise<TempUserSession> {
        return <any>await TempUserSessionDB.findOne({ _id: userId });
    }

    public async saveUserSessionOrUpdateAsync(model: TempUserSession): Promise<boolean> {
        return await TempUserSessionDB.updateOne({ _id: model._id }, model, { upsert: true }).then(() => true).catch(() => false);
    }

    public async deleteUserSessionAsync(userId: string): Promise<boolean> {
        return <any>await TempUserSessionDB.findByIdAndDelete({ _id: userId }).then((res) => res != null).catch(() => false);
    }
}

