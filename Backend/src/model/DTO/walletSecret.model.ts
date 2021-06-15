import { ObjectId } from "mongodb";

export class WalletSecret{
    userId:string;
    accountName:string;
    walletAddress:string;
    isWalletActiveForUser:boolean;
}