pragma solidity ^0.6.6;

import "./libraries/UniswapV2Library.sol";
import "./interfaces/IUniswapV2Callee.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/IERC20.sol";

contract Flash is IUniswapV2Callee {
    address factory0;
    address factory1;
    IUniswapV2Router02 router0;
    IUniswapV2Router02 router1;

    // this contract should be called by factory0,
    // and router1 would be called by this contract
    constructor(
        address _factory0,
        address _factory1,
        address _router0,
        address _router1
    ) public {
        factory0 = _factory0;
        factory1 = _factory1;
        router0 = IUniswapV2Router02(_router0);
        router1 = IUniswapV2Router02(_router1);
    }

    function uniswapV2Call(
        address swapCaller,
        uint256 amount0,
        uint256 amount1,
        bytes calldata _data
    ) external override {
        address[] memory path1 = new address[](2);
        address[] memory path2 = new address[](2);

        uint256 amountToken = amount1;
        {
            address token0 = IUniswapV2Pair(msg.sender).token0();
            address token1 = IUniswapV2Pair(msg.sender).token1();
            // path1: token0 -> token1
            path1[0] = token0;
            path1[1] = token1;
            // path2: token1 -> token0
            path2[0] = token1;
            path2[1] = token0;

            require(
                msg.sender ==
                    UniswapV2Library.pairFor(factory0, token0, token1),
                "sender not a pair"
            );
            require(amount0 == 0 || amount1 == 0);

            IERC20(token0).approve(address(router0), 100 * amountToken);
            IERC20(token0).approve(address(router1), 100 * amountToken);
            IERC20(token1).approve(address(router0), 100 * amountToken);
            IERC20(token1).approve(address(router1), 100 * amountToken);
        }

        uint256 amountRequired = UniswapV2Library.getAmountsIn(
            factory0,
            amountToken,
            path1
        )[0];
        uint256 amountPayback = router1.swapTokensForExactTokens(
            amountRequired,
            amountToken,
            path2,
            msg.sender,
            block.timestamp + 3600
        )[1];

        router1.swapExactTokensForTokens(
            amountToken - amountPayback,
            0,
            path2,
            swapCaller,
            block.timestamp + 3600
        )[1];
    }
}
