import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import useAppContext from "../context/useAppContext";
import Image from "next/image";
import { toast } from "react-toastify";

export const Header = () => {

  const { expandHeader, setExpandedHeader } = useAppContext()

  const headerHandler = () => {
    setExpandedHeader(!expandHeader)
  }

  const CloseButton = () => (
    <div className="flex flex-row justify-end flex-wrap     w-full h-fit mt-2 mb-2 mr-5 ">
      <button
        onClick={() => headerHandler()}
        className="text-[16px] px-2 flex pt-[4px] flex-row h-fit hover:text-[#0e0311]"
      >
        ✕
      </button>
    </div>
  )

  const About = () => (
    <div className="flex flex-row flex-wrap w-full   mb-6 ">
      <div className="selection:bg-black mx-5 w-full sm:w-7/12 text-[16px]">
        {"ChillRx is a decentralized record label run by chillpill & the ChillRx community. 'ChillRx: The Pharmacy' is a web3 record store. We’ve worked to provide a platform for ChillRx's Decentralized Album as well as our artists to showcase their music. We hope to help musicians use the tools of web3 to break the model of traditional record labels and connect fans to the next generation of music."}
      </div>
    </div>
  )

  return (

    <div className={`z-10  backdrop-blur-3xl ${expandHeader ? "h-fit" : "h-[80px]"} text-[16px] fixed top-0 py-4 font-[akzidenz] text-lg text-[#f70500] flex ${expandHeader && "flex-wrap"} flex-row w-full justify-center `}>
      {expandHeader && <CloseButton />}
      {expandHeader &&  <About /> }
      <div className="sm:mr-4 items-center h-fit space-x-3 justify-center sm:justify-between flex flex-row  w-full "> 
        <Link href="/">     
          <div
            className="w-fit sm:w-full justify-end sm:justify-start sm:ml-4 flex flex-row items-center hover:cursor-pointer"
          >
            <Image src="/graphics/CHILL_RX.png" height="84px" width="81px" alt="ChillRx Logo" />
          </div>   
        </Link>            
        <div className="flex flex-row space-x-3 sm:space-x-5 items-center ">
          <div className="space-x-3 sm:space-x-5">
            <Link
                href="/"
              >
                <a className="hover:text-[#0e0311]">
                  Collect
                </a>
            </Link>   
            <Link
              href="/curate"
            >
              <a className="hover:text-[#0e0311]" onClick={(e) => {
                e.preventDefault()
                toast.success("public curation with $CHILL coming soon")
              }}>
                Curate
              </a>
            </Link>        
            <a 
              onClick={() => headerHandler()}
              className="hover:text-[#0e0311]"
            >
              About
            </a>
          </div>
          <div className="sm:w-[150px]">
            <ConnectButton 
              accountStatus="address" 
              showBalance={false}
              label={"Connect"}
            />
          </div>
        </div>
      </div>
      </div>  
  )
};