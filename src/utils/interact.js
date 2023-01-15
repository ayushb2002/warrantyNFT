import abi from '../WarrantyNFT.json'
import {
    ethers
} from 'ethers'

export const executeFunction = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    const contract = new ethers.Contract("0x5fbdb2315678afecb367f032d93f642f64180aa3", abi.abi, signer);
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
        return falsel
    }
};