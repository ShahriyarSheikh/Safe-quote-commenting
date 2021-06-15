import { Schema, model } from "mongoose";

export var TxRecord: Schema = new Schema({
    txid: { type: String, unique: true },
    blocktime: Number,
    confirmations: Number,
    blockhash: String,
    blockindex: Number,
    cryptoTransactions:[
        {
            address:  String,
            category:  String,
            amount: Number,
            vout: Number,
            fee: Number,
            isBalance: Boolean
        }
    ]
});

export const TxRecordsDB = model("TxRecord", TxRecord);