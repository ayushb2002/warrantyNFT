// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract WarrantyNFT is ERC721URIStorage {

    using SafeMath for uint256;

    constructor() ERC721("Warranty", "WRTY") {}

    struct Item
    {
        uint256 itemId;
        uint256 expiry;
        address manufacturer;
        address owner;
    }

    uint256 public companyCounter = 0;
    uint256 public tokenCounter = 0;
    mapping(uint256 => address) public companyName;
    mapping(uint256 => Item[]) public itemStore;
    mapping(uint256 => uint256[]) public trackRepair;

    function registerCompany() public returns (uint256)
    {
        companyCounter += 1;
        companyName[companyCounter] = msg.sender;
        return companyCounter;
    }


    function registerItem(uint256 _companyId, uint256 _expiry) public returns (uint256)
    {
        require(companyName[_companyId] == msg.sender);
        tokenCounter += 1;
        itemStore[tokenCounter].push(Item(tokenCounter, _expiry * 1 days, msg.sender, msg.sender));
        return tokenCounter;
    }

    function redeemWarranty(address _owner, uint256 _tokenId, string memory _tokenURI) public returns (uint256)
    {
        require(!_exists(_tokenId), "Item already exist!");
        _safeMint(_owner, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
        itemStore[tokenCounter].push(Item(itemStore[_tokenId][itemStore[_tokenId].length - 1].itemId, itemStore[_tokenId][itemStore[_tokenId].length - 1].expiry + block.timestamp, itemStore[_tokenId][itemStore[_tokenId].length - 1].manufacturer, _owner));
        return itemStore[_tokenId][itemStore[_tokenId].length - 1].expiry - block.timestamp;    // returns time left before expiry of the product
    }

    function extendWarranty(uint256 _companyId, uint256 _tokenId, uint256 _extension, address _owner) public returns (uint256)
    {
        require(companyName[_companyId] == msg.sender);
        require(_exists(_tokenId));
        require(itemStore[_tokenId][itemStore[_tokenId].length - 1].expiry >= block.timestamp);
        require(itemStore[_tokenId][itemStore[_tokenId].length - 1].owner == _owner);
        itemStore[_tokenId].push(Item(itemStore[_tokenId][itemStore[_tokenId].length - 1].itemId, itemStore[_tokenId][itemStore[_tokenId].length - 1].expiry + _extension * 1 days, msg.sender, _owner));
        return itemStore[_tokenId][itemStore[_tokenId].length - 1].expiry - block.timestamp;    // returns the new time left before expiry of product
    }

    function isExpired(uint256 _tokenId) public view returns (bool)
    {
        require(_exists(_tokenId), "Warranty does not exist!");
        return itemStore[_tokenId][itemStore[_tokenId].length - 1].expiry <= block.timestamp;
    }

    function recordRepair(uint256 _tokenId, address _owner) public
    {
        require(!isExpired(_tokenId), "Warranty has expired!");
        require(itemStore[_tokenId][itemStore[_tokenId].length - 1].owner == _owner);
        trackRepair[_tokenId].push(block.timestamp);
    }

    function sellProduct(address _from, address _to, uint256 _tokenId) public 
    {
        require(itemStore[_tokenId][itemStore[_tokenId].length - 1].owner == _from);
        require(_exists(_tokenId));
        require(_ownerOf(_tokenId) == _from);
        safeTransferFrom(_from, _to, _tokenId);
        itemStore[_tokenId].push(Item(itemStore[_tokenId][itemStore[_tokenId].length - 1].itemId, itemStore[_tokenId][itemStore[_tokenId].length - 1].expiry, itemStore[_tokenId][itemStore[_tokenId].length - 1].manufacturer, _to));
    }

    function isOwner(address _owner, uint256 _tokenId) public view returns (bool)
    {
        require(_exists(_tokenId));
        return _ownerOf(_tokenId) == _owner;
    }

    function timeToExpire(uint256 _tokenId) public view returns (uint256)
    {
        return (itemStore[_tokenId][itemStore[_tokenId].length - 1].expiry - block.timestamp)/ 1 days;
    }

    function returnLatestCompanyId() public view returns (uint256)
    {
        return companyCounter;
    }

    function returnLatestProductId() public view returns (uint256)
    {
        return tokenCounter;
    }

}