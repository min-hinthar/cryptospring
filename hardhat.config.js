require('@nomiclabs/hardhat-waffle');

const ALCHEMY_API_KEY = 'hO7EsxDJnAof-BvdQvUH34rzQzIi9i24';
const GOERLI_PRIVATE_KEY_1 = '084bc126962981023285e8cb2fbd9d926099b383bb829ad2a39997b7e3e553cc';

module.exports = {
  solidity: '0.8.4',
  defaultNetwork: 'goerli',
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY_1],
    },
  },
};
