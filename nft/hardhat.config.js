require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    polygon_amoy: {
      url: 'https://rpc-amoy.polygon.technology',
      accounts: [`0x${process.env.PRIVATE_ADDRESS}`],
      chainId: 80002,
    },
  },
  sourcify: {
    enabled: true,
  },
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 350,
      },
    },
  },
};
