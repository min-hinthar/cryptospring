import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';
import { create } from '@web3-storage/w3up-client';

import { MarketAddress, MarketAddressABI } from './constants';

const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

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

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    setCurrentAccount(accounts[0]);
    window.location.reload();
  };

  // WEB3-STORAGE W3UP-CLIENT IPFS UPLOAD DOCUMENTATION
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
      console.log('Error uploading file to IPFS', error);
    }
  };

  const createSale = async (url, formInputPrice, isReselling, id) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    // Convert Price into Blockchain readable units
    const price = ethers.utils.parseUnits(formInputPrice, 'ether');
    const contract = fetchContract(signer);
    const listingPrice = await contract.getListingPrice();
    const transaction = await contract.createToken(url, price, { value: listingPrice.toString() });

    await transaction.wait();

    console.log(contract);
  };

  const createNFT = async (formInput, fileUrl, router, fileID) => {
    const client = await create();
    const space = await client.createSpace('CryptoSpring');
    const myAccount = await client.login(process.env.WEB_3_LOGIN);
    await myAccount.provision(space.did());
    // await space.createRecovery(myAccount.did());
    // await space.save();
    await client.setCurrentSpace(process.env.WEB_3_STORAGE_KEY);

    const { name, description, price } = formInput;

    if (!name || !description || !price || !fileUrl) return;

    const data = new Blob([JSON.stringify({ name, description, image: fileUrl, fileID })], { type: 'application/json' });
    const files = [new File([data], fileID)];

    try {
      const added = await client.uploadDirectory(files);
      console.log('FILE ID: ', fileID);

      const url = `https://${added}.ipfs.w3s.link/${fileID}`;

      await createSale(url, price);

      router.push('/');
      return true;
    } catch (error) {
      console.log('Error uploading file to IPFS', error);
      return false;
    }
  };

  const fetchNFTs = async () => {
    // const provider = new ethers.providers.JsonRpcProvider();
    const network = 'goerli';
    const apiKey = process.env.ALCHEMY_API_KEY;
    const provider = new ethers.providers.AlchemyProvider(network, apiKey);
    const contract = fetchContract(provider);

    try {
      const data = await contract.fetchMarketItems();

      const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
        const tokenURI = await contract.tokenURI(tokenId);
        const { data: { image, name, description } } = await axios.get(tokenURI);
        const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

        return {
          price,
          tokenId: tokenId.toNumber(),
          seller,
          owner,
          image,
          name,
          description,
          tokenURI,
        };
      }));
      console.log('Fetch NFTs Success', items);
      return items;
    } catch (e) {
      console.log('No market items: ', e);
      return [];
    }
  };

  const fetchMyNFTsOrListedNFTs = async (type) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);

    const data = type === 'fetchItemsListed'
      ? await contract.fetchItemsListed()
      : await contract.fetchMyNFTs();

    const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
      const tokenURI = await contract.tokenURI(tokenId);
      const { data: { image, name, description } } = await axios.get(tokenURI);
      const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

      return {
        price,
        tokenId: tokenId.toNumber(),
        seller,
        owner,
        image,
        name,
        description,
        tokenURI,
      };
    }));

    return items;
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <NFTContext.Provider value={{ nftCurrency, connectWallet, currentAccount, uploadToIPFS, createNFT, fetchNFTs, fetchMyNFTsOrListedNFTs }}>
      {children}
    </NFTContext.Provider>
  );
};
