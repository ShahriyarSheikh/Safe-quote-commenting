import {IsDefined , IsEmail, IsEnum } from "class-validator";
import { Gender } from "../../../enums/gender.enum";

export class UserUpdateProfile {
    @IsDefined()
    fullname: string;

    @IsDefined()
    dob: string;

    @IsEnum(Gender)
    gender: string;

    @IsDefined()
    city: string;

    @IsDefined()
    phoneNumber: string;

    @IsEmail()
    private _email: string;
    get email() : string {
        return this._email;
    }
    set email(name : string) {
        this._email = name.toLowerCase();
    }
}

