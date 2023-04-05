import React from "react";
import Web3 from 'web3'
import styles from '../styles/dashboard.module.css'
import Header from './header'
import { useState, useEffect,useRef } from 'react'

export default function Contact(){

    const [userInput, setUserInput] = useState("");
    const [showInfo, setShowInfo] = useState(false);
    const [bnbBalance, setBnbBalance] = useState(0);
    const [ethBalance, setEthBalance] = useState(0);

    // Replace with the contract addresses and ABIs of the tokens you want to check
    /*
    const tokens = [
    {
        address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        abi: [{"constant":true,"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}],
        symbol: 'BNB'
    },
    {
        address: '0x55d398326f99059ff775485246999027b3197955',
        abi: [{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"type":"function"}],
        symbol: 'USDT'
    },
    // Add more tokens here
    ];
    */
    // Create a new Web3 instance using the provider URL

    function handleSubmit(event) {
        event.preventDefault();
        ethInfo();
        daiInfo();
    }

    async function ethInfo() {
        const providerUrl = 'https://goerli.infura.io/v3/c16ef51c075847b7a3bf115d29615e3a';
        const web3 = new Web3(providerUrl);

        const balance = await web3.eth.getBalance(userInput);
        setEthBalance(balance*10**-18);
        console.log("ETH : " + ethBalance)
        setShowInfo(true);
    }
    async function daiInfo() {
  
        const providerUrl = 'https://goerli.infura.io/v3/c16ef51c075847b7a3bf115d29615e3a';
        const web3 = new Web3(providerUrl);

        const tokenAddress = '0xBa8DCeD3512925e52FE67b1b5329187589072A55';
        const balanceOfABI = [
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_owner",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "name": "balance",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
        ];

        const bnbContract = new web3.eth.Contract(balanceOfABI, tokenAddress);
        const bnbBalance = await bnbContract.methods.balanceOf(userInput).call();
        setBnbBalance(bnbBalance*10**-18);
        console.log("BNB : " + bnbBalance)
    }
    
    return(
        <div className={styles.container}>
            
            <div className={styles.header}>
                <Header />
            </div>
                
            <div className={styles.details}>
              
                <form className={styles.forms} onSubmit={handleSubmit}>
                    <label className={styles.label}>
                        ID : 
                        <input className={styles.input} type="text" value={userInput} onChange={e => setUserInput(e.target.value)} />
                    </label>
                    <br />
                    <button className={styles.submit} type="submit">Get Info</button>
                </form>
            </div>

            {showInfo && (
                <div className={styles.tokenList}>
                    <p>Wallet ID : {userInput}</p>
                    <p>Goerli Eth Balance : {ethBalance}</p>
                    <p>Goerli Dai Balance : {bnbBalance}</p>
                </div>
            )}

        </div>
    )
    
}