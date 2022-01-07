// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";


async function main() {

  const [deployer] = await ethers.getSigners();
  const wethAddress="0x5eb3Bc0a489C5A8288765d2336659EbCA68FCd00"
  const sfactoryAddress="0x809d550fca64d94Bd9F66E60752A544199cfAC3D"
  const sRouter02 = await ethers.getContractFactory("UniswapV2Router02");
  const srouter = await sRouter02.deploy(sfactoryAddress,wethAddress);

  await srouter.deployed();

  console.log("SushiswapRouter02 deployed to:", srouter.address);

  const ufactoryAddress="0x4c5859f0F772848b2D91F1D83E2Fe57935348029"
  const uRouter02 = await ethers.getContractFactory("UniswapV2Router02");
  const urouter = await uRouter02.deploy(ufactoryAddress,wethAddress);

  await urouter.deployed();

  console.log("UniswapV2Router02 deployed to:", urouter.address);
  //
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
