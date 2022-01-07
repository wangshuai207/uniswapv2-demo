// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";


async function main() {

  const [deployer] = await ethers.getSigners();
  const sFactory = await ethers.getContractFactory("UniswapV2Factory");
  const sfactory = await sFactory.deploy(deployer.getAddress());

  await sfactory.deployed();

  const codeHash1=await sfactory.INIT_CODE_PAIR_HASH()
  console.log("INIT_CODE_PAIR_HASH:", codeHash1);
  
  console.log("SushiswapFactory deployed to:", sfactory.address);


  const uFactory = await ethers.getContractFactory("UniswapV2Factory");
  const ufactory = await uFactory.deploy(deployer.getAddress());

  await ufactory.deployed();
  console.log("UniswapV2Factory deployed to:", ufactory.address);
  //0x77D5cCc214002719e1c34E3222cB57F646110F74  V1
  //0x16E5D64F651CEd42a753c64CfA5D1277Bb9c41C1  V2
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
