import { erc20TransferHelper, getChillTokenContract } from './getContracts'

const getChillAllowance = async (address, signerOrProvider) => {
  const contract = getChillTokenContract(signerOrProvider)
  const allowance = await contract.allowance(address, erc20TransferHelper)
  return allowance
}

export default getChillAllowance
