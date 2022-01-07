# Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/sample-script.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).

TokenA deployed to: 0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf
TokenB deployed to: 0x9d4454B023096f34B160D6B654540c56A1F81688
WETH deployed to: 0x5eb3Bc0a489C5A8288765d2336659EbCA68FCd00
WETHPartner deployed to: 0x36C02dA8a0983159322a80FFE9F24b1acfF8B570

INIT_CODE_PAIR_HASH: 0x199766a94ebdbc73b48321d8b1c652061e46f522f99918baecc4d027dd149188
SushiswapFactory deployed to: 0x809d550fca64d94Bd9F66E60752A544199cfAC3D
UniswapV2Factory deployed to: 0x4c5859f0F772848b2D91F1D83E2Fe57935348029

SushiswapRouter02 deployed to: 0x1291Be112d480055DaFd8a610b7d1e203891C274
UniswapV2Router02 deployed to: 0x5f3f1dBD7B74C6B46e8c44f98792A1dAf8d69154

sFlashLoanArbitrage deployed to: 0xFD471836031dc5108809D173A067e8486B9047A3
uFlashLoanArbitrage deployed to: 0xcbEAF3BDe82155F56486Fb5a1072cb8baAf547cc