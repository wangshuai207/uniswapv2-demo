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
    const tokenAddressA="0xd6e1afe5cA8D00A2EFC01B89997abE2De47fdfAf"
    const tokenAddressB="0x99dBE4AEa58E518C50a1c04aE9b48C9F6354612f"
    const tokenA = new Contract(tokenAddressA, JSON.stringify(ERC20.abi),deployer)
    const tokenB = new Contract(tokenAddressB, JSON.stringify(ERC20.abi),deployer)

    const sfactory="0xB0f05d25e41FbC2b52013099ED9616f1206Ae21B"
    const ufactory="0x5FeaeBfB4439F3516c74939A9D04e95AFE82C4ae"

    const srouter="0xD42912755319665397FF090fBB63B1a31aE87Cee"
    const urouter="0xfcDB4564c18A9134002b9771816092C9693622e3"


    const sArbitrage = await ethers.getContractFactory("Arbitrager");
    const sarbitrage=await sArbitrage.deploy(sfactory,urouter)
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
