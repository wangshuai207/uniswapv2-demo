import { v2Fixture } from "../tools/fixtures"
import { expandTo18Decimals,expandToDecimals } from "../tools/utils"
import { MaxUint256 } from '@ethersproject/constants'
import { ethers,waffle ,network} from "hardhat";
import { Arbitrager } from "../typechain-types/Arbitrager";

const overrides = {
    gasLimit: 9999999
  }

async function main() {
   const [deployer] = await ethers.getSigners();
   const to =await deployer.getAddress();
   const fixture= await v2Fixture();
   //approve
   let appeoveAmount=expandTo18Decimals(10000);
   let tx= await fixture.token0.approve(fixture.sRouter.address,appeoveAmount)
   await tx.wait()
   tx= await fixture.token1.approve(fixture.sRouter.address,appeoveAmount)
   await tx.wait()
   tx=await fixture.token0.approve(fixture.uRouter.address,appeoveAmount)
   await tx.wait()
   tx= await fixture.token1.approve(fixture.uRouter.address,appeoveAmount)
   await tx.wait()

   //add liquidity
   let amount0=expandTo18Decimals(10);
   let amount1=expandTo18Decimals(1000);
   tx=await fixture.sRouter.addLiquidity(fixture.token0.address,fixture.token1.address,amount0,amount1,0,0,to,MaxUint256)
   await tx.wait()
   amount0=expandTo18Decimals(1000);
   amount1=expandTo18Decimals(1);
   tx=await fixture.uRouter.addLiquidity(fixture.token0.address,fixture.token1.address,amount0,amount1,0,0,to,MaxUint256)
   await tx.wait()
   amount0=await fixture.token0.balanceOf(deployer.address)
   amount1=await fixture.token1.balanceOf(deployer.address)
   console.log("owner token0.balanceOf : ",amount0)
   console.log("owner token1.balanceOf : ",amount1)

   let sAmount0=await fixture.token0.balanceOf(fixture.sPair.address)
   let sAmount1=await fixture.token1.balanceOf(fixture.sPair.address)
   console.log("sPair.token0 : ",sAmount0)
   console.log("sPair.token1 : ",sAmount1)
   let uAmount0=await fixture.token0.balanceOf(fixture.uPair.address)
   let uAmount1=await fixture.token1.balanceOf(fixture.uPair.address)
   console.log("uPair.token0 : ",uAmount0)
   console.log("uPair.token1 : ",uAmount1)

   const sArbitrage = await ethers.getContractFactory("Arbitrager");
   const sarbitrage=(await sArbitrage.deploy(fixture.sFactory.address,fixture.uRouter.address)) as Arbitrager
   await sarbitrage.deployed();
   console.log("sArbitrager deployed to:", sarbitrage.address);

 
    let amountOut=expandTo18Decimals(80)
    let dMount=expandTo18Decimals(10)
    const abiCoder=new ethers.utils.AbiCoder()
    tx=await fixture.sPair.swap(0,amountOut,sarbitrage.address,abiCoder.encode([ "uint","uint" ], [ dMount,MaxUint256]),overrides)
    await tx.wait()

    amount0=await fixture.token0.balanceOf(deployer.address)
    amount1=await fixture.token1.balanceOf(deployer.address)
    console.log("owner token0.balanceOf : ",amount0)
    console.log("owner token1.balanceOf : ",amount1)

    sAmount0=await fixture.token0.balanceOf(fixture.sPair.address)
    sAmount1=await fixture.token1.balanceOf(fixture.sPair.address)
    console.log("sPair.token0 : ",sAmount0)
    console.log("sPair.token1 : ",sAmount1)
    uAmount0=await fixture.token0.balanceOf(fixture.uPair.address)
    uAmount1=await fixture.token1.balanceOf(fixture.uPair.address)
    console.log("uPair.token0 : ",uAmount0)
    console.log("uPair.token1 : ",uAmount1)
}
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
main().catch((error) => {
console.error(error);
process.exitCode = 1;
});
  