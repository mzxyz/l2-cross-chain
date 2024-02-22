const ethers = require("ethers");
const optimismSDK = require("@eth-optimism/sdk");
const tokenDepositAbi = require("../cross-chain-message/build/contracts/TokenDeposit.json").abi;
const ERC20Abi = require("../cross-chain-message/build/contracts/ERC20.json").abi;

const L1_RPC = "https://eth.rpc.blxrbdn.com";
const L2_RPC = "https://mainnet.base.org";

const L1_contract_address = "0xd4fec1aff3bed82eaaf1bb317edc92e0fe1ac867";
const L2_contract_address = "0xc75b0bf2dd1c3dcc27bc25cbd681fb8f307177d6";
const L1_standard_bridge = '0x3154Cf16ccdb4C6d922629664174b904d80F2C35';

const sk = '';

const L1RPCProvider = new ethers.providers.JsonRpcProvider(L1_RPC);
const L2RPCProvider = new ethers.providers.JsonRpcProvider(L2_RPC);

const L1Wallet = new ethers.Wallet(sk, L1RPCProvider);
const L2Wallet = new ethers.Wallet(sk, L2RPCProvider);

const amount = ethers.utils.parseEther("1000");

async function initCrossChainMessenger() {
  const l1ChainId = (await L1RPCProvider.getNetwork()).chainId;
  const l2ChainId = (await L2RPCProvider.getNetwork()).chainId;

  const crossChainMessenger = new optimismSDK.CrossChainMessenger({
    l1ChainId,
    l2ChainId,
    l1SignerOrProvider: L1Wallet,
    l2SignerOrProvider: L2Wallet,
  });

  return crossChainMessenger;
}

// deposit token from L1 to base L2
async function depositToken() {
  const crossChainMessenger = await initCrossChainMessenger();

  console.log('request deposit approval');
  const depositApproveTx = await crossChainMessenger.approveERC20(L1_contract_address, L2_contract_address, amount.mul(2));
  await depositApproveTx.wait();
  console.log('deposit approval done');

  console.log('request deposit');
  const depositTx = await crossChainMessenger.depositERC20(L1_contract_address, L2_contract_address, amount);
  await depositTx.wait();
  console.log('deposit done');

  console.log('wait for deposit status');
  await crossChainMessenger.waitForMessageStatus(depositTx.hash, optimismSDK.MessageStatus.RELAYED)
  console.log('deposit status done');
}

// withdraw token from L2 to L1
async function withdrawToken() {
  const crossChainMessenger = await initCrossChainMessenger();

  // 1. initiate the withdraw on L2
  console.log('request withdraw');
  const withdrawTx = await crossChainMessenger.withdrawERC20(L1_contract_address, L2_contract_address, amount);
  await withdrawTx.wait(3);
  console.log(`withdraw hash: ${withdrawTx.hash}`);
  console.log('withdraw request processed');

  // 2. Wait until the root state is published on L1, and then prove the withdrawal. This is likely to take less than 240 seconds.
  console.log('wait for withdraw status');
  await crossChainMessenger.waitForMessageStatus(withdrawTx.hash, optimismSDK.MessageStatus.READY_TO_PROVE);
  const withdrawTx2 = await crossChainMessenger.proveMessage(withdrawTx.hash)
  await withdrawTx2.wait(3);
  console.log('withdraw proved');

  // 3. Wait the fault challenge period (a short period on Goerli, seven days on the production network) and then finish the withdrawal.
  console.log('wait for withdraw status');
  await crossChainMessenger.waitForMessageStatus(withdrawTx.hash, optimismSDK.MessageStatus.READY_FOR_RELAY);
  const withdrawTx3 = await crossChainMessenger.finalizeMessage(withdrawTx.hash);
  await withdrawTx3.wait(3);``
  console.log('withdraw done');
}

async function depositTokenWithContract() {
  const crossChainMessenger = await initCrossChainMessenger();

  console.log('request deposit approval');
  const depositApproveTx = await crossChainMessenger.approveERC20(L1_contract_address, L2_contract_address, amount.mul(2));
  console.log('tx hash:', depositApproveTx.hash);
  await depositApproveTx.wait(3);
  console.log('deposit approval done');

  console.log('request deposit');
  const depositTx = await crossChainMessenger.depositERC20(L1_contract_address, L2_contract_address, amount);
  console.log('tx hash:', depositTx.hash);
  await depositTx.wait(3);
  console.log('deposit done');

  console.log('wait for deposit status');
  await crossChainMessenger.waitForMessageStatus(depositTx.hash, optimismSDK.MessageStatus.RELAYED)
  console.log('deposit status done');
}

// depositToken();
// withdrawToken();
depositTokenWithContract();