import { useConnectModal } from '@rainbow-me/rainbowkit'
import { allChains, useAccount, useNetwork, useSigner, useSwitchNetwork } from 'wagmi'
import getChillAllowance from '@lib/getChillAllowance'
import getChillBalance from '@lib/getChillBalance'
import { toast } from 'react-toastify'
import { BigNumber, ethers } from 'ethers'
import { getAuctionContract, getChillTokenContract } from '@lib/getContracts'
import handleTxError from '@lib/handleTxError'

const CreateBidButton = ({ setPendingTx, nftAddress, tokenId, bid, onSuccess }) => {
  const { openConnectModal } = useConnectModal()
  const { switchNetwork } = useSwitchNetwork()
  const { chain: activeChain } = useNetwork()
  const { address } = useAccount()
  const { data: signer } = useSigner()

  const approve = async () => {
    const tx = await getChillTokenContract().approve(
      nftAddress,
      ethers.constants.MaxUint256
    )
    await tx.wait()
    toast.success('Approved $CHILL! You can now buy a music NFT.')
    return tx
  }

  const bidAndSetOverlayState = async () => {
    const correctChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID)
    if (!address) {
      openConnectModal()
      return
    }
    if (activeChain.id !== correctChainId) {
      const correctChain = allChains.find((c) => c.id === correctChainId)
      toast.error(`please connect to ${correctChain.name} and try again`)
      switchNetwork(correctChainId)
      return
    }
    setPendingTx(true)
    try {
      const allow = await getChillAllowance(address, signer)
      console.log('ALLOWANCE', allow)
      const balance = await getChillBalance(address, signer)
      console.log('balance', balance)
      const priceDifference = BigNumber.from(bid).sub(balance)
      if (priceDifference.gt(0)) {
        toast.error(
          `Not enough $CHILL. You need ${
            Math.round(Number(ethers.utils.formatEther(priceDifference)) * 100) / 100
          } more $CHILL`
        )
      }
      if (allow.sub(BigNumber.from(bid)).lt(0)) {
        await approve()
      }
      const auctionContract = getAuctionContract(signer)
      const findersFeeRecipient = '0x97a5810acDDF54371e3bBA01C41eFbA8ada268d6'
      const tx = await auctionContract.createBid(
        nftAddress,
        tokenId,
        bid,
        findersFeeRecipient
      )
      await tx.wait()
      toast.success('bid placed')
      onSuccess()
      setPendingTx(false)
    } catch (error) {
      handleTxError(error)
      console.error(error)
      setPendingTx(false)
    }
  }

  return (
    <button
      className="flex flex-row justify-center col-start-1 col-end-5  text-2xl p-3  w-full h-full border-[1px] border-solid border-[#f70500] hover:bg-[#0e0311] hover:text-black bg-[#f70500] text-black"
      onClick={() => bidAndSetOverlayState()}
    >
      Bid
    </button>
  )
}

export default CreateBidButton
