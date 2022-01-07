// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { Contract } from 'ethers'
import { MaxUint256 } from '@ethersproject/constants'
import UniswapV2Router02 from '../artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json'
import ERC20 from '../artifacts/contracts/ERC20.sol/ERC20.json'
import { BigNumber } from '@ethersproject/bignumber'

const overrides = {
    gasLimit: 9999999
  }

async function main() {

  const [deployer] = await ethers.getSigners();
  const tokenAddressA="0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf";
  const tokenAddressB="0x9d4454B023096f34B160D6B654540c56A1F81688";

  const router02Address="0x1291Be112d480055DaFd8a610b7d1e203891C274"
  //const tokenA = new Contract(tokenAddressA, JSON.stringify(ERC20.abi),deployer)
  //await tokenA.approve(router02Address,BigNumber.from(10000000000))
  //const tokenB = new Contract(tokenAddressB, JSON.stringify(ERC20.abi),deployer)
  //await tokenB.approve(router02Address,BigNumber.from(10000000000))

  const router02 = new Contract(router02Address, JSON.stringify(UniswapV2Router02.abi),deployer)
  console.log("deployer:", deployer.getAddress());
  const swapMountA=BigNumber.from(10).mul(BigNumber.from(10).pow(18))
  const result =await router02.swapExactTokensForTokens(
    swapMountA,
    0,
    [tokenAddressA, tokenAddressB],
    deployer.getAddress(),
    MaxUint256,
    overrides
    )
    console.log("result:", result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
