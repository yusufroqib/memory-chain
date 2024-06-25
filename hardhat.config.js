require('@nomicfoundation/hardhat-toolbox')
require("dotenv").config();

module.exports = {
  defaultNetwork: 'localhost',
  networks: {
    hardhat: {},
    celo: {
      url: process.env.CELO_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      // chainId: 44787
    },
  },
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  mocha: {
    timeout: 40000,
  },
}
