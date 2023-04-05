import { useState, useEffect} from 'react'
import Web3 from 'web3'
import contract from '../../build/FakeMeebitsClaimer.json'
import sig from '../../claimerV1-tools/output-sig.json'
import Header from './header'
import styles from '../styles/fakeMeebits.module.css'

async function Sepoliaconnect() {
    const eth =window.ethereum
    await eth.request({ method: "eth_requestAccounts" }).then(() => console.log("Connected to MetaMask"));
    const web3 = new Web3(eth)
    const accounts = await web3.eth.getAccounts()
    const chainId = await web3.eth.getChainId()
    return {account:accounts[0], chainId}
  }


function fakeMeebits() {

    const [contractInstance, setContractInstance] = useState(null);
    
    const [tokenNB, setTokenNB] = useState(0)

    const [showInfo, setShowInfo] = useState(false);

    const [image, setimage] = useState("");
    const [attributes, setAttributes] = useState([]);
    const [name, setName] = useState("");

    useEffect(() => {
        async function connectContract() {
            if (typeof window.ethereum !== "undefined") {
                const web3 = new Web3(window.ethereum);
                const contractAddress = "0x5341e225Ab4D29B838a813E380c28b0eFD6FBa55";
                const contractInstance = new web3.eth.Contract(contract, contractAddress);
                setContractInstance(contractInstance); 
            } else {
                console.log("MetaMask is not installed or not connected");
            }
        }
        connectContract();
    }, []);

    async function SelectYourToken(tokenNB) {

        setTokenNB(parseInt(tokenNB)) 
        let test = await contractInstance.methods.tokensThatWereClaimed(tokenNB).call()
        if(test == true){
            alert("This NFT has already been claimed")
        }
        else{
            const result= await Sepoliaconnect()
            const account=result.account
            const _signature = sig[tokenNB].signature; 
            await contractInstance.methods.claimAToken(tokenNB, _signature).send({ from: account})  
        }
    }

    function handleChange(event) {
        setTokenNB(event.target.value);
    }
    function handleSubmit(event) {
        console.log(typeof(tokenNB))
        event.preventDefault();
        console.log('Form submitted with text:', tokenNB);
        SelectYourToken(tokenNB)
    }

return (
<div>

    <div className={styles.container}>

            <img className={styles.background} src="./Hugochon._bear_market_vs_bull_run_with_an_Richard_Orlinski_styl_b3b38ddb-7b81-410d-ba22-ea371ba633df.png"/>
         
            <div className={styles.header}>
                <Header />
            </div>

            <div className={styles.main}>
    
                <p className={styles.title}>Claim your Fake Meebits</p>

                <form className={styles.forms} onSubmit={handleSubmit}>
                    <label className={styles.label}>
                        ID :
                        <input className={styles.input} type="number" value={tokenNB} onChange={e => setTokenNB(e.target.value)} />
                    </label>
                    <br />
                    <button className={styles.submit} type="submit">Mint the token !</button>
                </form>
            </div>

            <div className={styles.empty1}>
                The objective of this page is to mint a Fake Meebit NFT directly in your Wallet. You just have to enter the ID of the Meebit you want, and if it is not minted yet, you can claim it yourself ! <br />
            </div>
            <div className={styles.empty2}>
            </div>
            
    </div>
          

</div>
)
}

export default fakeMeebits