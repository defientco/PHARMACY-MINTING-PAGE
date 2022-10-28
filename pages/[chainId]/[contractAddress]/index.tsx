import { ethers, utils } from 'ethers'
import { GetStaticProps } from 'next'
import { ipfsImage } from '@lib/helpers'
import abi from '@lib/ERC721Drop-abi.json'
import metadataRendererAbi from '@lib/MetadataRenderer-abi.json'
import getDefaultProvider from '@lib/getDefaultProvider'
import { allChains } from 'wagmi'
import HomePage from '@components/HomePage/HomePage'
import getErc721Drop from '@lib/getErc721Drop'

const MintPage = ({collection, chainId, metadataURI}) => <HomePage collection={collection} chainId={chainId} metadataURI={metadataURI} />
export default MintPage;

export const getServerSideProps: GetStaticProps = async (context) => {
  const {chainId, contractAddress} = context.params;
  if (!utils.isAddress(contractAddress.toString())) {
    return {
      notFound: true,
    }
  }

  // Create Ethers Contract
  const chain = allChains.find(
    (chain) => chain.id.toString() === chainId
  )
  const provider = getDefaultProvider(chain.network, chainId);
  const contract = new ethers.Contract(contractAddress.toString(), abi, provider);

  // Get metadata renderer
  const metadataRendererAddress = await contract.metadataRenderer();
  const metadataRendererContract = new ethers.Contract(metadataRendererAddress.toString(), metadataRendererAbi, provider);
  const metadataBase = await metadataRendererContract.metadataBaseByContract(contractAddress);
  const metadataURI = ipfsImage(metadataBase.base)
  const axios = require('axios').default;
  const {data: metadata} = await axios.get(metadataURI)

  // Get Sale Details
  const saleDetails = await contract.saleDetails();

  const erc721Drop = getErc721Drop(contractAddress, metadata, saleDetails);
  return {
    props: { collection: erc721Drop, chainId: chain.id, metadataURI  },
  }
}
