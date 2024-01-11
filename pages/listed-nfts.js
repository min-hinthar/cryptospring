import { useState, useEffect, useContext } from 'react';

import { NFTContext } from '../context/NFTContext';
import { Loader, NFTCard } from '../components';

const ListedNFTs = () => {
  const [NFTs, setNFTs] = useState();
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return (
      <div className="flex-start min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      Loader
    </div>
  );
};

export default ListedNFTs;
