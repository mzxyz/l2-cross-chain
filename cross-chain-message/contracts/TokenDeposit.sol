//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@eth-optimism/contracts/L1/messaging/IL1ERC20Bridge.sol";

contract TokenDeposit {
  address public L1Token;
  address public L2Token;
  address public L1StandardBridge;

  event DepositRequested(address indexed from, uint256 amount);

  constructor(address _l1Token, address _l2Token, address _l1StandardBridge) {
    L1Token = _l1Token;
    L2Token = _l2Token;
    L1StandardBridge = _l1StandardBridge;
  }

  // function deposit(address to, uint256 amount, uint32 l2Gas, bytes calldata data) external {
  //   ERC20(L1Token).transferFrom(msg.sender, address(this), amount);
  //   ERC20(L1Token).approve(L1StandardBridge, amount);
  //   IL1ERC20Bridge(L1StandardBridge).depositERC20To(L1Token, L2Token, to, amount, l2Gas, data);

  //   emit DepositRequested(msg.sender, amount);
  // }

  function deposit(address to, uint256 amount) external {
    ERC20(L1Token).transferFrom(msg.sender, address(this), amount);
    ERC20(L1Token).approve(L1StandardBridge, amount);
    IL1ERC20Bridge(L1StandardBridge).depositERC20To(L1Token, L2Token, to, amount, 300000, new bytes(0));

    emit DepositRequested(msg.sender, amount);
  }
}