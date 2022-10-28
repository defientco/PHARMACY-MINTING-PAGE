import Head from 'next/head'

const SeoHead = () => {
  const title = 'ChillRx: the Pharmacy'
  const description = 'A Web3 Record Store by ChillRx'

  return (
    <Head>
      <title>Pharmacy</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/graphics/CHILL_RX.png" />
      <meta name="og:title" content={title} />
      <meta property="og:image" content="/graphics/CHILL_RX.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:description" content={description} />

      <meta name="twitter:title" content={title} />

      <meta name="twitter:image" content="/graphics/CHILL_RX.png" />
      <link rel="icon" href="/graphics/CHILL_RX.png" />
      <link rel="apple-touch-icon" href="/graphics/CHILL_RX.png" />
    </Head>
  )
}

export default SeoHead
