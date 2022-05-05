/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.10",
  networks: {
    ganache: {
      url: `HTTP://172.31.96.1:8000`,
    },
  },
};
