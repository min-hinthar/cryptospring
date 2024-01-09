import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';
import { create } from '@web3-storage/w3up-client';

import { MarketAddress, MarketAddressABI } from './constants';
// import { create } from 'ipfs-http-client';
// import { create as ipfsHttpClient } from 'ipfs-http-client';
// import { Buffer } from 'buffer';

// const projectId = 'xx';
// const projectSecret = 'xx';
// const auth = `Basic${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;

// const options = {
//   host: 'ipfs.infura.io',
//   port: 5001,
//   protocol: 'https',
//   apiPath: '/api/v0',
//   headers: {
//     authorization: auth,
//   },
// };

// const client = ipfsHttpClient(options);

export const NFTContext = React.createContext();

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const nftCurrency = 'MATIC';

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log('No accounts found');
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    setCurrentAccount(accounts[0]);
    window.location.reload();
  };

  const uploadToIPFS = async (files) => {
    try {
      const client = await create();
      const space = await client.createSpace('CryptoSpring');
      const myAccount = await client.login(process.env.WEB_3_LOGIN);
      await myAccount.provision(space.did());
      // await space.createRecovery(myAccount.did());
      // await space.save();
      await client.setCurrentSpace(process.env.WEB_3_STORAGE_KEY);

      const cid = await client.uploadDirectory(files);
      const url = `https://${cid}.ipfs.w3s.link/${files[0].name}`;
      console.log('stored files with cid:', cid);
      console.log(url);
      return url;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <NFTContext.Provider value={{ nftCurrency, connectWallet, currentAccount, uploadToIPFS }}>
      {children}
    </NFTContext.Provider>
  );
};
