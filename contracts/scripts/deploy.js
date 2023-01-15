const hre = require("hardhat");

async function main() {
  const company = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const Warranty = await hre.ethers.getContractFactory("WarrantyNFT");
  const warranty = await Warranty.deploy();

  await warranty.deployed();

  console.log(`Warranty Contract Deployed at Address: ${warranty.address} \n`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});