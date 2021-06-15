import { UserPayload } from '../model/DTO/userPayload.model';
import { Schema } from "mongoose";
import * as Jwt from 'jsonwebtoken';
import * as encrypt from 'mongoose-encrypt';
import * as crypto from 'crypto';
export class SecurityHelper {

    public static createToken(payload: UserPayload): string {
        let _secret = <string>process.env.JWT_SECRET;
        return Jwt.sign(payload, _secret, {
            expiresIn: process.env.JWT_EXPIRES
        });
    }

    public static validateToken(token: string): UserPayload {
        let _secret = <string>process.env.JWT_SECRET;
        try {
            return <UserPayload>Jwt.verify(token.startsWith("Bearer") ? token.split("Bearer ")[1] : token, _secret);
        } catch (error) {
            return null;
        }
    }

    public static MongoSchemaEncryptPlugin(MongoSchema: Schema, encryptedProperties: Array<string>): void {
        MongoSchema.plugin(encrypt, {
            paths: encryptedProperties,
            password: () => process.env.MONGO_ENCRYPTION_PASSWORD
        });
    }

}