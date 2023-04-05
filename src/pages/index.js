import Link from "next/link"
import styles from '../styles/Home.module.css'
import Header from './header'
import { useState , useEffect} from "react"
import Web3 from 'web3'

export default function Home() {
  
  const cards = [
    { href: '/', text: 'Home' },
    { href: '/fakeBAYC', text: 'FakeBAYC' },
    { href: '/fakeMeebits', text: 'FakeMeebits' },
    { href: '/fakeNefturians', text: 'FakeNeftufrians' },
    { href: '/contact', text: 'Contact' },
  ]

  const [hoveredCard, setHoveredCard] = useState(0);
  const [account, setAccount] = useState([]);
  const [chainID, setChainID] = useState(0);
  const [block, setBlock] = useState(0);

  const [isEnabled, setIsEnabled] = useState();

  async function Sepoliaconnect() {
    const eth = window.ethereum
    await eth.request({ method: "eth_requestAccounts" }).then(() => console.log("Connected to MetaMask"));
  
    const web3 = new Web3(eth)
    const accounts = await web3.eth.getAccounts()
    const chainId = await web3.eth.getChainId()
    const block= await web3.eth.getBlockNumber()
    
    return {account:accounts[0], chainId, block}
  }

  async function changeBlockain() {
    console.log('changeBlockain')

    const eth = window.ethereum
    const web3 = new Web3(eth)

    if (chainID !== 11155111) {
      try {
        await eth.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: web3.utils.toHex(11155111) }]
        });
      } catch (err) {
        if (err.code === 4902) {
          await eth.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: 'Sepolia Test Net',
                chainId: web3.utils.toHex(11155111),
                nativeCurrency: { name: 'SepoliaETH', decimals: 18, symbol: 'SepoliaETH' },
                rpcUrls: ['https://polygon-rpc.com/']
              }
            ]
          });
          chainId=11155111;
        }
      }
    }
  }

  useEffect(() => {
    handleFocus()
  }, []);
  useEffect(() => {
    // Attach event listener to detect when user returns to the website
    window.addEventListener('focus', handleFocus);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  async function handleFocus() {
    console.log('User returned to website');
    await Sepoliaconnect()
    .then((result) => {
      setAccount(result.account)
      setChainID(result.chainId)
      setBlock(result.block)   
    }
    )
  }

  useEffect(() => {
    console.log("chainID changed:", chainID);
    console.log("isEnabled", isEnabled);
    if (chainID === 11155111) {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  }, [chainID]);

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <Header />
      </div>

      <div className={styles.main}>

        {cards.map((card, index) => (
          
          <Link key={index} href={card.href} className={isEnabled ? '' : 'disabled'}>
            <p 
              className={`${styles.card} ${hoveredCard === index+1 ? styles.hovered : ''}`}
              onMouseEnter={() => setHoveredCard(index)}              
            >
              {card.text} &rarr;
            </p>
          </Link>
        ))}
            
        <div className={styles.image} style={{"--index" : hoveredCard}}></div>
      </div>

      <div className={styles.sepoliaHandle}>

        <div className={styles.sepoliaState}>
          {isEnabled ? ( <p>Connected to Sepolia :) </p> ) : ( <p>Not connected to Sepolia :( </p> )}
          <img src="/téléchargement.png" alt="logo" onClick={changeBlockain} />
        </div>

        <div className={styles.sepoliaInfos}>
          <p><u>Chain Info</u></p>
          <p><u>Account</u> : {account}</p>
          <p><u>ChainID</u> : {chainID}</p>
          <p><u>Latest Block</u> : {block}</p>
        </div>
      </div>

      <div className={styles.empty}>
        
      </div>
      <div className={styles.empty2}>
        
      </div>


    </div>
  )
}