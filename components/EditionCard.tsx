import Image from 'next/image'
import { useContractWrite, useWaitForTransaction } from "wagmi"
import { useState, useEffect } from 'react'
import { createClient } from "urql"
import { ethers } from 'ethers'
import MintQuantityV2 from './MintQuantityV2'
import { CustomAudioPlayer } from './CustomAudioPlayer'
import abi from "contractABI/ChillDrop.json"
import getDefaultProvider from '@lib/getDefaultProvider'
import { ipfsImage } from '@lib/helpers'
import metadataRendererAbi from '@lib/MetadataRenderer-abi.json'
const vibes = "#ffffff"

// API SETUP
const ZORA_DROPS_MAINNET = "https://api.thegraph.com/subgraphs/name/iainnash/zora-editions-mainnet"
const ZORA_DROPS_RINKEBY = "https://api.thegraph.com/subgraphs/name/iainnash/erc721droprinkeby"
const ZORA_DROPS_GOERLI = "https://api.thegraph.com/subgraphs/name/iainnash/erc721drop-goerli"

const client = createClient({
    url: ZORA_DROPS_GOERLI
})

const EditionCard = ({ editionAddress }) => {

    const [mintQuantity, setMintQuantity] = useState({ name: '1', queryValue: 1 })
    const [loading, setLoading] = useState(false)
    const [editionsImageSRC, setEditionsImageSRC] = useState("/placeholder_400_400.png");
    const [editionsAnimationSRC, setEditionsAnimationSRC] = useState("");
    const [editionSalesInfo, setEditionSalesInfo] = useState({
        "name": "",
        "symbol": "",
        "creator": "",
        "maxSupply": "",
        "totalMinted": "",
        "publicSalePrice": "",
        "publicSaleStart": "",
        "publicSaleEnd": ""
    })
    const [mintOverlayState, setMintOverlayState] = useState(false);

    const totalSupply = editionSalesInfo.totalMinted    

    const editionQuery =  
        `query {        
            erc721Drops(
                orderBy: createdAt
                orderDirection: desc
                where: {address: "${editionAddress}"}
            ) {
                name
                owner
                symbol
                salesConfig {
                    publicSalePrice
                    publicSaleStart
                    publicSaleEnd
                }
                address
                maxSupply
                totalMinted
                editionMetadata {
                    imageURI
                    animationURI
                    contractURI
                    description
                }
                creator
            }                 
        }`    

    const editionPromise = client.query(editionQuery).toPromise()

    const runningPromise = async () => { 
        return editionPromise.then((result) => {
            return result
        })
    }

    const cleanData = (input) => {
        const cleanedData = input.data.erc721Drops[0]
        return cleanedData
    }

    const fetchData = async () => {
        console.log("fetching data")
        try {
            setLoading(true);
            const queryResults = await runningPromise()
            const provider = getDefaultProvider("goerli", 5)
            console.log("PROVIDER", provider)
            const contract = new ethers.Contract(editionAddress, abi, provider)
            console.log("CONTRACT", contract)
            // Get metadata renderer
            const metadataRendererAddress = await contract.metadataRenderer();
            const metadataRendererContract = new ethers.Contract(metadataRendererAddress.toString(), metadataRendererAbi, provider);
            const metadataBase = await metadataRendererContract.metadataBaseByContract(editionAddress);
            const metadataURI = ipfsImage(metadataBase.base)
            const axios = require('axios').default;
            const {data: metadata} = await axios.get(metadataURI) 
            console.log("METADATA", metadata)
            const cleanedQueryResults = cleanData(queryResults)

            const imageURI = metadata.image;
            console.log("IMAGE URI", imageURI)
            const imageIPFSGateway = ipfsImage(imageURI)
            setEditionsImageSRC(imageIPFSGateway)

            const animationURI = metadata.losslessAudio
            const animnationIPFSGateway = ipfsImage(animationURI)
            console.log("animnationIPFSGateway", animnationIPFSGateway)
            setEditionsAnimationSRC(animnationIPFSGateway)

            const salesConfig = await contract.salesConfig();
            console.log("SALES CONFIG", salesConfig)
            console.log("PRICE", ethers.utils.formatEther(salesConfig.publicSalePrice))
            const symbol = await contract.symbol()
            const config = await contract.config()
            const totalMinted = await contract.totalSupply();
            const editionSalesInfo = {
                "name": metadata.name,
                "symbol": symbol,
                "creator": "ME",
                "maxSupply": config.editionSize,
                "totalMinted": totalMinted,
                "publicSalePrice": salesConfig.publicSalePrice,
                "publicSaleStart": salesConfig.presaleStart,
                "publicSaleEnd": salesConfig.publicSaleEnd,
            }
            setEditionSalesInfo(editionSalesInfo);

        } catch(error){
            console.error(error.message);
        } finally {
            setLoading(false)
        } 
    }

    // ZORA NFT DROPS Mint Call

    const editionSalePriceConverted = Number(editionSalesInfo.publicSalePrice)
    const editionTotalMintPrice = String(mintQuantity.queryValue * editionSalePriceConverted)
    const totalMintValueEth = ethers.utils.formatUnits(editionTotalMintPrice)

    const { 
        data: mintData, 
        isError: mintError, 
        isLoading: mintLoading, 
        isSuccess: mintSuccess, 
        status: mintStatus, 
        error,
        write: mintWrite
        } = useContractWrite({
        mode: 'recklesslyUnprepared',
        addressOrName: editionAddress,
        contractInterface: abi,
        functionName: 'purchase',
        args: [
            mintQuantity.queryValue
        ],
        onError(error, variables, context) {
            console.log("error", JSON.stringify(error.message))
        },
        onSuccess(cancelData, variables, context) {
            console.log("Success!", cancelData)
        },
    })

    // handle loading state UI when minting
    const mintAndSetOverlayState = () => {
        mintWrite()
        setMintOverlayState(!mintOverlayState)
    }

    const clearLoadingState = () => {
        setMintOverlayState(!mintOverlayState);
    }    

    // Wait for data from mint call
    const { data: mintWaitData, isLoading: mintWaitLoading } = useWaitForTransaction({
        hash:  mintData?.hash,
        onSuccess(mintWaitData) {
            console.log("txn complete: ", mintWaitData)
            console.log("txn hash: ", mintWaitData.transactionHash)
        }
    })           

    // max supply check
    const maxSupplyCheck = (supply) => {
        if (supply == 18446744073709551615) {
            return "∞"
        } else {
            return supply
        }
    }

    useEffect(() => {
        fetchData();
        }, 
        []
    )

    const truncateName = (name) => {
        if (name.length > 29) {
            return name.substring(0, 29) + '...';
         }
         return name;
    }

    return (
        <>
            {
                !!editionAddress ? (
                    <>
                        {loading ? (
                        <div className="text-[#f70500]">
                        loading . . .
                        </div>   
                        ) : (
                        <div  className="   border-[1px] border-[#f70500] text-[#f70500] h-[100%] w-full text-[#f70500] flex flex-row flex-wrap justify-center ">
                            <div className=" flex flex-row sm:w-[100%] justify-center border-b-[1px] border-[#f70500]">
                                <div className="relative" style={{width: 354, height: 354 }}>
                                    <Image 
                                        src={editionsImageSRC}
                                        layout="fill"
                                        objectFit='cover'        
                                    />
                                </div>        
                            </div>
                            { mintWaitLoading == false && mintOverlayState == true && mintStatus == "success" ? (
                            <div className=" h-[268px] bg-[#f70500] flex flex-row sm:w-[100%] justify-center items-center  ">
                                <div className=" w-full  flex flex-row flex-wrap justify-center space-y-4">
                                    <div className="text-lg font-bold  flex flex-row w-full h-fit justify-center text-[#0E0411]">
                                        Mint Successful ☼☽
                                    </div>
                                    <a 
                                        className="decoration-1 text-sm pb-2 h-fit justify-center underline flex flex-row w-full text-[#0E0411]"
                                        href={"https://etherscan.io/tx/" + mintWaitData.transactionHash} 
                                    >
                                        View txn on Etherscan
                                    </a>
                                    <button
                                        onClick={() => clearLoadingState()}
                                        className=" h-fit text-[#f70500] border-[1px] border-[#0E0411] bg-[#0E0411] hover:bg-[#0e0311] hover:text-[#0E0411]  p-2 justify-center w-6/12 text-[16px] flex flex-row h-fit hover:text-[#0e0311]"
                                    >
                                        CLOSE
                                    </button>
                                </div>
                            </div>
                            ) : (
                                <>
                                    { mintWaitLoading == false && mintOverlayState == true && mintStatus == "error" ? (                                                                    
                                    <div className="h-[268px] bg-[#f70500] flex flex-row w-full sm:w-[100%] justify-center items-center">
                                        <div className="my-4 w-full h-fit flex flex-row flex-wrap justify-center  space-y-4">
                                            <div className="text-lg font-bold  flex flex-row w-full h-fit justify-center text-[#0E0411]">
                                                Error in mint process
                                            </div>                           
                                            <button
                                                onClick={() => clearLoadingState()}
                                                className=" h-fit text-[#f70500] border-[1px] border-[#0E0411] bg-[#0E0411] hover:bg-[#0e0311] hover:text-[#0E0411]  p-2 justify-center w-6/12 text-[16px] flex flex-row h-fit hover:text-[#0e0311]"
                                            >
                                                CLOSE
                                            </button>
                                        </div>
                                    </div>                                                          
                                    ) : (
                                    <div className="w-full ">
                                        <CustomAudioPlayer  musicSRC={editionsAnimationSRC} />
                                        <div className=" flex flex-row flex-wrap w-full pb-4 space-y-2 ">
                                            <div className="ml-3 mt-3 flex flex-row w-full text-xl">
                                                <a
                                                    className="hover:underline decoration-1"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    href={`https://opensea.io/assets/${editionAddress}/1`}
                                                >
                                                    {truncateName(editionSalesInfo.name)}
                                                </a>
                                            </div>
                                        </div>
                                        <div className=" justify-evenly flex flex-row flex-wrap w-full py-3 border-[1px] border-[#f70500]">
                                            <div
                                                className="flex flex-row  text-xl border-[#f70500] border-2 w-[30%] rounded  bg-[#f70500] justify-center text-center  text-black"
                                            >
                                                {"$" + editionSalesInfo.symbol}
                                            </div>
                                            <div className="flex flex-row  items-center justify-center text-xl ">
                                                {(totalSupply) + " / " + maxSupplyCheck(editionSalesInfo.maxSupply) + " MINTED"}
                                            </div>                                
                                        </div>                                                              
                                        <div className="w-full grid grid-cols-4 ">
                                            <MintQuantityV2 mintQuantityCB={setMintQuantity} colorScheme={vibes}/>                              
                                            <div 
                                                className="flex flex-row justify-center col-start-2 col-end-5  text-lg  p-3  w-full h-full border-[1px] border-solid border-[#f70500]"
                                            >
                                                {"" + totalMintValueEth + " $CHILL"}
                                            </div>             

                                            { mintWaitLoading == true ? (
                                            <button 
                                                disabled={true}
                                                className="flex flex-row justify-center col-start-1 col-end-5  text-2xl p-3  w-full h-full border-[1px] border-solid border-[#f70500] hover:bg-[#0e0311] hover:text-black bg-[#f70500] text-black"
                                                // onClick={() => mintWrite()}   
                                            >
                                                <div className='flex flex-row justify-center flex-wrap'>
                                                    <img
                                                    className=" rounded-full p-1 mt-2" 
                                                    width="25px"
                                                    src="/SVG-Loaders-master/svg-loaders/tail-spin.svg"
                                                    />
                                                </div>
                                            </button>    
                                            ) : (                                                  
                                            <button 
                                                className="flex flex-row justify-center col-start-3 col-end-5  text-2xl p-3  w-full h-full border-[1px] border-solid border-[#f70500] hover:bg-[#0e0311] hover:text-black bg-[#f70500] text-black"
                                                onClick={() => mintAndSetOverlayState()}   
                                            >
                                                Mint
                                            </button>                                                                   
                                            )}              
                                        </div>  
                                    </div>                                   
                                    )}
                                </>
                            )}
                        </div>                                                                          
                        )}
                    </>                           
                ) : (
                <div>
                    {"::: NO RESULTS :::"}
                </div>
                )
            }
        </>
    )
}

export default EditionCard