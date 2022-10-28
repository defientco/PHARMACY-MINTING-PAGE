import Head from 'next/head'
import { useState } from 'react'
import {
  Box,
  Stack,
  Flex,
  Well,
  Text,
  Button,
  Paragraph,
  SpinnerOG,
} from '@zoralabs/zord'
import { ConnectWallet } from '@components/ConnectWallet'
import ERC721DropContractProvider from '@providers/ERC721DropProvider'
import { NextPage } from 'next'
import { SubgraphERC721Drop } from 'models/subgraph'
import { MintStatus } from '@components/MintStatus'
import { MintDetails } from '@components/MintDetails'
import { PresaleStatus } from '@components/PresaleStatus'
import { ipfsImage } from '@lib/helpers'
import { header, maxWidth, border, heroImage } from 'styles/styles.css'
import { useSaleStatus } from 'hooks/useSaleStatus'
import { Spinner } from 'degen'
import Image from 'next/image'

interface HomePageProps {
  collection: SubgraphERC721Drop;
  chainId?: number;
  metadataURI: string
}

const HomePage: NextPage<HomePageProps> = ({ collection, chainId, metadataURI }) => {
  const ogImage = ipfsImage("ipfs://QmVJBGbMXHNyBe62ruPByK5MG6KdbZkSGPiBMfpqRQ6qP2")
  const { presaleExists, saleNotStarted, saleIsFinished } = useSaleStatus({ collection })
  const [showPresale, setShowPresale] = useState(saleNotStarted && !saleIsFinished)

  return (
    <>
      <Head>
        <title>{collection.name}</title>
        <meta name="title" content={`${collection.name}`} />
        <meta
          name="description"
          content={
            collection.editionMetadata?.description ||
            "Shiny by Kat Dahlia & chillpill. Written by Evan Bogart, GinoTheGhost, MNDR, and Sweetsound. Recorded at Record Plant during NFT LA 2022."
          }
        />
        <meta name="og:title" content={`${collection.name}`} />
        <meta
          name="og:url"
          content="https://pharmacy.chillrx.io"
        />
        <meta
          name="og:description"
          content={
            collection.editionMetadata?.description ||
            "Shiny by Kat Dahlia & chillpill. Written by Evan Bogart, GinoTheGhost, MNDR, and Sweetsound. Recorded at Record Plant during NFT LA 2022."
          }
        />
        <meta name="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${collection.name}`} />
        <meta
          name="twitter:url"
          content="https://pharmacy.chillrx.io"
        />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      <Flex justify="flex-end" p="x4" className={header}>
        <ConnectWallet />
      </Flex>
      <Stack mt="x3" gap="x3">
        <Box className={maxWidth} p="x4">
          <Text variant="menu-lg" mb="x8" align="center">
            <b>{collection.name}</b>
          </Text>
           
          <Text style={{whiteSpace: "pre-line"}}>{collection?.editionMetadata?.description}</Text>
          <Text >
            <u><a href={metadataURI} target="_blank" rel="noreferrer">view full music metadata</a></u>
          </Text>
          <Box mt="x8" mx="auto" style={{ maxWidth: 560 }}>
          <ERC721DropContractProvider
                erc721DropAddress={collection.address}
                chainId={chainId}
              >
<Well className={border} p="x6" style={{ borderBottom: 0 }}>
               <Image
                width="500px"
                height="500px"
                src={ipfsImage(collection.editionMetadata.imageURI)}
                alt={collection.name}
              />
              {collection.editionMetadata?.mimeType?.includes?.("audio") && <audio controls>
                <source src={ipfsImage(collection.editionMetadata.animationURI)} type={collection.editionMetadata.mimeType} />
              Your browser does not support the audio element.
              </audio>}
            </Well>
            <Well className={border} p="x6">
                <Box>
                  {collection != null ? (
                    <>
                      {presaleExists ? (
                        <>
                          <Flex flexChildren gap="x3" mb="x2">
                            <Button
                              pill
                              variant={showPresale ? 'primary' : 'ghost'}
                              color={showPresale ? 'primary' : 'tertiary'}
                              onClick={() => setShowPresale(true)}
                            >
                              Presale
                            </Button>
                            <Button
                              pill
                              variant={!showPresale ? 'primary' : 'ghost'}
                              color={!showPresale ? 'primary' : 'tertiary'}
                              onClick={() => setShowPresale(false)}
                            >
                              Public sale
                            </Button>
                          </Flex>
                          <Box style={{ display: showPresale ? 'block' : 'none' }}>
                            <PresaleStatus collection={collection} />
                          </Box>
                          <Box style={{ display: !showPresale ? 'block' : 'none' }}>
                            <MintStatus collection={collection} />
                          </Box>
                        </>
                      ) : (
                        <MintStatus collection={collection} />
                      )}
                      <MintDetails collection={collection} showPresale={false} />
                    </>
                  ) : (
                    <Paragraph align="center" mt="x8">
                      <SpinnerOG />
                    </Paragraph>
                  )}
                </Box>
            </Well>
              </ERC721DropContractProvider>
            
          </Box>
        </Box>
      </Stack>
    </>
  )
}

export default HomePage
