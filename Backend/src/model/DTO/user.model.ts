
export class User {
    _id: string;
    facebookId : string;
    email: string;
    username: string;
    fullname: string;
    dob: string;
    gender: string;
    city: string;
    isEmailVerified : boolean;
    isUserBlocked:boolean;
    phoneNumber: string;
    profileImg: string;
    isWalletCreated:boolean;
    userSecrets: {
        hash: string,
        salt: string
    }
}


    