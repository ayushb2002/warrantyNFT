import abi from '../WarrantyNFT.json'
import {
    ethers
} from 'ethers'
import {pinJSONToIPFS} from './pinata.js'

require('dotenv').config();
const axios = require('axios');
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;

const contractABI = require('../WarrantyNFT.json');
const contractAddress = "0xc4E58C5de0Aaa80e253afeE9B182d6f56D69Eb89";

export const pinJSONToIPFS = async(JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata ⬇️
    return axios 
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
           return {
               success: true,
               pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

    });
};

export const executeFunction = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    const contract = new ethers.Contract("0xc4E58C5de0Aaa80e253afeE9B182d6f56D69Eb89", abi.abi, signer);
    console.log(contract);
    return contract;
};

export const registerProductToBlockchain = async (companyId, expiry) => {
    const contract = executeFunction();
    try
    {
        const txn = await contract.registerItem(companyId, expiry);
        await txn.wait(1);
        const productId = await contract.returnLatestProductId();
        return productId;
    }
    catch(e)
    {
        console.log(e);
        return false;
    }
};

export const registerCompany = async () => {
    const contract = executeFunction();
    try
    {
        const txn = await contract.registerCompany();
        await txn.wait(1);
        const companyId = await contract.returnLatestCompanyId();
        return companyId;
    }
    catch(e)
    {
        console.log(e);
        return false;
    }
};

export const mintNFT = async(url, name, description) => {
    //error handling
    if (url.trim() == "" || (name.trim() == "" || description.trim() == "")) { 
           return {
               success: false,
               status: "❗Please make sure all fields are completed before minting.",
           }
     }
   
     //make metadata
     const metadata = new Object();
     metadata.name = name;
     metadata.image = url;
     metadata.description = description;
   
     //make pinata call
     const pinataResponse = await pinJSONToIPFS(metadata);
     if (!pinataResponse.success) {
         return {
             success: false,
             status: "😢 Something went wrong while uploading your tokenURI.",
         }
     } 
     const tokenURI = pinataResponse.pinataUrl;  

     return tokenURI;
   }

export const redeemWarranty = async (_owner, _tokenId, _tokenURI) => {
    const contract = executeFunction();
    try{
        const txn = await contract.redeemWarranty(_owner, _tokenId, _tokenURI);
        await txn.wait(1);
        const tokenId = await contract.returnLatestProductId();
        return tokenId;
    }catch(err)
    {
        console.log(err);
        return false;
    }
}