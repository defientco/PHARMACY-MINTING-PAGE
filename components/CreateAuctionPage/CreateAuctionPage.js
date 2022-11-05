import { Header } from 'components/Header'
import { Footer } from 'components/Footer'
import Image from 'next/image'
import SeoHead from 'components/SeoHead'
import CreateAuctionForm from 'components/CreateAuctionForm'
const CreateAuctionPage = () => {
  const isMainnet = Number(process.env.NEXT_PUBLIC_CHAIN_ID) === 1

  const blueChipAuctionAddress = '0x712ba73c72f65B4eD00352C58e28e80093f29dE3'

  const goerliDrops = [
    '0x48ba968a3b0925f834c704ca098ca895142c7aab',
    '0x1dd9b6c2b23b79d93304935279bcf877f588ec22',
    '0xb291bBFb4E5CF696fee4F7BCB489266327a4C5D8',
    '0x4cA7a7128Ac968C494fa7e3BD1ee24b70Fa2B6Ba',
    '0x1835F5fDFfa38f8b791478894b1b1B21A2bb125d',
    '0xA5825E30ddB885b1183fd777f5fdDC6710D0B106',
    '0xDF78830763cA0e6CD7953f1fd9ddD6807F7eff37',
    '0xA02a72ed2dA4f842a8211d038B04b7B8B35d5422',
    '0xB9cE4caf02Fd373e8E29947C819A924c1c127911',
    '0x5d71B68C248D5e87De8c4fe0ac5dcafE7A6E108b',
  ]

  const mainnetDrops = [
    '0x44274C83C01a6A5E2a4C22b2ADF6ce388cEa75ba',
    '0x0E6f1C77151e6Cd9B32eBf1e305234F9640Bf6b4',
    '0x00b96983dae0c1EBaB092f93ea7D73E9CB279C8D',
    '0xd9430fc4c0b1a7b0a4bb59132f307708d587100f',
    '0xa57CBB294312aAF7B80aaF5D2D87D617861847C5',
    '0x97ff4c78701c08aC46d794e78894063983E3f6Fb',
    '0x36efd2A7381541Cfd29417bF91f395610b70Df31',
    '0xC3A611CB3B3E284bfa5a53ad7D22B63D35d00547',
    '0x328047584dB1537E471327404D35d7256121bE2b',
    '0x09B399F0CB3Cbd458f26e47f5Ee7787e5348d02e',
    '0xCEcFec83aF058BcF0Dbb599cFBb6ffB97feEf91a',
  ]
  const chillDrops = isMainnet ? mainnetDrops : goerliDrops

  const rowAndColumnCount = chillDrops.length

  return (
    <div className="flex flex-col justify-center items-center h-full min-h-screen scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-600">
      <Header />
      <SeoHead />

      <div className="py-10 border-t-[1px] border-solid border-[#f70500] mt-[100px] w-full flex flex-row justify-center ">
        <Image
          src={'/graphics/THE_PHARM.png'}
          alt="pharmacy_logo"
          height={350}
          width={350}
        />
      </div>
      <main>
        <CreateAuctionForm />
      </main>
      <Footer />
    </div>
  )
}

export default CreateAuctionPage
