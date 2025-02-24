import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

const WalletConnect = () => {
    const [account, setAccount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('');

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                setStatus('Please install MetaMask!');
                return;
            }

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            setAccount(accounts[0]);
            setStatus('Wallet connected!');
        } catch (error) {
            setStatus('Error connecting wallet: ' + error.message);
        }
    };

    const sendTransaction = async (e) => {
        e.preventDefault();
        if (!account || !recipient || !amount) {
            setStatus('Please fill all fields and connect wallet');
            return;
        }

        try {
            setStatus('Creating transaction...');

            const transaction = {
                from: account,
                to: recipient,
                amount: parseFloat(amount),
                timestamp: Date.now(),
                nonce: Math.random().toString(36).substring(7)
            };

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const message = JSON.stringify(transaction);
            const signature = await signer.signMessage(message);

            const response = await axios.post('http://localhost:3000/transaction', {
                transaction,
                signature
            });

            setStatus('Transaction sent! Server response: ' + JSON.stringify(response.data));
            setRecipient('');
            setAmount('');
        } catch (error) {
            setStatus('Error: ' + error.message);
        }
    };

    return (
        <div className="wallet-connect">
            <div className="wallet-status">
                {account ? (
                    <p>Connected: {account}</p>
                ) : (
                    <button onClick={connectWallet}>Connect Wallet</button>
                )}
            </div>

            <form onSubmit={sendTransaction}>
                <div>
                    <input
                        type="text"
                        placeholder="Recipient Address"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={!account}>
                    Send Transaction
                </button>
            </form>

            <div className="status">
                {status && <p>{status}</p>}
            </div>
        </div>
    );
};

export default WalletConnect; 