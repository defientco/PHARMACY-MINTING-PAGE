import { Button, Input as DegenInput } from 'degen'
import { useState } from 'react'

const CreateAuctionForm = () => {
  const [contractAddress, setContractAddress] = useState()
  const [tokenId, setTokenId] = useState()

  return (
    <div
      className={`grid grid-rows-3 flex items-center lg:grid-cols-3 sm:grid-cols-2 sm:gap-x-[70px]`}
    >
      <DegenInput
        placeholder="ERC721 Contract Address"
        type="string"
        onChange={(e) => {
          setContractAddress(e.target.value)
        }}
      />

      <DegenInput
        placeholder="token ID"
        type="string"
        onChange={(e) => {
          setTokenId(e.target.value)
        }}
      />

      <Button>Create Auction</Button>
    </div>
  )
}

export default CreateAuctionForm
