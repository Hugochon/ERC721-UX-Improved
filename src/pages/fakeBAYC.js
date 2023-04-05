import Web3 from 'web3'
import contract from '../../build/FakeBAYC.json'
import { IpfsImage } from 'react-ipfs-image'
import { useState, useEffect,useRef } from 'react'

import styles from '../styles/fakeBAYC.module.css'
import Header from './header'

export default function fakeBAYC(){

    const [contractInstance, setContractInstance] = useState(null);
    const [supply, setSupply] = useState(0);
    const [name, setName] = useState("");

    const [userInput, setUserInput] = useState("");

    const [nftOwned, setNftOwned] = useState([]);

    const [showNFTOwned, setShowNFTOwned] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const [image, setimage] = useState("");
    const [attributes, setAttributes] = useState([]);

    async function Sepoliaconnect() {
        const eth = window.ethereum
        await eth.request({ method: "eth_requestAccounts" }).then(() => console.log("Connected to MetaMask")); 
        const web3 = new Web3(eth)
        const accounts = await web3.eth.getAccounts()
        const chainId = await web3.eth.getChainId()
        return {account:accounts[0], chainId}
    }

    useEffect(() => {
        async function connectContract() {
          if (typeof window.ethereum !== "undefined") {
            const web3 = new Web3(window.ethereum);
            const contractAddress =
              "0x1dA89342716B14602664626CD3482b47D5C2005E";
            const instance = new web3.eth.Contract(contract, contractAddress);
            setSupply(await instance.methods.totalSupply().call());
            setName(await instance.methods.name().call());
            setContractInstance(instance); // Update contractInstance using the setter function
          } else {
            console.log("MetaMask is not installed or not connected");
          }
        }  
    connectContract();
    }, []);

    function handleSubmit(event) {
        event.preventDefault(); // Prevent form submission
        const web3 = new Web3(window.ethereum);
        if ((userInput).toString().length<4) { // Check if input is a number
        // Code to execute if input is a number
        console.log("Input is a number:", userInput);
        TokenInfo(userInput);
        } else if (web3.utils.isAddress(userInput)) { // Check if input is an Ethereum address
        // Code to execute if input is an Ethereum address
        console.log("Input is an Ethereum address:", userInput);
        listNFT();
        } else { // Input is neither a number nor an Ethereum address
        alert("Invalid input. Please enter a number or an Ethereum address.");
        }
    }
    async function TokenInfo() {
        setShowNFTOwned(false);
        let data = await contractInstance.methods.tokenURI(userInput).call();
        const jsonURI = await fetch(data).then((res) => res.json());
        setAttributes(JSON.stringify(jsonURI.attributes));
        setimage(jsonURI.image);
        setShowInfo(true);
    }

    async function listNFT() {
        setShowInfo(false);
        setNftOwned([]);
        const web3 = new Web3();
        let balanceOf = await contractInstance.methods.balanceOf(userInput).call();
        if(balanceOf == 0) {
            alert("No NFTs owned by this address");
        }
        else {
            for(let i = 0;i<balanceOf;++i) {
                let nftID = await contractInstance.methods.tokenOfOwnerByIndex(userInput, i).call();
                let data = await contractInstance.methods.tokenURI(nftID).call();
                const jsonURI = await fetch(data).then((res) => res.json());
                setNftOwned(nftOwned => [...nftOwned, [nftID, jsonURI.image]]);      
            }
        }
        setShowNFTOwned(true);
    }

    //drag the listNFT functions here

    const [startPosition, setStartPosition] = useState(0);
    const [endPosition, setEndPosition] = useState(0);
    const [mouseDelta, setMouseDelta] = useState(0);

    const [isDragging, setIsDragging] = useState(false);

    const nftOwne = useRef(null);
    

    const [color, setColor] = useState('red');


    const handleOnMouseDown = (event) => {
        setStartPosition(event.clientX);
        setIsDragging(true);

        if(showNFTOwned===true) {
        
        }
    };

    const handleOnMouseMove = (event) => {
        if (isDragging===true && showNFTOwned===true) {
            const maxDelta = window.innerWidth/2;
            let percentage = (event.clientX - startPosition) / maxDelta * 100;
            percentage = percentage + endPosition;
            
            percentage = Math.min(percentage, 0);
            percentage = Math.max(percentage, -100);
            setMouseDelta(percentage);

            let nft = document.querySelector(`.${styles.listNFT}`);
            nft.style.setProperty('--translationX', mouseDelta+'%');

        }
    };

    const handleOnMouseUp = (event) => {
        setEndPosition(mouseDelta);
        setIsDragging(false);
        
    };

    return(

        <div className={styles.backgroundImage} onMouseDown={handleOnMouseDown} onMouseMove={handleOnMouseMove} onMouseUp={handleOnMouseUp}>
            
        <div className={styles.container}>
            <div className={styles.header}>
                <Header />
            </div>

            <div className={styles.collectionInfo}>
                <h2><u>Collection Name</u> : {name}</h2>
                <p>Total Supply : {supply}</p>
                <div className={styles.claimNFT}>

                Click to claim a brand new NFT !
                <button className={styles.submit} onClick={async () => {
                const result= await Sepoliaconnect()
                const account=result.account
                await contractInstance.methods.claimAToken().send({ from: account })
                }}>Claim a Token</button>

                </div>
            </div>
            
            <div className={styles.tokenInfo}>
                <u>Enter the ID of the NFT you want to get info about (between 0 and {supply})</u>
                <form className={styles.forms} onSubmit={handleSubmit}>
                    <label className={styles.label}>
                        ID :
                        <input className={styles.input} type="text" value={userInput} onChange={e => setUserInput(e.target.value)} />
                    </label>
                    <br />
                    <button className={styles.submit} type="submit">Get Info</button>
                </form>
            </div>
            <div className={styles.attributes} style={{  "--borderWidth" : showInfo ? "1px" : 0}}>
                {showInfo && (
                    <div>
                       <p className={styles.title}>Attributes :</p>
                        <p>{attributes}</p>
                        </div>
                    )}
            </div>
            <div className={styles.image}>
                {showInfo && (
                    <div>
                        <p><IpfsImage className={styles.ipfsImage} hash={image}></IpfsImage> </p>
                    </div>     
                )}
            </div>

                {showNFTOwned && (
                    <div className={styles.listNFT}>
                        {nftOwned.map((nft) => (
                            <div ref={nftOwne}>
                                <p><IpfsImage className={styles.nftOwned} hash={nft[1]} draggable="false"></IpfsImage> </p>
                                <p>Token ID : {nft[0]}</p>
                            </div>
                            ))
                        }
                    </div>
                )} 

            <div className={styles.empty3}>
            </div>
    </div>
    </div>
    )
}