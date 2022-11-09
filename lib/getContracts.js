import { ethers } from 'ethers'
import auctionAbi from '@lib/ReserveAuctionERC20FindersEth-abi.json'
import chillAbi from '@lib/ChillToken-abi.json'

const isEthereum = Number(process.env.NEXT_PUBLIC_CHAIN_ID) === 1

export const erc20TransferHelper = isEthereum
  ? '0xCCA379FDF4Beda63c4bB0e2A3179Ae62c8716794'
  : '0x53172d999a299198a935f9E424f9f8544e3d4292'

export const chillToken = isEthereum
  ? '0x67bD6541EB488059C8B84F859b0aD0244F9F0102'
  : '0xc5Bc83bb51B41A83149A44DB03Eb86622a3A44b3'

export const findersERC20 = isEthereum
  ? '0xd1adAF05575295710dE1145c3c9427c364A70a7f'
  : '0x36aB5200426715a9dD414513912970cb7d659b3C'

export const getChillTokenContract = (signerOrProvider) =>
  new ethers.Contract(chillToken, chillAbi, signerOrProvider)

export const getAuctionContract = (signerOrProvider) => {
  return new ethers.Contract(findersERC20, auctionAbi, signerOrProvider)
}
