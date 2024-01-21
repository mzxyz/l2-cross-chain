const ethers = require("ethers");
const optimismSDK = require("@eth-optimism/sdk");

const L1_RPC = "https://rpc.ankr.com/eth_goerli";
const L2_RPC = "https://goerli.base.org";

const L1_contract_address = "0x37b797ebe14b4490fe64c67390aecfe20d650953";
const L2_contract_address = "0xe6fEE2D5d2B49Ed96E6e1EeEa86a1916aeDc107f";

const L1RPCProvider = new ethers.providers.JsonRpcProvider(L1_RPC);
const L2RPCProvider = new ethers.providers.JsonRpcProvider(L2_RPC);

const sk = '';

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
  await withdrawTx2.wait();
  console.log('withdraw proved');

  // 3. Wait the fault challenge period (a short period on Goerli, seven days on the production network) and then finish the withdrawal.
  console.log('wait for withdraw status');
  await crossChainMessenger.waitForMessageStatus(withdrawTx.hash, optimismSDK.MessageStatus.READY_FOR_RELAY);
  const withdrawTx3 = await crossChainMessenger.finalizeMessage(withdrawTx.hash);
  await withdrawTx3.wait();``
  console.log('withdraw done');
}

// depositToken();
withdrawToken();