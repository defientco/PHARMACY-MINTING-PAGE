import type { NextPage } from 'next'
import { Header } from 'components/Header'
import { Footer } from 'components/Footer'
import EditionCard from 'components/EditionCard';
import Image from 'next/image'
import SeoHead from "components/SeoHead"
const Home: NextPage = () => {
  
  const chillDrops = [
    "0x48ba968a3b0925f834c704ca098ca895142c7aab", 
    "0x1dd9b6c2b23b79d93304935279bcf877f588ec22",
    "0xb291bBFb4E5CF696fee4F7BCB489266327a4C5D8",
    "0x4cA7a7128Ac968C494fa7e3BD1ee24b70Fa2B6Ba",
    "0x1835F5fDFfa38f8b791478894b1b1B21A2bb125d",
    "0xA5825E30ddB885b1183fd777f5fdDC6710D0B106",
    "0xDF78830763cA0e6CD7953f1fd9ddD6807F7eff37",
    "0xA02a72ed2dA4f842a8211d038B04b7B8B35d5422",
    "0xB9cE4caf02Fd373e8E29947C819A924c1c127911",
    "0x5d71B68C248D5e87De8c4fe0ac5dcafE7A6E108b"
  ]
  
  const rowAndColumnCount = chillDrops.length

  return (
    
    <div className='flex flex-col justify-center items-center h-full min-h-screen scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-600' >
      <Header />
      <SeoHead />

      <div className="py-10 border-t-[1px] border-solid border-[#f70500] mt-[100px] w-full flex flex-row justify-center ">
        {/* <Image
          src={"/collection_page_graphic_v2.png"}
          height={227}
          width={315}
        /> */}
        <div className="flex flex-row  text-xl border-[#f70500] border-2 w-[30%] rounded  bg-black justify-center text-center  text-[#f70500]">
          The Pharmacy by ChillRx                                         
        </div>
      </div>
      <main className={` pb-8 sm:pb-[70px] text-white grid grid-rows-[${rowAndColumnCount}]  flex justify-center lg:grid-cols-3 sm:grid-cols-2  w-[90%] sm:w-[80%]  gap-y-8 sm:gap-y-[70px]  gap-x-0 sm:gap-x-[70px]`}> 
      {
        chillDrops.map((collection, index) =>
          <EditionCard editionAddress={chillDrops[index]} key={collection} />
        )
      }
      </main>
      <Footer />
    </div>
  )
}

export default Home
