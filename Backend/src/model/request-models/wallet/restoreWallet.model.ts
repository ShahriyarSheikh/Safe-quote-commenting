import {IsDefined } from "class-validator";

export class RestoreWallet {
    @IsDefined()
    seedPhrase: string;
}