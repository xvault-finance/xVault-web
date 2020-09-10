import Notify from "bnc-notify"
import { web3 } from './connectWallet'
import abi from './erc20.abi.json'

const notify = Notify({
    dappId: "2b2600b5-0267-4444-8c35-b18efce2693b",       // [String] The API key created by step one above
    networkId: 42  // [Integer] The Ethereum network ID your Dapp uses.
});

const provider = window.ethereum;
const kovanUsdc = "0xe22da380ee6b445bb8273c81944adeb6e8450422";
const maxApproval = "115792089237316195423570985008687907853269984665640564039457584007913129639935"
const contractAddress = "0x2b6cF5bd95B9D75de255f9dd48Ff3b1D269E09D7"

async function sendTransaction() {
    const accounts = await provider.enable();

    web3.eth.sendTransaction({
        from: accounts[0],
        to: accounts[0],
        value: "0"
    })
        .on("transactionHash", hash => {
            notify.hash(hash);
        })
}

async function approve() {
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];
    var erc20Instance = new web3.eth.Contract(abi, kovanUsdc);

    erc20Instance.methods.approve(contractAddress, maxApproval).send({ from: address },
        function (err, transactionHash) {
            console.log(err);
            console.log(transactionHash);
            //some code
        });
}

export {sendTransaction, approve}