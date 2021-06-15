import { SettingDB } from "../core/setting.schema";
import { Service } from "typedi";



@Service()
export class SettingRepository {
    async getAllSetting() {
        return await SettingDB.find().lean();
    }
    async getValueByName(name: string) {
        return await SettingDB.findOne({name:name}).lean();
    }

}
