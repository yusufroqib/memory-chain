'use client'

import * as React from 'react'
import {
  GetSiweMessageOptions,
  RainbowKitSiweNextAuthProvider,
} from '@rainbow-me/rainbowkit-siwe-next-auth'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { Chain, RainbowKitProvider, connectorsForWallets, darkTheme } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  trustWallet,
  coinbaseWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { mainnet, hardhat } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

const celoAlfajores: Chain = {
  id: 0xaef3,
  name: 'Alfajores Testnet',
  network: 'ALFA',
  iconUrl: 'https://cryptologos.cc/logos/celo-celo-logo.svg?v=032',
  iconBackground: '#000000',
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18,
  },
  rpcUrls: {
    public: { http: ['https://alfajores-forno.celo-testnet.org'] },
    default: { http: ['wss://alfajores-forno.celo-testnet.org/ws'] },
  },
  blockExplorers: {
    default: { name: 'Alfajoresscan', url: 'https://alfajores.celoscan.io' },
    etherscan: { name: 'Alfajoresscan', url: 'https://alfajores.celoscan.io' },
  },
  testnet: true,
}
const celoMainnet: Chain = {
  id: 42220,
  name: 'Celo Mainnet',
  network: 'celo',
  iconUrl: 'https://cryptologos.cc/logos/celo-celo-logo.svg?v=032',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'CELO',
    symbol: 'CELO',
  },
  rpcUrls: {
    public: { http: ['https://forno.celo.org'] },
    default: { http: ['wss://forno.celo.org/ws'] },
  },
  blockExplorers: {
    default: { name: 'Celoscan', url: 'https://celoscan.io' },
    etherscan: { name: 'Celoscan', url: 'https://celoscan.io' },
  },
  testnet: false,
}

const { chains, publicClient } = configureChains(
  [mainnet, celoMainnet, celoAlfajores, hardhat],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID as string }), publicProvider()]
)

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      coinbaseWallet({ appName: 'Coinbase', chains }),
      rainbowWallet({ projectId, chains }),
    ],
  },
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

const demoAppInfo = {
  appName: 'Dapp Funds dApp',
}

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: `
  Once you're signed in, you'll be able to access all of our dApp's features.
  Thank you for partnering with CrowdFunding!`,
})

export function Providers({
  children,
  pageProps,
}: {
  children: React.ReactNode
  pageProps: {
    session: Session
  }
}) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  return (
    <WagmiConfig config={wagmiConfig}>
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
          <RainbowKitProvider theme={darkTheme()} chains={chains} appInfo={demoAppInfo}>
            {mounted && children}
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  )
}
