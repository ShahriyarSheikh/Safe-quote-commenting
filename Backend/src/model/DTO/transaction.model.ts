export class Transaction {
    txHash: string;
    userId: string;
    to: string;
    from: string;
    amount: number;
    silentChecker : boolean;
    noRetry: Boolean;
}