import { AppProps } from 'next/app';

import '@/styles/globals.css';

import { WunderGraphProvider } from '@/components/generated/provider';

/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WunderGraphProvider>
      <Component {...pageProps} />
    </WunderGraphProvider>
  );
}

export default MyApp;
