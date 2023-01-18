import abi from '../WarrantyNFT.json'
import {
    ethers
} from 'ethers'

import { pinJSONToIPFS } from './pinata';

// const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
// const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
// const web3 = createAlchemyWeb3(alchemyKey);

const contractAddress = "0x3258E5b5bc4A442915853338fC925E0BD4976d8C";

export const executeFunction = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi.abi, signer);
    return contract;
};

export const registerProductToBlockchain = async (companyId, expiry) => {
    const contract = executeFunction();
    try
    {
        const txn = await contract.registerItem(companyId, expiry);
        await txn.wait(1);
        const itemId = await contract.returnLatestItemId();
        return itemId;
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

export const redeemWarranty = async (_owner, _itemId, _tokenURI) => {
    const contract = executeFunction();
    try{
        const txn = await contract.redeemWarranty(_owner, _itemId, _tokenURI);
        await txn.wait(1);
        const tokenId = await contract.returnLatestTokenId();
        return tokenId;
    }catch(err)
    {
        console.log(err);
        return false;
    }
}