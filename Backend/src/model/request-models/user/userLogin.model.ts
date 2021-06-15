import { IsDefined, Matches } from "class-validator";

export class UserLogin {
    @IsDefined()
    private _username: string;
    get username(): string {
        return this._username;
    }
    set username(name: string) {
        this._username = name.toLowerCase();
    }

    @IsDefined()
    @Matches(/^((?=(.*[A-Z]){1})(?=(.*[0-9]){1})(?=.*[a-zA-Z0-9])).{8,12}$/)
    password: string;
    token: string;
}