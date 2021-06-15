import { IsEmail } from "class-validator";

export class UserForgotPassword {
    @IsEmail()
    private _email: string;
    get email(): string {
        return this._email;
    }
    set email(name: string) {
        this._email = name.toLowerCase();
    }
}