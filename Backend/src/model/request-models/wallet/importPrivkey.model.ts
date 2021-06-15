import {IsDefined } from "class-validator";

export class ImportPrivKey {
    @IsDefined()
    privKey: string;
}