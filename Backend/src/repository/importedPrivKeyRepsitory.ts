import { Service } from "typedi";
import { importedPrivKeyDB } from "../core/importedPrivKey.schema";
import { PrivKeyDetails } from "../model/DTO/privKeyDetail.model";

@Service()

export class importedPrivKeyRepsitory {

    public async findPrivateKeyByAccountAsync (account : string) : Promise<any>{
        return <any> await importedPrivKeyDB.findOne({accountName: account});
    }

    public async updateAsync(model: PrivKeyDetails): Promise<boolean> {
        return await importedPrivKeyDB.updateOne({ _id: model._id }, model).then(() => true).catch(() => false);
    }

    public async saveAsync(model: PrivKeyDetails): Promise<string | false> {
        return await new importedPrivKeyDB(model).save().then((res) => res._id).catch((err) => console.log(err));
    }
}