import { useState, useEffect} from 'react'
import Web3 from 'web3'
import contract from '../../build/FakeNefturians.json'
import Header from './header'
import styles from '../styles/fakeNefturians.module.css'

function fakeNefturians() {

    const [contractInstance, setContractInstance] = useState(null);
    
    const [Name, setName] = useState("")
    const [price, setPrice] = useState(0)


    const [userAddress, setUserAddress] = useState("")
    const [NFTlist, setList] = useState([]);

    const [showInfo, setShowInfo] = useState(false) 

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
              "0x9bAADf70BD9369F54901CF3Ee1b3c63b60F4F0ED";
            const instance = new web3.eth.Contract(contract, contractAddress);
            setPrice(await instance.methods.tokenPrice().call()*1.0001*10**-18)
            setName(await instance.methods.name().call())
            setContractInstance(instance); // Update contractInstance using the setter function
          } else {
            console.log("MetaMask is not installed or not connected");
          }
        }  
    connectContract();
    }, []);

    async function UserInfo(userAddress) {    

        let number = await contractInstance.methods.balanceOf(userAddress).call();  
        let temp = [];

        if(number == 0){
            alert("This adress doesn't have any NFTs")
        }
        for( let i = 0; i < number; i++){
          
            let tempTokenId = await contractInstance.methods.tokenOfOwnerByIndex(userAddress,i).call(); 
            let URI = await contractInstance.methods.tokenURI(tempTokenId).call();
            let fetchUri = await fetch(URI).then(res => res.json());  
            temp.push([tempTokenId ,fetchUri.image, fetchUri.name]);
            
        }
        setList(temp);   
        setShowInfo(true)
    }

    function handleChange(event) {
        setUserAddress(event.target.value);
    }
    function handleSubmit(event) {
        if(Name!="Fake Nefturians"){
            alert("You need to connect to the contract first")
        }
        else{
            event.preventDefault();
            console.log('Form submitted with text:', userAddress);
            UserInfo(userAddress)
        }
    }

  return (

    <div className={styles.backgroundImage}>
    <div className={styles.container}>

        <div className={styles.header}>
            <Header/>
        </div>

        <div className={styles.collectionInfo}>
            <h2><u>Fake Nefturians</u></h2>
            <p>Name : {Name}</p>
            <p>Price : {price} ETH</p>
            
            <button className={styles.submit}onClick={async () => {
                const result= await Sepoliaconnect()
                const account=result.account
                await contractInstance.methods.buyAToken().send({ from: account, value: (price)*10**18})
            }}>Buy a Token</button>
        </div>

        <div className={styles.addressInfo}>
        
            <p><u>Get a specific user infos (enter the adress of the user)</u> </p>
            <form className={styles.forms} onSubmit={handleSubmit}>
            <textarea className={styles.input}onChange={handleChange}></textarea>
            <button className={styles.submit}type="submit">Submit</button>
            </form>

        </div>
        
            {showInfo && (

                <div className={styles.tokenList}>       
                        {NFTlist.map((item) => (
                            <div>
                                <img className={styles.token} src={item[1]}/>    
                                <p>ID #{item[0]}</p>    
                            </div>
                        ))}
                </div>
            
            )} 
            {showInfo && (

                <div className={styles.tokenInfo}> 
                    <h2><u>Token Info</u></h2> 
                    {NFTlist.map((item) => ( 
                        <div> 
                            <li>Token ID : {item[0]}</li> 
                            <p>Name : {item[2]}</p> 
                        </div> 
                    ))} 
                </div>
            )}
       
    </div>
    </div>
  )
}

export default fakeNefturians