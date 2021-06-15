import {IsDefined, Matches } from "class-validator";

export class UserChangePassword {
    @IsDefined()
    @Matches(/^((?=(.*[A-Z]){1})(?=(.*[0-9]){1})(?=.*[a-zA-Z0-9])).{8,}$/)
    oldPassword: string;
    
    @IsDefined()
    @Matches(/^((?=(.*[A-Z]){1})(?=(.*[0-9]){1})(?=.*[a-zA-Z0-9])).{8,}$/)
    newPassword: string;
}