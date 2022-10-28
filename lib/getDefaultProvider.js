const { ethers } = require('ethers')

const getDefaultProvider = (networkName, chainId) => {
  const polygonRpc = 'https://polygon-rpc.com'
  const mumbaiRpc = 'https://rpc-mumbai.maticvigil.com'
  const chainIdInt = parseInt(chainId?.toString())

  if (chainIdInt === 5) {
    return ethers.getDefaultProvider('https://rpc.ankr.com/eth_goerli')
  }
  if (chainIdInt === 137) {
    return ethers.getDefaultProvider(polygonRpc)
  } else {
    return ethers.getDefaultProvider(mumbaiRpc)
  }
}

export default getDefaultProvider
