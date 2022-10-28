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

      <meta
        name="twitter:image"
        content="https://chillrx.mypinata.cloud/ipfs/QmWzn4S8QW27r1ZL9RgpSXqmMmnqfom2einRQ9Ck2vFPBt"
      />
      <link
        rel="icon"
        href="https://chillrx.mypinata.cloud/ipfs/QmWzn4S8QW27r1ZL9RgpSXqmMmnqfom2einRQ9Ck2vFPBt"
      />
      <link
        rel="apple-touch-icon"
        href="https://chillrx.mypinata.cloud/ipfs/QmWzn4S8QW27r1ZL9RgpSXqmMmnqfom2einRQ9Ck2vFPBt"
      />
    </Head>
  )
}

export default SeoHead
