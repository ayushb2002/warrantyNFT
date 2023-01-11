const hre = require("hardhat");

// async function main() {
//   const company = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
//   const Warranty = await hre.ethers.getContractFactory("WarrantyToken");
//   const warranty = await Warranty.deploy(company, 101);

//   await warranty.deployed();

//   console.log(`Warranty Contract Deployed at Address: ${warranty.address} \n`);

//   product = await warranty.mint(company, 365, 101, "#");
//   totalCount = await warranty.totalSupply();
//   console.log(`Product: ${product} and count is : ${totalCount}`);

// }

const registerProduct =   async (company, productId) => {
  const Warranty = await hre.ethers.getContractFactory("WarrantyToken");
  const warranty = await Warranty.deploy(company, productId);
  await warranty.deployed();
  console.log(`Warranty - ${warranty.address}`);
  return warranty.address;
}

registerProduct().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

export default registerProduct;