import { initDb } from '../lib/db';
import '@/styles/globals.css';
import { Orbis, OrbisProvider } from '@orbisclub/components';
import '@orbisclub/components/dist/index.modern.css';
import '@rainbow-me/rainbowkit/styles.css';
import React, { useEffect, useMemo } from 'react';
import { createConfig, WagmiProvider, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { ThemeProvider } from '../contexts/ThemeContext';
import Layout from '../components/Layout';
import { routes } from '../config/routes';
import { useRouter } from 'next/router';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  bsc,
  celo,
  scroll,
  linea,
  zkSync,
  mode,
  mantle,
  gnosis
} from 'wagmi/chains';

export const ORBIS_CONTEXT = 'kjzl6cwe1jw14b9pin02aak0ot08wvnrhzf8buujkop28swyxnvtsjdye742jo6';

const projectId = '37b5e2fccd46c838885f41186745251e';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Memoize configuration objects to prevent unnecessary re-renders
  const config = useMemo(() => {
    const chains = [
      mainnet,
      polygon,
      optimism,
      arbitrum,
      base,
      bsc,
      celo,
      scroll,
      linea,
      zkSync,
      mode,
      mantle,
      gnosis
    ];

    return createConfig({
      chains,
      transports: {
        [mainnet.id]: http(),
        [polygon.id]: http(),
        [optimism.id]: http(),
        [arbitrum.id]: http(),
        [base.id]: http(),
        [bsc.id]: http(),
        [celo.id]: http(),
        [scroll.id]: http(),
        [linea.id]: http(),
        [zkSync.id]: http(),
        [mode.id]: http(),
        [mantle.id]: http(),
        [gnosis.id]: http(),
      },
    });
  }, []);

  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
        retry: 1,
        refetchOnWindowFocus: false
      }
    }
  }), []);

  const orbis = useMemo(() => new Orbis({
    useLit: false,
    node: 'https://node2.orbis.club',
    PINATA_GATEWAY: 'https://orbis.mypinata.cloud/ipfs/',
    PINATA_API_KEY: process.env.NEXT_PUBLIC_PINATA_API_KEY,
    PINATA_SECRET_API_KEY: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
    defaultChain: mainnet.id,
  }), []);

  useEffect(() => {
    const setupDb = async () => {
      try {
        await initDb();
        console.log('IndexedDB initialized successfully');
      } catch (error) {
        console.error('Failed to initialize IndexedDB:', error);
      }
    };

    setupDb();
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={config.chains}>
          <ThemeProvider>
            <OrbisProvider
              defaultOrbis={orbis}
              authMethods={['metamask', 'wallet-connect', 'email']}
              context={ORBIS_CONTEXT}
              defaultChain={mainnet.id}
            >
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </OrbisProvider>
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
