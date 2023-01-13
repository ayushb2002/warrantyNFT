import abi from './WarrantyToken.json'
import { ethers } from 'ethers'

const minting = async () => {
    const contract = new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', abi.abi);
}