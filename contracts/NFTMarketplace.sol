// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

// Using ERC721 standard
// Functionality we can use
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

// public means available from the client application
// view means it's not doing any transaction work

// Creating our contract ->Inherited from ERC721URIStorage
contract NFTMarketplace is ERC721URIStorage {
    // allows us to use the coutner utility.
    using Counters for Counters.Counter;
    // when the first token is minted it'll get a value of zero, the second one is one
    // and then using counters this we'll increment token ids
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    // fee to list an nft on the marketplace
    // charge a listing fee.
    uint256 listingPrice = 0.025 ether;

    // declaring the owner of the contract
    // owner earns a commision on every item sold
    address payable owner;

    // keeping up with all the items that have been created
    // pass in the integer which is the item id and it returns a market item.
    // to fetch a market item, we only need the item id
    mapping(uint256 => MarketItem) private idToMarketItem;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    // have an event for when a market item is created.
    // this event matches the MarketItem
    event MarketItemCreated (
        uint256 indexed tokenId,
        address payable seller,
        address payable owner,
        uint256 price,
        bool sold
    );

    // set the owner as the msg.sender
    // the owner of the contract is the one deploying it
    constructor() {
        owner = payable(msg.sender);
    }
    /* Updates the listing price of the contract */
    function updateListingPrice(uint _listingPrice) public payable {
        require (owner == msg.sender, "Only Marketplace owner can update the listing price");

        listingPrice = _listingPrice;
    }

    /* Returns the listing price of the contract */
    // when we deploy the contract, on the frontend we don't know how much to list it for
    // so we call the contract and get the listing price and make sure we're sending the right amount of payment
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    // Create New Token
    function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        createMarketItem(newTokenId, price);

        return newTokenId;
    }

    // Create Market Item for New Token
    function createMarketItem(uint256 tokenId, uint256 price) private {
        // require a certain CONDITION, in this case price greater than 0
        require(price > 0, "Price must be at least 1");
        // require that the users sending in the transaction is sending in the correct amount
        require(msg.value == listingPrice, "Price must be equal to listing price");

        // create the mapping for the market items 
        // payable(address(0)) is the owner. 
        // currently there's no owner as the seller is putting it to market so it's an empty address
        // last value  is boolean for sold, its false because we just put it so it's not sold yet
        // this is creating the first market item
        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

    // Transfer Ownership of Token from Sender to Address(this), tokenId
        _transfer(msg.sender, address(this), tokenId);

        emit MarketItemCreated(tokenId, msg.sender, address(this), price, false); 
    }
    
    // Resell Token /* allows someone to resell a token they have purchased */
    function resellToken(uint256 tokenId, uint256 price) public payable {
        require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation!");
        require(msg.value == listingPrice, "Price must be equal to listing price!");

        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(address(this));

        _itemsSold.decrement();

        _transfer(msg.sender, address(this), tokenId);
    }

    // Create Market Sale /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(uint256 tokenId) public payable {
        uint price = idToMarketItem[tokenId].price;

        require(msg.value == price, "Please submit the asking price in order to complete the purchase");

        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(address(0));

        _itemsSold.increment();

        _transfer(address(this), msg.sender, tokenId);

        payable(owner).transfer(listingPrice);
        payable(idToMarketItem[tokenId].seller).transfer(msg.value);
    }

    // Fetch Market Items /* View Only
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _tokenIds.current();
        uint unsoldItemCount = _itemsSold.current() - _itemsSold.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);

        for(uint i = 0; i < itemCount; i++ ) {
            if(idToMarketItem[i + ].owner == address(this)) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];

                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }

        return items;
    }

    // Fetch MY NFTs
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for(uint i = 0; i < totalItemCount; i++ ) {
            if(idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }
        
        MarketItem[] memory items = new MarketItem[](itemCount);

        for(uint i = 0; i < itemCount; i++ ) {
            if(idToMarketItem[i+1].owner == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];

                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }

        return items;
    }
}