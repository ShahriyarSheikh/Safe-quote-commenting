import { Service } from "typedi";
import { SettingRepository } from "../repository/settingRepository";
import { Settings } from "../model/DTO/setting.model";


@Service()
export class SettingService {

    constructor(private settingRepository: SettingRepository) {

    }

    public async getWalletSettings() {
        var walletSettings: Array<any> = await this.settingRepository.getAllSetting();
        let response: Array<Settings> = new Array();
        walletSettings.forEach(item => {
            response.push({
                name: item.name,
                value: item.value
            });
        });
        return response;
    }
}

