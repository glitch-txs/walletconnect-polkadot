import styles from '../styles/Home.module.css'
import UniversalProvider from '@walletconnect/universal-provider'
import { Web3Modal } from '@web3modal/standalone'
import { useEffect, useState } from 'react'

const web3modal = new Web3Modal({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
  walletConnectVersion: 2
})

export default function Home() {

  const [provider, setProvider] = useState<any>()

  async function initWC (){
    const provider = await UniversalProvider.init({
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      metadata: {
        name: document.title,
        description: document?.querySelector('meta[name="description"]')?.textContent ?? "",
        url: `${window.location.href}`,
        icons: [`${window.location.href}favicon.ico`],
      },
    })
    setProvider(provider)
    console.log("universal provider: ", provider)
  }

  async function connectWC(){
    if(!provider)
    throw Error('error, provider is undefined')
      
    const params = {
      requiredNamespaces: {
        polkadot: {
          methods: ['polkadot_signTransaction', 'polkadot_signMessage'],
          chains: [
            'polkadot:91b171bb158e2d3848fa23a9f1c25182',
            'polkadot:b0a8d493285c2df73290dfb7e61f870f',
            'polkadot:e143f23803ac50e8f6f8e62695d1ce9e'
        ],
          events: ['chainChanged", "accountsChanged']
        }
      }
    }

    const { uri, approval } = await provider.client.connect(params)

    // if there is a URI from the client connect step open the modal
    if (uri) {
      web3modal.openModal({ uri })
      console.log("uri: ", uri)
    }
    // await session approval from the wallet app
    const walletConnectSession = await approval()

    console.log("walletConnectSession: ", walletConnectSession)

    const walletConnectAccount = Object.values(walletConnectSession.namespaces)
    .map((namespace: any) => namespace.accounts)
    .flat()
    console.log("walletConnectAccount: ",walletConnectAccount)

    // grab account addresses from CAIP account formatted accounts
    const accounts = walletConnectAccount.map(wcAccount => {
      const address = wcAccount.split(':')[2]
      return address
    })

    console.log("accounts: ",accounts)
  }

  function disconnectWC(){
    if(provider?.session){
      provider.disconnect()
    }
  }

  useEffect(()=>{
    initWC()
  },[])

  return (
    <main className={styles.main}>
      <button onClick={connectWC} >Connect</button>
      <button onClick={disconnectWC} >disconnect</button>
    </main>
  )
}

