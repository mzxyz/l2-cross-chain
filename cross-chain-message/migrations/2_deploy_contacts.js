// Deploy tokenDeposit
// const TokenDeposit = artifacts.require("./TokenDeposit.sol");
// module.exports = function(deployer) {
//   deployer.deploy(
//     TokenDeposit, 
//     '0x37b797ebe14b4490fe64c67390aecfe20d650953',
//     '0xe6fEE2D5d2B49Ed96E6e1EeEa86a1916aeDc107f',
//     '0xfA6D8Ee5BE770F84FC001D098C4bD604Fe01284a',
//   );
// };

// const L1Token = artifacts.require("QTSToken");
// module.exports = function(deployer) {
//   deployer.deploy(
//     L1Token,
//     '100000000000000000000000000000',
//   );
// };

const L2Token = artifacts.require("L2QTSToken");
module.exports = function(deployer) {
  deployer.deploy(
    L2Token,
    '0x4200000000000000000000000000000000000010',
    '0xd4FeC1aFF3BED82eaAF1bB317eDC92E0fe1ac867',
  );
};

