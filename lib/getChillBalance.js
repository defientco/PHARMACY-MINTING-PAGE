import { getChillTokenContract } from './getContracts'

const getChillBalance = async (address, signerOrProvider) => {
  const contract = getChillTokenContract(signerOrProvider)
  const balance = await contract.balanceOf(address)
  return balance
}

export default getChillBalance
