import { UnspentTx } from "./unspentTx.model";

export class MatchedUnspentTx{
    change:number;
    listOfUnspentTx:UnspentTx[] = new Array();

}