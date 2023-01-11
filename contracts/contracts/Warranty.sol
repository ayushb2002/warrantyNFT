// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract WarrantyToken is ERC721("Warranty Token", "WRTY") {
    using SafeMath for uint256;

    uint8 public decimals = 0;
    uint256 public totalSupply;

    // Mapping from token ID to warranty details
    mapping(uint256 => Warranty) public warranties;
    // Mapping from token ID to token URI
    mapping(uint256 => string) public tokenURIs;

    // Struct to hold warranty details
    struct Warranty {
        address owner;
        address company;
        uint256 expirationDate;
        string productId;
    }

    // Constructor
    constructor(address _company, string memory _productId) {
        totalSupply = 1;
        warranties[totalSupply] = Warranty(_company, _company, block.timestamp, _productId);
    }

    // ERC721 functions
    function mint(
        address _owner,
        uint256 _expirationDate,
        string memory _productId,
        string memory _tokenURI
    ) public returns (uint256) {
        totalSupply = totalSupply.add(1);
        warranties[totalSupply] = Warranty(
            _owner,
            msg.sender,
            _expirationDate+block.timestamp,
            _productId
        );

    setTokenURI(totalSupply, _tokenURI);

        emit Transfer(address(0), _owner, totalSupply);

        return totalSupply;
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) public override {
        require(
            _from == warranties[_tokenId].owner,
            "Sender is not the owner of the token"
        );
        require(_to != address(0), "Cannot transfer to the zero address");
        warranties[_tokenId].owner = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) public override {
        require(
            warranties[_tokenId].owner == msg.sender,
            "Sender is not the owner of the token"
        );
        warranties[_tokenId].owner = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

    function ownerOf(uint256 _tokenId) override public view returns (address) {
        return warranties[_tokenId].owner;
    }

    function balanceOf(address _owner) override public view returns (uint256) {
        uint256 balance = 0;
        for (uint256 i = 1; i <= totalSupply; i++) {
            if (warranties[i].owner == _owner) {
                balance = balance.add(1);
            }
        }
        return balance;
    }

    function getApproved(uint256 _tokenId) override public view returns (address) {
        return warranties[_tokenId].owner;
    }

    function isApprovedForAll(
        address _operator,
        uint256 _tokenId
    ) public view returns (bool) {
        return _operator == warranties[_tokenId].owner;
    }

    function setApprovalForAll(address _operator, bool _approved, uint256 _tokenId) public {
        require(
            warranties[_tokenId].owner == msg.sender,
            "Sender is not the owner of the token"
        );
        warranties[_tokenId].owner = _approved ? _operator : address(0);
    }

    function isExpired(uint256 _tokenId) public view returns (bool) {
        return warranties[_tokenId].expirationDate <= block.timestamp;
    }

    function extendWarranty(uint256 _tokenId, uint256 _expirationDate) public {
        require(
            warranties[_tokenId].company == msg.sender,
            "Sender is not the company that issued the token"
        );
        warranties[_tokenId].expirationDate = _expirationDate;
    }

    function requestRefund(uint256 _tokenId) public view {
        require(
            warranties[_tokenId].owner == msg.sender,
            "Sender is not the owner of the token"
        );
        require(isExpired(_tokenId), "Token is not expired");
        // Perform refund or replacement process here
    }

    function recordRepair(uint256 _tokenId) public view {
        require(
            warranties[_tokenId].company == msg.sender,
            "Sender is not the company that issued the token"
        );
        // Record repair or replacement process here
    }

    function setTokenURI(uint256 _tokenId, string memory _uri) public {
        require(_tokenId <= totalSupply, "Token ID does not exist");
        require(warranties[_tokenId].owner == msg.sender, "Sender is not the owner of the token");
        tokenURIs[_tokenId] = _uri;
    }

}
