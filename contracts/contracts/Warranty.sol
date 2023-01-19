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
    }

    struct Buyer
    {
        uint256 itemId;
        address owner;
        uint256 dateOfExpiry;
    }

    uint256 public companyCounter = 0;
    uint256 public tokenCounter = 0;
    uint256 public itemCounter = 0;
    mapping(uint256 => address) public companyName; // by companyId
    mapping(uint256 => Item) public itemStore; // by itemId
    mapping(uint256 => Buyer[]) public trackBuyer; // by tokenId
    mapping(uint256 => uint256[]) public trackRepair; // by tokenId

    function registerCompany() public returns (uint256)
    {
        companyCounter += 1;
        companyName[companyCounter] = msg.sender;
        return companyCounter;
    }


    function registerItem(uint256 _companyId, uint256 _expiry) public returns (uint256)
    {
        require(companyName[_companyId] == msg.sender);
        itemCounter += 1;
        itemStore[itemCounter] = Item(itemCounter, _expiry, msg.sender);
        return itemCounter;
    }

    function redeemWarranty(address _owner, uint256 _itemId, string memory _tokenURI) public returns (uint256)
    {
        tokenCounter += 1;
        require(!_exists(tokenCounter), "Item already exist!");
        _safeMint(_owner, tokenCounter);
        _setTokenURI(tokenCounter, _tokenURI);
        trackBuyer[tokenCounter].push(Buyer(_itemId, _owner, itemStore[_itemId].expiry + (block.timestamp/1 days)));
        return tokenCounter;
    }

    function extendWarranty(uint256 _companyId, uint256 _tokenId, uint256 _extension, address _owner) public returns (uint256)
    {
        require(companyName[_companyId] == msg.sender);
        require(_exists(_tokenId));
        require(trackBuyer[_tokenId][trackBuyer[_tokenId].length - 1].dateOfExpiry >= (block.timestamp * 1 days));
        require(trackBuyer[_tokenId][trackBuyer[_tokenId].length - 1].owner == _owner);
        trackBuyer[_tokenId].push(Buyer(trackBuyer[_tokenId][trackBuyer[_tokenId].length - 1].itemId, _owner, trackBuyer[_tokenId][trackBuyer[_tokenId].length - 1].dateOfExpiry + _extension * 1 days));
        return trackBuyer[_tokenId][trackBuyer[_tokenId].length - 1].dateOfExpiry - (block.timestamp * 1 days);    // returns the new time left before expiry of product
    }

    function isExpired(uint256 _tokenId) public view returns (bool)
    {
        require(_exists(_tokenId), "Warranty does not exist!");
        return trackBuyer[_tokenId][trackBuyer[_tokenId].length - 1].dateOfExpiry <= (block.timestamp / 1 days);
    }

    function recordRepair(uint256 _tokenId, address _owner) public
    {
        require(!isExpired(_tokenId), "Warranty has expired!");
        require(trackBuyer[_tokenId][trackBuyer[_tokenId].length - 1].owner == _owner);
        trackRepair[_tokenId].push(block.timestamp * 1 days);
    }

    function sellProduct(address _from, address _to, uint256 _tokenId) public 
    {
        require(trackBuyer[_tokenId][trackBuyer[_tokenId].length - 1].owner == _from);
        require(_exists(_tokenId));
        require(_ownerOf(_tokenId) == _from);
        safeTransferFrom(_from, _to, _tokenId);
        trackBuyer[_tokenId].push(Buyer(trackBuyer[_tokenId][trackBuyer[_tokenId].length - 1].itemId,  _to, trackBuyer[_tokenId][trackBuyer[_tokenId].length - 1].dateOfExpiry));
    }

    function isOwner(address _owner, uint256 _tokenId) public view returns (bool)
    {
        require(_exists(_tokenId));
        return _ownerOf(_tokenId) == _owner;
    }

    function timeToExpire(uint256 _tokenId) public view returns (uint256)
    {
        require(_exists(_tokenId), "Token does not exist!");
        if(isExpired(_tokenId))
        {
            return 0;
        }
        return (trackBuyer[_tokenId][trackBuyer[_tokenId].length - 1].dateOfExpiry - (block.timestamp / 1 days));
    }

    function returnLatestCompanyId() public view returns (uint256)
    {
        return companyCounter;
    }

    function returnLatestItemId() public view returns (uint256)
    {
        return itemCounter;
    }

    function returnLatestTokenId() public view returns (uint256)
    {
        return tokenCounter;
    }

}