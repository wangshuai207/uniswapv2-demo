import { v2Fixture } from "../tools/fixtures"
import { expandTo18Decimals } from "../tools/utils"
import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import { formatEther } from '@ethersproject/units'
import { ethers} from "hardhat";
import hre from "hardhat";
import { Arbitrager } from "../typechain-types/Arbitrager";

const overrides = {
    gasLimit: 9999999
}


async function main() {
  const [deployer,bob] = await ethers.getSigners();
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
  //sPair token0/token1 10/1000
  tx=await fixture.sRouter.addLiquidity(fixture.token0.address,fixture.token1.address,amount0,amount1,0,0,to,MaxUint256)
  await tx.wait()
  amount0=expandTo18Decimals(20);
  amount1=expandTo18Decimals(1000);
  //uPair token0/token1 20/1000
  tx=await fixture.uRouter.addLiquidity(fixture.token0.address,fixture.token1.address,amount0,amount1,0,0,to,MaxUint256)
  await tx.wait()

  let sAmount0=await fixture.token0.balanceOf(fixture.sPair.address)
  let sAmount1=await fixture.token1.balanceOf(fixture.sPair.address)
  console.log("sPair.token0 : ",formatEther(sAmount0))
  console.log("sPair.token1 : ",formatEther(sAmount1))
  let uAmount0=await fixture.token0.balanceOf(fixture.uPair.address)
  let uAmount1=await fixture.token1.balanceOf(fixture.uPair.address)
  console.log("uPair.token0 : ",formatEther(uAmount0))
  console.log("uPair.token1 : ",formatEther(uAmount1))

  const sArbitrage = await ethers.getContractFactory("Arbitrager");
  const sarbitrage=(await sArbitrage.deploy(fixture.sFactory.address,fixture.uRouter.address)) as Arbitrager
  await sarbitrage.deployed();
  console.log("sArbitrager deployed to:", sarbitrage.address);

  //sPair借出200 token1
  let amountOut=expandTo18Decimals(200) 
  //计算sPair借出200个token1需要的token0数量  ((10*1000/(1000-200))-10)/0.997=2.5075 约等于2.51
  let dMount=BigNumber.from(251).mul(BigNumber.from(10).pow(16))
  //从uPair加入200 token1 ，兑换出token0数量 20-20*10000/(1000+200*0.997)=0.8149958
  const abiCoder=new ethers.utils.AbiCoder()
  console.log("从sPair借出200个token1和uPair交易，兑换出3.3245token0，取出2.51个token0还给sPair");
  console.log("Bob剩余0.8149958个token0");
  tx=await fixture.sPair.swap(0,amountOut,sarbitrage.address,abiCoder.encode([ "uint","uint" ], [ dMount,MaxUint256]),overrides)
  await tx.wait()

  amount0=await fixture.token0.balanceOf(bob.address)
  console.log("bob token0.balanceOf : ",formatEther(amount0))

  sAmount0=await fixture.token0.balanceOf(fixture.sPair.address)
  sAmount1=await fixture.token1.balanceOf(fixture.sPair.address)
  console.log("sPair.token0 : ",formatEther(sAmount0))
  console.log("sPair.token1 : ",formatEther(sAmount1))
  uAmount0=await fixture.token0.balanceOf(fixture.uPair.address)
  uAmount1=await fixture.token1.balanceOf(fixture.uPair.address)
  console.log("uPair.token0 : ",formatEther(uAmount0))
  console.log("uPair.token1 : ",formatEther(uAmount1))
}
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
main().catch((error) => {
console.error(error);
process.exitCode = 1;
});
  