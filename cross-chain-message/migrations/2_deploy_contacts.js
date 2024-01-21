const TokenDeposit = artifacts.require("./TokenDeposit.sol");

module.exports = function(deployer) {
  deployer.deploy(
    TokenDeposit, 
    '0x37b797ebe14b4490fe64c67390aecfe20d650953',
    '0xe6fEE2D5d2B49Ed96E6e1EeEa86a1916aeDc107f',
    '0xfA6D8Ee5BE770F84FC001D098C4bD604Fe01284a',
  );
};