import { erc20TransferHelper, getChillTokenContract } from './getContracts'

const getChillAllowance = async (address, signerOrProvider) => {
  console.log('GETTING CHILL ALLOWANCE', address)
  console.log('erc20TransferHelper', erc20TransferHelper)
  const contract = getChillTokenContract(signerOrProvider)
  const allowance = await contract.allowance(address, erc20TransferHelper)
  return allowance
}

export default getChillAllowance
