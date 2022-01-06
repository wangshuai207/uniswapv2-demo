// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";


async function main() {

  const [deployer] = await ethers.getSigners();
  const Factory = await ethers.getContractFactory("UniswapV2Factory");
  const factory = await Factory.deploy(deployer.getAddress());

  await factory.deployed();

  console.log("UniswapV2Factory deployed to:", factory.address);
  //0x77D5cCc214002719e1c34E3222cB57F646110F74  V1
  //0x16E5D64F651CEd42a753c64CfA5D1277Bb9c41C1  V2
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
