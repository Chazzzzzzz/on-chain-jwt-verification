require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.5.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    okx: {
      url: "https://exchaintestrpc.okex.org",
      chainId: 65,
      accounts: ["2fb5d486215cc729311e0fa119aa56e808896c2be349de629bf055ae27624af1"]
    },
  },
};
