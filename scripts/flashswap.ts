import { v2Fixture } from "../tools/fixtures"
import { expandTo18Decimals } from "../tools/utils"
import { Contract } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import { formatEther } from '@ethersproject/units'
import { ethers} from "hardhat";
import hre from "hardhat";
import { Arbitrager } from "../typechain-types/Arbitrager";
import { UniswapV2Factory } from "../typechain-types/UniswapV2Factory";
import UniswapV2PairAbi from '../artifacts/contracts/UniswapV2Pair.sol/UniswapV2Pair.json'
import { UniswapV2Pair } from "../typechain-types/UniswapV2Pair";

const overrides = {
    gasLimit: 9999999
}


async function main() {
  const [deployer,bob] = await ethers.getSigners();
  const to =await deployer.getAddress();
  const fixture= await v2Fixture();
  //approve
  let appeoveAmount=expandTo18Decimals(10000);
  let tx= await fixture.tokenA.approve(fixture.sRouter.address,appeoveAmount)
  await tx.wait()
  tx= await fixture.tokenB.approve(fixture.sRouter.address,appeoveAmount)
  await tx.wait()
  tx=await fixture.tokenA.approve(fixture.uRouter.address,appeoveAmount)
  await tx.wait()
  tx= await fixture.tokenB.approve(fixture.uRouter.address,appeoveAmount)
  await tx.wait()
  tx= await fixture.tokenC.approve(fixture.uRouter.address,appeoveAmount)
  await tx.wait()

  //add liquidity
  let amountA=expandTo18Decimals(10);
  let amountB=expandTo18Decimals(1000);
  //sPair tokenA/tokenB 10/1000
  tx=await fixture.sRouter.addLiquidity(fixture.tokenA.address,fixture.tokenB.address,amountA,amountB,0,0,to,MaxUint256)
  await tx.wait()
  amountA=expandTo18Decimals(600);
  let amountC=expandTo18Decimals(500);
  amountB=expandTo18Decimals(1000);
  //uPair tokenA/tokenB 20/1000
  // tx=await fixture.uRouter.addLiquidity(fixture.tokenA.address,fixture.tokenB.address,amountA,amountB,0,0,to,MaxUint256)
  // await tx.wait()
  //uPair tokenA/tokenC 600/500  tokenC/tokenB 500/1000
  tx=await fixture.uRouter.addLiquidity(fixture.tokenA.address,fixture.tokenC.address,amountA,amountC,0,0,to,MaxUint256)
  await tx.wait()
  tx=await fixture.uRouter.addLiquidity(fixture.tokenC.address,fixture.tokenB.address,amountC,amountB,0,0,to,MaxUint256)
  await tx.wait()



  let sAmountA=await fixture.tokenA.balanceOf(fixture.sPair.address)
  let sAmountB=await fixture.tokenB.balanceOf(fixture.sPair.address)
  console.log("sPair.tokenA : ",formatEther(sAmountA))
  console.log("sPair.tokenB : ",formatEther(sAmountB))

  const sArbitrage = await ethers.getContractFactory("Arbitrager");
  const sarbitrage=(await sArbitrage.deploy(fixture.sFactory.address,fixture.uRouter.address)) as Arbitrager
  await sarbitrage.deployed();
  console.log("sArbitrager deployed to:", sarbitrage.address);

  //sPair借出200 tokenB
  let amountOut=expandTo18Decimals(200) 
  //计算sPair借出200个tokenA需要的token0数量  ((10*1000/(1000-200))-10)/0.997=2.5075225677
  //从uPair加入200 tokenA ，兑换出token0数量 20*10000/(1000+200*0.997)=16.675004168751042
  //bob token0=0.8174732
  const abiCoder=new ethers.utils.AbiCoder()
  console.log("从sPair借出200个token1和uPair交易，兑换出3.3245token0，取出2.51个token0还给sPair");
  console.log("Bob剩余0.8149958个token0");
  let token0 =await fixture.sPair.token0();
  console.log("token0:",token0);
  console.log("tokenA:",fixture.tokenA.address);
  console.log("tokenB:",fixture.tokenB.address);
  tx=await fixture.sPair.swap(token0==fixture.tokenA.address?0:amountOut,token0==fixture.tokenA.address?amountOut:0,sarbitrage.address,abiCoder.encode([ "uint","address[]" ], [ MaxUint256,[fixture.tokenB.address,fixture.tokenC.address,fixture.tokenA.address]]),overrides)
  await tx.wait()

  amountA=await fixture.tokenA.balanceOf(bob.address)
  console.log("bob token0.balanceOf : ",formatEther(amountA))

  sAmountA=await fixture.tokenA.balanceOf(fixture.sPair.address)
  sAmountB=await fixture.tokenB.balanceOf(fixture.sPair.address)
  console.log("sPair.tokenA : ",formatEther(sAmountA))
  console.log("sPair.tokenB : ",formatEther(sAmountB))

  
  const upairAddress1 = await fixture.uFactory.getPair(fixture.tokenA.address, fixture.tokenC.address)
  const uPair1 = (new Contract(upairAddress1, JSON.stringify(UniswapV2PairAbi.abi),bob)) as UniswapV2Pair
  const reserves1=await uPair1.getReserves(overrides)
  token0=await uPair1.token0()
  let token1=await uPair1.token1()
  console.log(token0,":",formatEther(reserves1._reserve0))
  console.log(token1,":",formatEther(reserves1._reserve1))
  const upairAddress2 = await fixture.uFactory.getPair(fixture.tokenB.address, fixture.tokenC.address)
  const uPair2 = (new Contract(upairAddress2, JSON.stringify(UniswapV2PairAbi.abi),bob)) as UniswapV2Pair
  const reserves2=await uPair2.getReserves(overrides)
  token0=await uPair2.token0()
  token1=await uPair2.token1()
  console.log(token0,":",formatEther(reserves2._reserve0))
  console.log(token1,":",formatEther(reserves2._reserve1))
}
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
main().catch((error) => {
console.error(error);
process.exitCode = 1;
});
  