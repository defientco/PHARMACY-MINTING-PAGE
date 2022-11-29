import { Button } from 'degen'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import abi from '@lib/ERC721Drop-abi.json'
import auctionAbi from '@lib/ReserveAuctionERC20FindersEth-abi.json'
import { useAccount, useSigner } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import { Spinner } from '@zoralabs/zord'
import isAuctionModuleApproved from '@lib/isAuctionModuleApproved'

const CreateAuctionButton = ({ contractAddress, tokenId }) => {
  const { data: signer } = useSigner()
  const { address } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [isPendingTx, setIsPendingTx] = useState(false)

  const isEthereum = Number(process.env.NEXT_PUBLIC_CHAIN_ID) === 1
  const erc721TransferHelper = isEthereum
    ? '0x909e9efE4D87d1a6018C2065aE642b6D0447bc91'
    : '0xd1adAF05575295710dE1145c3c9427c364A70a7f'
  const findersERC20 = isEthereum
    ? '0xd1adAF05575295710dE1145c3c9427c364A70a7f'
    : '0x36aB5200426715a9dD414513912970cb7d659b3C'
  const chillToken = isEthereum
    ? '0x67bD6541EB488059C8B84F859b0aD0244F9F0102'
    : '0xc5Bc83bb51B41A83149A44DB03Eb86622a3A44b3'

  const getNftContract = () => {
    return new ethers.Contract(contractAddress, abi, signer)
  }

  const getAuctionContract = () => {
    return new ethers.Contract(findersERC20, auctionAbi, signer)
  }

  const isApprovedForAll = async (contract) => {
    const isApproved = await contract.isApprovedForAll(address, erc721TransferHelper)
    return isApproved
  }

  const createAuction = async () => {
    try {
      const contract = getAuctionContract()
      const duration = 180
      const reservePrice = '8080000000000000000'
      const sellerFundsRecipient = address
      const startTime = 0
      const bidCurrency = chillToken
      const findersFeeBps = 808
      const tx = await contract.createAuction(
        contractAddress,
        tokenId,
        duration,
        reservePrice,
        sellerFundsRecipient,
        startTime,
        bidCurrency,
        findersFeeBps
      )
      await tx.wait()
      toast.success('auction created')
      const auction = await contract.auctionForNFT(contractAddress, tokenId)
    } catch (err) {
      console.error(err)
      toast.error('error creating auction')
    }
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

    setIsPendingTx(true)
    try {
      const contract = getNftContract()
      const isApproved = await isApprovedForAll(contract)
      if (!isApproved) {
        await approveForAll(contract)
        setIsPendingTx(false)
        return
      }

      const isModuleApproved = await isAuctionModuleApproved(address, signer)
      if (!isModuleApproved) {
        setIsPendingTx(false)
        return
      }
      await createAuction()
    } catch (err) {
      console.error(err)
    }
    setIsPendingTx(false)
  }

  return (
    <>
      {isPendingTx ? (
        <Spinner size="lg" />
      ) : (
        <Button onClick={handleClick}>Create Auction</Button>
      )}
    </>
  )
}

export default CreateAuctionButton
