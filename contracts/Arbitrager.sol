pragma solidity =0.6.6;

import './libraries/UniswapV2Library.sol';
import './interfaces/IUniswapV2Router02.sol';
import './interfaces/IUniswapV2Pair.sol';
import './interfaces/IERC20.sol';
import "hardhat/console.sol";

contract Arbitrager {
  address immutable sFactory;
  IUniswapV2Router02 immutable uRouter;

  constructor(address _sFactory, address _uRouter) public {
    sFactory = _sFactory;  
    uRouter = IUniswapV2Router02(_uRouter);
  }

  function uniswapV2Call(address _sender, uint _amount0, uint _amount1, bytes calldata _data) external {
    address[] memory path = new address[](2);
    (uint deadline,address[] memory upath) = abi.decode(_data, (uint,address[]));

    uint amountEntryToken = _amount0 == 0 ? _amount1 : _amount0; 
    // address token0 = IUniswapV2Pair(msg.sender).token0();
    // address token1 = IUniswapV2Pair(msg.sender).token1();

    require(msg.sender == UniswapV2Library.pairFor(sFactory, IUniswapV2Pair(msg.sender).token0(), IUniswapV2Pair(msg.sender).token1()), 'Invalid Request');

    // make sure one of the amounts = 0 
    require(_amount0 == 0 || _amount1 == 0);
   
    //sPath
    path[0] = _amount0 == 0 ? IUniswapV2Pair(msg.sender).token0() : IUniswapV2Pair(msg.sender).token1(); 
    path[1] = _amount0 == 0 ? IUniswapV2Pair(msg.sender).token1() : IUniswapV2Pair(msg.sender).token0(); 

    // create a pointer to the token we are going to sell on uniswap 
    IERC20 token = IERC20(_amount0 == 0 ? path[1] : path[0]);

    // approve the uniswapRouter to spend our tokens so the trade can occur             
    token.approve(address(uRouter), amountEntryToken);

    uint amountRequired = UniswapV2Library.getAmountsIn(sFactory, amountEntryToken, path)[0]; 
    //uPath
    // upath[0] = _amount0 == 0 ? token1 : token0; 
    // upath[1] = _amount0 == 0 ? token0 : token1; 
    uint amountReceived = uRouter.swapExactTokensForTokens( amountEntryToken, amountRequired, upath, address(this), deadline)[1]; 

    IERC20 outputToken = IERC20(_amount0 == 0 ? path[0] : path[1]);

    outputToken.transfer(msg.sender, amountRequired);   
    outputToken.transfer(_sender, amountReceived - amountRequired); 

  }

  

}