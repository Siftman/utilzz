// reduce 
// some
// forEach

class Transaction {
    constructor(inputUTXOs, outputUTXOs) {
        this.inputUTXOs = inputUTXOs;
        this.outputUTXOs = outputUTXOs;
    }
    execute() {
        var inputUtxoSum = 0;
        var outputUtxoSum = 0;

        const anySpent = this.inputUTXOs.some((x) => x.spent);
        if (anySpent) {
            throw new Error('There is an already spent UTXO');
        }

        const inputAmount = this.inputUTXOs.reduce((p, c) => {
            return p + c.amount;
        }, 0);

        const outputAmount = this.outputUTXOs.reduce((p, c) => {
            return p + c.amount;
        }, 0);

        if (inputAmount < outputAmount) {
            throw new Error('aggregated input amount is less than the aggregated output amount')
        }
        for (const input of this.inputUTXOs) {
            input.spent = true;
        }
        
        this.inputUTXOs.forEach((utxo) => {
            utxo.spend();
        });

        this.fee = inputAmount - outputAmount;

    }
}