import { findersERC20, getModuleManagerContract } from '@lib/getContracts'
import handleTxError from '@lib/handleTxError'
import { toast } from 'react-toastify'

const isAuctionModuleApproved = async (address, signerOrProvider) => {
  const contract = getModuleManagerContract(signerOrProvider)
  let approved = await contract.isModuleApproved(address, findersERC20)

  if (approved === false) {
    try {
      const tx = await contract.setApprovalForModule(findersERC20, true)
      await tx.wait()
      return true
    } catch (err) {
      handleTxError(err)
      toast.error('error approving module manager for auction')
    }
  }
  return approved
}

export default isAuctionModuleApproved
