import Image from "next/image";

export const Footer = () => {

   return (
      <div className="border-t-2 border-solid border-[#f70500] py-10 backdrop-blur-3xl border-solid border-[#f70500] grid grid-cols-2 grid-rows-2 sm:grid-rows-1 sm:grid-cols-3  text-[#f70500] items-center h-fit w-full">
         <div className="pl-10 pr-5 sm:pr-0 sm:row-start-1 sm:row-end-1">
         <a 
               href="https://hq.decent.xyz/"
               target="_blank"
               rel="noreferrer"
            >
               <Image
                  src={"/graphics/decent.jpeg"}
                  height={100}
                  width={100}
                  alt="decent"
               /> 
            </a>
         </div>

         <div 
            className="flex flex-row justify-center grid col-start-1 col-end-3 row-start-1 row-end-2 sm:col-start-2 sm:col-end-2 sm:row-start-1 sm:row-end-1"
         >
            <a 
               href="https://chillrx.io/"
               target="_blank"
               rel="noreferrer"
            >
               <Image
                  src={"/graphics/CHILL_RX.png"}
                  height={100}
                  width={100}
                  alt="chillrx"
               /> 
            </a>
         </div>
         

         

         <div className=" sm:row-start-1 sm:row-end-1 pr-10 space-y-2 w-full flex flex-row flex-wrap justify-end">
         <a 
               href="https://create.zora.co/"
               target="_blank"
               rel="noreferrer"
            >
               <Image
                  src={"/graphics/Zorb_new.png"}
                  height={100}
                  width={100}
                  alt="zora"
               /> 
            </a>                                       
         </div>
      </div>      
   )

};