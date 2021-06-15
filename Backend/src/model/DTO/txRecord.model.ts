export class TxRecord {
    txid: string;
    blocktime: number;
    confirmations: number;
    blockhash: string;
    blockindex: number;
    cryptoTransactions: TxPayment[];
}

export class TxPayment {
    address:  string;
    category:  string;
    amount: number;
    vout: number;
    fee: number;
    isBalance: Boolean;
}