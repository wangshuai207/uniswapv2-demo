// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { Contract } from 'ethers'
import UniswapV2Pair from '../artifacts/contracts/UniswapV2Factory.sol/UniswapV2Pair.json'
import UniswapV2Factory from '../artifacts/contracts/UniswapV2Factory.sol/UniswapV2Factory.json'


async function main() {

  const [deployer] = await ethers.getSigners();
  const tokenAddressA="0xd6e1afe5cA8D00A2EFC01B89997abE2De47fdfAf";
  const tokenAddressB="0x99dBE4AEa58E518C50a1c04aE9b48C9F6354612f";
  const sfactory="0xB0f05d25e41FbC2b52013099ED9616f1206Ae21B"
  //const ufactory="0x4c5859f0F772848b2D91F1D83E2Fe57935348029"
  // initialize V2
  // const pairAddress="0x1B7f8CE71a9c84D2Ce5E61aA9442B2508d79cb77"
  // const pair = new Contract(pairAddress, JSON.stringify(UniswapV2Pair.abi),deployer)
  // const token0=await pair.token0();
  // const token1=await pair.token1();
  // console.log("token0:", token0);
  // console.log("token1:", token1);

  const factory = new Contract(sfactory, JSON.stringify(UniswapV2Factory.abi),deployer)
  const codeHash1=await factory.INIT_CODE_PAIR_HASH()
  console.log("INIT_CODE_PAIR_HASH:", codeHash1);
  const address = await factory.getPair(tokenAddressA,tokenAddressB)
  console.log("pair address:", address);
 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
