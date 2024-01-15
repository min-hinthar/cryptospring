require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.4',
  defaultNetwork: 'goerli',
  allowUnlimitedContractSize: true,
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY_1, GOERLI_PRIVATE_KEY_2],
      gas: 1000000,
      gasPrice: 5000000,
      gasLimit: 6000000,
    },
  },
};
