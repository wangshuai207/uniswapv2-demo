import { ethers } from "hardhat";
import { Contract } from 'ethers'
import ERC20 from '../artifacts/contracts/ERC20.sol/ERC20.json'
import { MaxUint256 } from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'

const overrides = {
    gasLimit: 9999999,
    gasPrice: 0
}
  async function main() {

    const [deployer] = await ethers.getSigners();
    const tokenAddressA="0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf"
    const tokenAddressB="0x9d4454B023096f34B160D6B654540c56A1F81688"
    const tokenA = new Contract(tokenAddressA, JSON.stringify(ERC20.abi),deployer)
    const tokenB = new Contract(tokenAddressB, JSON.stringify(ERC20.abi),deployer)

    const sfactory="0x809d550fca64d94Bd9F66E60752A544199cfAC3D"
    const ufactory="0x4c5859f0F772848b2D91F1D83E2Fe57935348029"

    const srouter="0x1291Be112d480055DaFd8a610b7d1e203891C274"
    const urouter="0x5f3f1dBD7B74C6B46e8c44f98792A1dAf8d69154"


    const sArbitrage = await ethers.getContractFactory("Flash");
    const sarbitrage=await sArbitrage.deploy(sfactory,ufactory,srouter,urouter)
    await sarbitrage.deployed();
    console.log("sArbitrager deployed to:", sarbitrage.address);

    const approveMount=BigNumber.from(10000).mul(BigNumber.from(10).pow(18))
    await tokenA.approve(sarbitrage.address,approveMount)
    await tokenB.approve(sarbitrage.address,approveMount)
  }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
