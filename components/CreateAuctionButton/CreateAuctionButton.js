import { Button } from 'degen'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import abi from '@lib/ERC721Drop-abi.json'
import zoraModuleManagerAbi from '@lib/ZoraModuleManager-abi.json'
import { useAccount, useSigner } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'

const CreateAuctionButton = ({ contractAddress, tokenId }) => {
  const { data: signer } = useSigner()
  const { address } = useAccount()
  const { openConnectModal } = useConnectModal()

  const isEthereum = Number(process.env.NEXT_PUBLIC_CHAIN_ID) === 1
  const erc721TransferHelper = isEthereum
    ? '0x909e9efE4D87d1a6018C2065aE642b6D0447bc91'
    : '0xd1adAF05575295710dE1145c3c9427c364A70a7f'
  const moduleManager = isEthereum
    ? '0x850A7c6fE2CF48eea1393554C8A3bA23f20CC401'
    : '0x9458E29713B98BF452ee9B2C099289f533A5F377'

  const getNftContract = () => {
    return new ethers.Contract(contractAddress, abi, signer)
  }

  const getModuleManagerContract = () => {
    return new ethers.Contract(contractAddress, zoraModuleManagerAbi, signer)
  }

  const isApprovedForAll = async (contract) => {
    const isApproved = await contract.isApprovedForAll(address, erc721TransferHelper)
    console.log('isApproved', isApproved)
    return isApproved
  }

  const approveForAll = async (contract) => {
    try {
      const tx = await contract.setApprovalForAll(erc721TransferHelper, true)
      await tx.wait()
      toast.success('approved tokens for auction!')
    } catch (error) {
      console.error(error)
      toast.error('error approving tokens for auction')
    }
  }

  const handleClick = async () => {
    if (!signer) {
      openConnectModal()
    }
    if (!contractAddress) {
      toast.error('missing contract address')
    }
    if (!tokenId) {
      toast.error('missing tokenId')
    }

    console.log('contractAddress', contractAddress)
    console.log('tokenId', tokenId)
    const contract = getNftContract()
    console.log('CONTRACT', contract)
    const isApproved = await isApprovedForAll(contract)
    if (!isApproved) {
      await approveForAll(contract)
      return
    }

    const moduleManagerContract = getModuleManagerContract()
    console.log('moduleManagerContract', moduleManagerContract)
  }

  return <Button onClick={handleClick}>Create Auction</Button>
}

export default CreateAuctionButton
