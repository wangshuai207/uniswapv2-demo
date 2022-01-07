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
  const router02Address="0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
  const tokenA = new Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", JSON.stringify(ERC20.abi),deployer)
  await tokenA.approve(router02Address,BigNumber.from(10000000000))
  const tokenB = new Contract("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", JSON.stringify(ERC20.abi),deployer)
  await tokenB.approve(router02Address,BigNumber.from(10000000000))

  const router02 = new Contract(router02Address, JSON.stringify(UniswapV2Router02.abi),deployer)
  console.log("deployer:", deployer.getAddress());

  const result =await router02.swapExactTokensForTokens(
    BigNumber.from(1000),
    0,
    ["0x5FbDB2315678afecb367f032d93F642f64180aa3", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"],
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
