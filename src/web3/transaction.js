import Notify from "bnc-notify"
import { web3js } from './connectWallet'
import abi from './erc20.abi.json'
import usdcContractAbi from './usdcContract.abi.json'

const notify = Notify({
    dappId: "2b2600b5-0267-4444-8c35-b18efce2693b",       // [String] The API key created by step one above
    networkId: 42  // [Integer] The Ethereum network ID your Dapp uses.
});

const provider = window.ethereum;
const maxApproval = "115792089237316195423570985008687907853269984665640564039457584007913129639935"

const kovanUsdc = "0xe22da380ee6b445bb8273c81944adeb6e8450422";
const contractAddress = "0x2b6cF5bd95B9D75de255f9dd48Ff3b1D269E09D7"
const rp = require('request-promise');

async function _getGasPrice() {
    try {
        const url = 'https://gasprice.poa.network/'
        const priceString = await rp(url);
        const priceJSON = JSON.parse(priceString)
        if (priceJSON) {
            return priceJSON.fast.toFixed(0)
        }
        return '70'
    } catch (e) {
        console.log(e)
        return '70'
    }
}

async function sendTransaction() {
    const accounts = await provider.enable();

    web3js.eth.sendTransaction({
        from: accounts[0],
        to: accounts[0],
        value: "0"
    })
        .on("transactionHash", hash => {
            notify.hash(hash);
        })
}

async function approve(callback) {
    const accounts = await web3js.eth.getAccounts();
    const address = accounts[0];

    const erc20Instance = new web3js.eth.Contract(abi, kovanUsdc);
    await erc20Instance.methods.approve(contractAddress, maxApproval).send({ from: address, gasPrice: web3js.utils.toWei(await _getGasPrice(), 'gwei') })
        .on("transactionHash", hash => {
            notify.hash(hash);
            callback(null, hash)
        })
        .on('error', function (error) {
            callback(error, null)
        })


}

async function deposit(amount) {
    if (amount == '' || amount == "0") {
        return
    }
    const accounts = await web3js.eth.getAccounts();
    const address = accounts[0];

    var amountToSend = web3js.utils.toWei(amount, "ether")
    amountToSend = amount * 10 ** 6;
    // amountToSend = amount*10**6;

    const erc20Instance = new web3js.eth.Contract(abi, kovanUsdc);

    // check allowance 
    var allowance = await erc20Instance.methods.allowance(address, contractAddress).call((err, allowance) => {
        if (err) {
            console.log("Allowance Error:", err)
        } else {
            console.log("Allowance Response:", allowance)
        }
    });

    if (allowance == 0) {
        await approve((err, result) => {
            if (err) {
                return
            }
            console.log(result)
        })

    }

    var usdcContractInstance = new web3js.eth.Contract(usdcContractAbi, contractAddress);

    await usdcContractInstance.methods.deposit(amountToSend).send({ from: address, gasPrice: web3js.utils.toWei(await _getGasPrice(), 'gwei') })
        .on("transactionHash", hash => {
            notify.hash(hash);
            console.log(hash)
        })
        .on('error', function (error) {
            console.log(error)
        })
}

async function withdraw(amount) {
    if (amount == '' || amount == "0") {
        return
    }
    
    const accounts = await web3js.eth.getAccounts();
    const address = accounts[0];

    var amountToSend = web3js.utils.toWei(amount, "ether")
    amountToSend = amount * 10 ** 6;
    // amountToSend = amount*10**6;

    var xusdcContractInstance = new web3js.eth.Contract(usdcContractAbi, contractAddress);

    await xusdcContractInstance.methods.withdraw(amountToSend).send({ from: address, gasPrice: web3js.utils.toWei(await _getGasPrice(), 'gwei') })
        .on("transactionHash", hash => {
            notify.hash(hash);
            console.log(hash)
        })
        .on('error', function (error) {
            console.log(error)
        })
}

export { sendTransaction, deposit, withdraw }