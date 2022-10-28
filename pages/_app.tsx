import '@rainbow-me/rainbowkit/styles.css'
import '@zoralabs/zord/index.css'
import 'styles/global.css'
import 'react-toastify/dist/ReactToastify.css';
import 'degen/styles'

import { getDefaultWallets, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig, allChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { ThemeProvider } from 'degen'
import ERC721DropContractProvider from 'providers/ERC721DropProvider'
import { ToastContainer } from 'react-toastify';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { AppWrapper } from 'context/useAppContext';

const { chains, provider } = configureChains(
  [
    allChains.find(
      (chain) => chain.id.toString() === process.env.NEXT_PUBLIC_CHAIN_ID
    )
  ],
  [ 
    alchemyProvider({ apiKey: "ezyXM9BT43gERc4t37pvrR29sDYX81Ph" }),
    publicProvider()
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'Zora Create',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

function App({ Component, pageProps }) {
  return (
    <ThemeProvider defaultMode="dark" defaultAccent="yellow">
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          theme={lightTheme({
            accentColor: '#fe0200',
            borderRadius: 'small',
          })}
          modalSize="compact"
        >
          <AppWrapper>
            <Component {...pageProps} />
          <ToastContainer />
          </AppWrapper>
          
        </RainbowKitProvider>
      </WagmiConfig>    
    </ThemeProvider>
  )
}

export default App
