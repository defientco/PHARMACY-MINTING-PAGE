import { useConnectModal } from '@rainbow-me/rainbowkit'
import { allChains, useAccount, useNetwork, useSigner, useSwitchNetwork } from 'wagmi'
import getChillAllowance from '@lib/getChillAllowance'
import getChillBalance from '@lib/getChillBalance'
import { toast } from 'react-toastify'
import { BigNumber } from 'ethers'
import { getAuctionContract } from '@lib/getContracts'
import handleTxError from '@lib/handleTxError'

const AuctionSettleButton = ({ setPendingTx, nftAddress, tokenId }) => {
  const { openConnectModal } = useConnectModal()
  const { switchNetwork } = useSwitchNetwork()
  const { chain: activeChain } = useNetwork()
  const { address } = useAccount()
  const { data: signer } = useSigner()

  const handleClick = async () => {
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
      const auctionContract = getAuctionContract(signer)
      const tx = await auctionContract.settleAuction(nftAddress, tokenId)
      await tx.wait()
      toast.success('auction settled')
      setPendingTx(false)
    } catch (error) {
      handleTxError(error)
      setPendingTx(false)
    }
  }

  return (
    <button
      className="flex flex-row justify-center col-start-1 col-end-5  text-2xl p-3  w-full h-full border-[1px] border-solid border-[#f70500] hover:bg-[#0e0311] hover:text-black bg-[#f70500] text-black"
      onClick={() => handleClick()}
    >
      Settle
    </button>
  )
}

export default AuctionSettleButton
