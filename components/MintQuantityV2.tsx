import { useState } from 'react'

export default function MintQuantityV2({ mintQuantityCB }) {
  const [mintQuantity, setMintQuantity] = useState(1)

  const onChange = (arg) => {
    setMintQuantity(arg.target.value)
    mintQuantityCB(arg.target.value)
  }

  return (
    <div className="w-full">
      <input
        onChange={onChange}
        className="border w-full h-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        id="bid"
        step={1}
        type="number"
        placeholder={String(mintQuantity)}
      />
    </div>
  )
}
