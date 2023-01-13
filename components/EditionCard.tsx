import Image from 'next/image'
import {
  allChains,
  useAccount,
  useContractWrite,
  useNetwork,
  useSigner,
  useSwitchNetwork,
  useWaitForTransaction,
} from 'wagmi'
import { useState, useEffect } from 'react'
import { BigNumber, ethers } from 'ethers'
import MintQuantityV2 from './MintQuantityV2'
import { CustomAudioPlayer } from './CustomAudioPlayer'
import abi from 'contractABI/ChillDrop.json'
import getDefaultProvider from '@lib/getDefaultProvider'
import { ipfsImage } from '@lib/helpers'
import metadataRendererAbi from '@lib/MetadataRenderer-abi.json'
import chillAbi from '@lib/ChillToken-abi.json'
import { toast } from 'react-toastify'
import { useConnectModal } from '@rainbow-me/rainbowkit'

const EditionCard = ({ editionAddress }) => {
  const { chain: activeChain } = useNetwork()
  const { address } = useAccount()
  const { data: signer } = useSigner()
  const { switchNetwork } = useSwitchNetwork()
  const { openConnectModal } = useConnectModal()
  const [pendingTx, setPendingTx] = useState(false)
  const [mintQuantity, setMintQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [editionsImageSRC, setEditionsImageSRC] = useState('/placeholder_400_400.png')
  const [editionsAnimationSRC, setEditionsAnimationSRC] = useState('')
  const [editionSalesInfo, setEditionSalesInfo] = useState({
    name: '',
    symbol: '',
    creator: '',
    maxSupply: '',
    totalMinted: '',
    publicSalePrice: '',
    publicSaleStart: '',
    publicSaleEnd: '',
    erc20PaymentToken: '',
  })
  const [mintOverlayState, setMintOverlayState] = useState(false)

  const totalSupply = editionSalesInfo.totalMinted

  const fetchData = async () => {
    try {
      setLoading(true)
      const provider = getDefaultProvider('goerli', process.env.NEXT_PUBLIC_CHAIN_ID)
      const contract = new ethers.Contract(editionAddress, abi, provider)

      // Get metadata renderer
      const metadataRendererAddress = await contract.metadataRenderer()
      const metadataRendererContract = new ethers.Contract(
        metadataRendererAddress.toString(),
        metadataRendererAbi,
        provider
      )

      let metadata
      try {
        const metadataBase = await metadataRendererContract.metadataBaseByContract(
          editionAddress
        )
        const metadataURI = ipfsImage(metadataBase.base)
        const axios = require('axios').default
        const { data } = await axios.get(metadataURI)
        metadata = data
      } catch (err) {
        const info = await contract.tokenURI('1')
        const index = info.indexOf(',')
        const encoded = info.substring(index + 1)
        const json = atob(encoded)
        metadata = JSON.parse(json)
      }

      const imageURI = metadata.image
      const imageIPFSGateway = ipfsImage(imageURI)
      setEditionsImageSRC(imageIPFSGateway)

      const salesConfig = await contract.salesConfig()
      const symbol = await contract.symbol()
      const config = await contract.config()
      const totalMinted = await contract.totalSupply()
      const editionSalesInfo = {
        name: metadata.name,
        symbol: symbol,
        creator: 'ME',
        maxSupply: config.editionSize,
        totalMinted: totalMinted,
        publicSalePrice: salesConfig.publicSalePrice,
        publicSaleStart: salesConfig.presaleStart,
        publicSaleEnd: salesConfig.publicSaleEnd,
        erc20PaymentToken: salesConfig.erc20PaymentToken,
      }
      setEditionSalesInfo(editionSalesInfo)

      const animationURI = metadata?.losslessAudio || ''
      const animnationIPFSGateway = ipfsImage(animationURI)
      setEditionsAnimationSRC(animnationIPFSGateway)
    } catch (error) {
      console.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const editionTotalMintPrice = String(
    ethers.BigNumber.from(editionSalesInfo?.publicSalePrice || 0).mul(mintQuantity || 0)
  )
  const totalMintValueEth = ethers.utils.formatUnits(editionTotalMintPrice)

  const {
    data: mintData,
    isError: mintError,
    isLoading: mintLoading,
    isSuccess: mintSuccess,
    status: mintStatus,
    error,
    write: mintWrite,
  } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: editionAddress,
    contractInterface: abi,
    functionName: 'purchase',
    args: [mintQuantity],
    onError(error, variables, context) {
      console.error('error', JSON.stringify(error.message))
      setPendingTx(false)
    },
    onSuccess(cancelData, variables, context) {
      console.log('Success!', cancelData)
    },
  })

  const getChillTokenContract = () => {
    return new ethers.Contract(editionSalesInfo.erc20PaymentToken, chillAbi, signer)
  }

  const allowance = async () => {
    const contract = getChillTokenContract()
    const allowance = await contract.allowance(address, editionAddress)
    return allowance
  }

  const balanceOf = async () => {
    const contract = getChillTokenContract()
    const balance = await contract.balanceOf(address)
    return balance
  }

  const approve = async () => {
    const tx = await getChillTokenContract().approve(
      editionAddress,
      ethers.constants.MaxUint256
    )
    await tx.wait()
    toast.success('Approved $CHILL! You can now buy a music NFT.')
    return tx
  }

  // handle loading state UI when minting
  const mintAndSetOverlayState = async () => {
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
      const allow = await allowance()
      const balance = await balanceOf()
      const price = editionSalesInfo.publicSalePrice

      const priceDifference = BigNumber.from(price).sub(balance)
      if (priceDifference.gt(0)) {
        toast.error(
          `Not enough $CHILL. You need ${
            Math.round(Number(ethers.utils.formatEther(priceDifference)) * 100) / 100
          } more $CHILL`
        )
      }

      if (allow.sub(BigNumber.from(price).mul(mintQuantity)).lt(0)) {
        await approve()
      }
      mintWrite()
      setMintOverlayState(!mintOverlayState)
    } catch (error) {
      console.error(error)
      setPendingTx(false)
    }
  }

  const clearLoadingState = () => {
    setMintOverlayState(!mintOverlayState)
  }

  // Wait for data from mint call
  const { data: mintWaitData, isLoading: mintWaitLoading } = useWaitForTransaction({
    hash: mintData?.hash,
    onSuccess(mintWaitData) {
      console.log('txn complete: ', mintWaitData)
      console.log('txn hash: ', mintWaitData.transactionHash)
      setPendingTx(false)
    },
  })

  // max supply check
  const maxSupplyCheck = (supply) => {
    if (supply == 18446744073709551615) {
      return '∞'
    } else {
      return supply
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const truncateName = (name) => {
    if (name.length > 29) {
      return name.substring(0, 29) + '...'
    }
    return name
  }

  const isMainnet = activeChain?.id === 1

  return (
    <>
      {!!editionAddress ? (
        <>
          {loading ? (
            <div className="text-[#f70500]">loading . . .</div>
          ) : (
            <div className="   border-[1px] border-[#f70500] text-[#f70500] h-[100%] w-full text-[#f70500] flex flex-row flex-wrap justify-center ">
              <div className=" flex flex-row sm:w-[100%] justify-center border-b-[1px] border-[#f70500]">
                <div className="relative" style={{ width: 354, height: 354 }}>
                  <Image
                    src={editionsImageSRC}
                    layout="fill"
                    objectFit="cover"
                    alt="digital collectible"
                  />
                </div>
              </div>
              {mintWaitLoading == false &&
              mintOverlayState == true &&
              mintStatus == 'success' ? (
                <div className=" h-[298px] bg-[#f70500] flex flex-row sm:w-[100%] justify-center items-center  ">
                  <div className=" w-full  flex flex-row flex-wrap justify-center space-y-4">
                    <div className="text-lg font-bold  flex flex-row w-full h-fit justify-center text-[#0E0411]">
                      💊 Mint Successful 💊
                    </div>
                    <a
                      className="decoration-1 text-sm pb-2 h-fit justify-center underline flex flex-row w-full text-[#0E0411]"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://${
                        isMainnet ? 'opensea.io' : 'testnets.opensea.io'
                      }/assets/${isMainnet ? 'ethereum' : 'goerli'}/${editionAddress}/${
                        Number(totalSupply) + Number(mintQuantity)
                      }`}
                    >
                      View on OpenSea
                    </a>
                    <button
                      onClick={() => clearLoadingState()}
                      className=" h-fit text-[#f70500] border-[1px] border-[#0E0411] bg-[#0E0411] hover:bg-[#0e0311] hover:text-[#0E0411]  p-2 justify-center w-6/12 text-[16px] flex flex-row h-fit hover:text-[#0e0311]"
                    >
                      CLOSE
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {mintWaitLoading == false &&
                  mintOverlayState == true &&
                  mintStatus == 'error' ? (
                    <div className="h-[268px] bg-[#f70500] flex flex-row w-full sm:w-[100%] justify-center items-center">
                      <div className="my-4 w-full h-fit flex flex-row flex-wrap justify-center  space-y-4">
                        <div className="text-lg font-bold  flex flex-row w-full h-fit justify-center text-[#0E0411]">
                          Error in mint process
                        </div>
                        <button
                          onClick={() => clearLoadingState()}
                          className=" h-fit text-[#f70500] border-[1px] border-[#0E0411] bg-[#0E0411] hover:bg-[#0e0311] hover:text-[#0E0411]  p-2 justify-center w-6/12 text-[16px] flex flex-row h-fit hover:text-[#0e0311]"
                        >
                          CLOSE
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full ">
                      {editionsAnimationSRC && (
                        <CustomAudioPlayer musicSRC={editionsAnimationSRC} />
                      )}
                      <div className=" flex flex-row flex-wrap w-full pb-4 space-y-2 ">
                        <div className="ml-3 mt-3 flex flex-row w-full text-xl">
                          <a
                            className="hover:underline decoration-1"
                            target="_blank"
                            rel="noreferrer"
                            href={`https://opensea.io/assets/${editionAddress}/1`}
                          >
                            {truncateName(editionSalesInfo.name)}
                          </a>
                        </div>
                      </div>
                      <div className=" justify-evenly flex flex-row flex-wrap w-full py-3 border-[1px] border-[#f70500]">
                        <div className="flex flex-row  items-center justify-center text-xl ">
                          {totalSupply +
                            ' / ' +
                            maxSupplyCheck(editionSalesInfo.maxSupply) +
                            ' MINTED'}
                        </div>
                      </div>
                      <div className="w-full grid grid-cols-4 ">
                        <MintQuantityV2 mintQuantityCB={setMintQuantity} />
                        <div className="flex flex-row justify-center col-start-2 col-end-5  text-lg  p-3  w-full h-full border-[1px] border-solid border-[#f70500]">
                          {'' + totalMintValueEth + ' $CHILL'}
                        </div>

                        {mintWaitLoading || pendingTx ? (
                          <button
                            disabled={true}
                            className="flex flex-row justify-center col-start-1 col-end-5  text-2xl p-3  w-full h-full border-[1px] border-solid border-[#f70500] hover:bg-[#0e0311] hover:text-black bg-[#f70500] text-black"
                          >
                            <div className="flex flex-row justify-center flex-wrap">
                              <img
                                className=" rounded-full p-1 mt-2"
                                width="25px"
                                src="/SVG-Loaders-master/svg-loaders/tail-spin.svg"
                              />
                            </div>
                          </button>
                        ) : (
                          <button
                            className="flex flex-row justify-center col-start-1 col-end-5  text-2xl p-3  w-full h-full border-[1px] border-solid border-[#f70500] hover:bg-[#0e0311] hover:text-black bg-[#f70500] text-black"
                            onClick={() => mintAndSetOverlayState()}
                          >
                            Mint
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <div>{'::: NO RESULTS :::'}</div>
      )}
    </>
  )
}

export default EditionCard
