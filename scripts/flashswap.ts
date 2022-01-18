import { v2Fixture } from "../tools/fixtures"
import { expandTo18Decimals } from "../tools/utils"
import { BigNumberish, Contract } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import { formatEther } from '@ethersproject/units'
import { ethers} from "hardhat";
import hre from "hardhat";
import { Arbitrager } from "../typechain-types/Arbitrager";
import { UniswapV2Factory } from "../typechain-types/UniswapV2Factory";
import UniswapV2PairAbi from '../artifacts/contracts/UniswapV2Pair.sol/UniswapV2Pair.json'
import { UniswapV2Pair } from "../typechain-types/UniswapV2Pair";
import{BigNumber as BN} from "bignumber.js"


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
  tx= await fixture.token2.approve(fixture.uRouter.address,appeoveAmount)
  await tx.wait()

  //add liquidity
  let amountA=expandTo18Decimals(10);
  let amountB=expandTo18Decimals(1000);
  //sPair token0/token1 10/1000
  tx=await fixture.sRouter.addLiquidity(fixture.token0.address,fixture.token1.address,amountA,amountB,0,0,to,MaxUint256)
  await tx.wait()
  amountA=expandTo18Decimals(600);
  let amountC=expandTo18Decimals(500);
  amountB=expandTo18Decimals(1000);
  //uPair token1/token2 1000/500 token2/token0 500/600  
  tx=await fixture.uRouter.addLiquidity(fixture.token1.address,fixture.token2.address,amountB,amountC,0,0,to,MaxUint256)
  await tx.wait()
  tx=await fixture.uRouter.addLiquidity(fixture.token2.address,fixture.token0.address,amountC,amountA,0,0,to,MaxUint256)
  await tx.wait()


  const pair0Address = await fixture.sFactory.getPair(fixture.token0.address, fixture.token1.address)
  const pair0 = (new Contract(pair0Address, JSON.stringify(UniswapV2PairAbi.abi),bob)) as UniswapV2Pair
  const pair1Address = await fixture.uFactory.getPair(fixture.token1.address, fixture.token2.address)
  const pair1 = (new Contract(pair1Address, JSON.stringify(UniswapV2PairAbi.abi),bob)) as UniswapV2Pair
  const pair2Address = await fixture.uFactory.getPair(fixture.token2.address, fixture.token0.address)
  const pair2 = (new Contract(pair2Address, JSON.stringify(UniswapV2PairAbi.abi),bob)) as UniswapV2Pair

  let r=(new BN(997)).dividedBy(1000)
  let amountInBN=await call_airbitrage_profit(r,fixture.token0.address,pair0,pair1,pair2)
  let reserves=await pair0.getReserves();
  let reservesIn=fixture.token0.address==(await pair0.token0())?reserves._reserve0:reserves._reserve1;
  let reservesOut=fixture.token0.address==(await pair0.token0())?reserves._reserve1:reserves._reserve0;
  console.log("pair0 token0 的 amountIn：",formatEther(BigNumber.from(amountInBN.toFixed(0))))
  //根据借贷token0的数量，计算出pair0借出token1的数量，作为三角套利合约执行的参数
  let amountOut=await fixture.sRouter.getAmountOut(BigNumber.from(amountInBN.toFixed(0)),reservesIn,reservesOut)
  console.log("pair0 token1 的 amountOut：",formatEther(amountOut))

  // a 22.5830240682606
  // b 692.452239717702
  // c 204.207625758700
  // d 173.618347527464

  console.log("r:",r.toString())

  let sAmountA=await fixture.token0.balanceOf(fixture.sPair.address)
  let sAmountB=await fixture.token1.balanceOf(fixture.sPair.address)
  console.log("sPair.token0 : ",formatEther(sAmountA))
  console.log("sPair.token1 : ",formatEther(sAmountB))

  const sArbitrage = await ethers.getContractFactory("Arbitrager");
  const sarbitrage=(await sArbitrage.deploy(fixture.sFactory.address,fixture.uRouter.address)) as Arbitrager
  await sarbitrage.deployed();
  console.log("sArbitrager deployed to:", sarbitrage.address);


  const abiCoder=new ethers.utils.AbiCoder()
  console.log("token0:",fixture.token0.address);
  console.log("token1:",fixture.token1.address);
  console.log("token2:",fixture.token2.address);
  tx=await fixture.sPair.swap(0,amountOut,sarbitrage.address,abiCoder.encode([ "uint","address[]" ], [ MaxUint256,[fixture.token1.address,fixture.token2.address,fixture.token0.address]]),overrides)
  await tx.wait()

  let amount=await fixture.token0.balanceOf(bob.address)
  console.log("bob token0.balanceOf : ",formatEther(amount))

  sAmountA=await fixture.token0.balanceOf(fixture.sPair.address)
  sAmountB=await fixture.token1.balanceOf(fixture.sPair.address)
  console.log("sPair.token0 : ",await fixture.sPair.token0(),",",formatEther(sAmountA))
  console.log("sPair.token1 : ",await fixture.sPair.token1(),",",formatEther(sAmountB))
  
  const reserves1=await pair1.getReserves(overrides)
  let token0=await pair1.token0()
  let token1=await pair1.token1()
  console.log("pair1 token0:",token0,":",formatEther(reserves1._reserve0))
  console.log("pair1 token1:",token1,":",formatEther(reserves1._reserve1))
  const reserves2=await pair2.getReserves(overrides)
  token0=await pair2.token0()
  token1=await pair2.token1()
  console.log("pair2 token0:",token0,":",formatEther(reserves2._reserve0))
  console.log("pair2 token1:",token1,":",formatEther(reserves2._reserve1))
}
//计算根据三角套利公式计算pair0的baseToken借贷数量
async function call_airbitrage_profit(r:BN,baseToken:string,pair0:UniswapV2Pair,pair1:UniswapV2Pair,pair2:UniswapV2Pair):Promise<BN>{
 let token0= await pair0.token0()
 let token1= await pair0.token1()
 let tokenB= token0==baseToken?token1:token0
 let reserves=await pair0.getReserves()
 const x0= new BN(token0==baseToken?reserves._reserve0.toString():reserves._reserve1.toString())
 const y0= new BN(token0==baseToken?reserves._reserve1.toString():reserves._reserve0.toString())

 token0= await pair1.token0()
 token1= await pair1.token1()
 let tokenC= token0==tokenB?token1:token0
 reserves=await pair1.getReserves()
 const x1= new BN(token0==tokenB?reserves._reserve0.toString():reserves._reserve1.toString())
 const y1= new BN(token0==tokenB?reserves._reserve1.toString():reserves._reserve0.toString())

 token0= await pair2.token0()
 token1= await pair2.token1()
 reserves=await pair2.getReserves()
 const x2= new BN(token0==tokenC?reserves._reserve0.toString():reserves._reserve1.toString())
 const y2= new BN(token0==tokenC?reserves._reserve1.toString():reserves._reserve0.toString())
 let Ea=y0.multipliedBy(y1).multipliedBy(y2).div(x1.multipliedBy(x2).plus(x2.multipliedBy(y0).multipliedBy(r)).plus(y0.multipliedBy(y1).multipliedBy(r.pow(2))))
 let Eb=x0.multipliedBy(x1).multipliedBy(x2).div(x1.multipliedBy(x2).plus(x2.multipliedBy(y0).multipliedBy(r).plus(y0.multipliedBy(y1).multipliedBy(r.pow(2)))))
 return Ea.multipliedBy(Eb).multipliedBy(r).sqrt().minus(Eb).div(r)
}
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
main().catch((error) => {
console.error(error);
process.exitCode = 1;
});
  