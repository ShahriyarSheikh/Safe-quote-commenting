import { IsEmail, IsDefined, IsEnum, Matches } from "class-validator";
import { Gender } from "../../../enums/gender.enum";

export class UserRegister {

    @IsDefined()
   private _username: string;
   get username() : string{
       return this._username;
   } 
     set username(name : string) {
         this._username = name.toLowerCase();
     }

    @IsEmail()
    private _email: string;
    get email() : string {
        return this._email;
    }
    set email(name : string) {
        this._email = name.toLowerCase();
    }

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

    @IsDefined()
    @Matches(/^((?=(.*[A-Z]){1})(?=(.*[0-9]){1})(?=.*[a-zA-Z0-9])).{8,}$/)
    password: string;
}