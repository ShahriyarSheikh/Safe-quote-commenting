//import * as Bcrypt from 'bcrypt';
var Bcrypt = require('bcryptjs');

export class HashHelper {

    public static salt(): string {
        return Bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT_ROUNDS));
    };

    public static hash(password: string, salt: string): string {
        return Bcrypt.hashSync(password, salt);
    };
}