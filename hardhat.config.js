require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.4',
  defaultNetwork: 'goerli',
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.GOERLI_PRIVATE_KEY_1, process.env.GOERLI_PRIVATE_KEY_2, process.env.GOERLI_PRIVATE_KEY_3],
      gas: 50000,
    },
  },
};
