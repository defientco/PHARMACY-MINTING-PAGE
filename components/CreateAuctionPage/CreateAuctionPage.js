import { Header } from 'components/Header'
import { Footer } from 'components/Footer'
import Image from 'next/image'
import SeoHead from 'components/SeoHead'
import CreateAuctionForm from 'components/CreateAuctionForm'
const CreateAuctionPage = () => {
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
