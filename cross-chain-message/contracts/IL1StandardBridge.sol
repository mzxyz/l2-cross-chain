pragma solidity 0.8.20;

interface IL1StandardBridge {
  function depositERC20To(
    address _l1ERC20,
    address _l2ERC20,
    address _to,
    uint256 _amount,
    uint256 _minGasLimit,
    bytes calldata _extraData
  ) external virtual;
}