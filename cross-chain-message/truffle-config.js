const HDWalletProvider = require("@truffle/hdwallet-provider");  
const private_key = '';

// find avaialble rpc endpoint in this site: https://chainlist.org/chain/5
module.exports = {  
 networks: {  
    goerli: {  
        provider: () => new HDWalletProvider(private_key, "https://rpc.ankr.com/eth_goerli"),  
        network_id: 5  
    },
    base: {
      provider: () => new HDWalletProvider(private_key, "https://mainnet.base.org"),  
      network_id: 8453,
  
    },
    ethereum: {
      provider: () => new HDWalletProvider(private_key, "https://eth.rpc.blxrbdn.com"),
      network_id: 1,
    }
   },

 compilers: {  
    solc: {  
      version: "0.8.20",  
    }  
  }  
};