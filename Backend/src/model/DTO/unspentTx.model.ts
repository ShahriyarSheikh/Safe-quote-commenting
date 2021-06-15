export class UnspentTx{
    txid:string;
    vout:number;
    address:string;
    scriptPubKey:string;
    amount:number;
    confirmations:number;
    spendable:true;
}

export class TxResponse {
    txid:string;
    err:string;
}