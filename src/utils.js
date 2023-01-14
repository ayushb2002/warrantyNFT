import abi from './WarrantyToken.json'
import { ethers } from 'ethers'

const createProduct = async (company, expiry) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    
}

const minting = async (company, expiry) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    const contract = new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', abi.abi, signer);
    console.log(contract);
    const warranty = contract.Warranty()
    const nft = await contract.mint(company, expiry);
    console.log(nft);
    return nft;
}

export default minting;