import Onboard from "bnc-onboard"
import Web3 from "web3";
import {tokenBalance} from './balanceCheck'

let web3js;

const defaultWalletChecks = [
    { checkName: 'connect' },
    { checkName: 'network' },
    { checkName: 'balance', minimumBalance: '0' }
]

const tokenBalanceCheck = tokenBalance({ tokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f', tokenName: 'Dai', minimumBalance: 5 })

const onboard = Onboard({
    dappId: "2b2600b5-0267-4444-8c35-b18efce2693b",
    networkId: 42,
    subscriptions: {
        wallet: wallet => {
            web3js = new Web3(wallet.provider);
            localStorage.setItem('selectedWallet', wallet.name);
        }
    },
    walletSelect: {
        wallets: [
            {
                walletName: 'metamask',
                preferred: true
            },
            {
                walletName: 'coinbase',
                preferred: true
            },
            {
                walletName: "walletConnect",
                infuraKey: "b19d1248bdaa4d5080dfc8ad2020a05e"
            },
        ]
    },

    walletCheck: [...defaultWalletChecks]
});

async function login() {
    const previouslySelectedWallet = localStorage.getItem('selectedWallet')

    let status
    if (previouslySelectedWallet == "undefined" || previouslySelectedWallet == false || previouslySelectedWallet == null) {
        status = await onboard.walletSelect();
    } else {
        status = await onboard.walletSelect(previouslySelectedWallet);
    }

    if (status == true) {
        await onboard.walletCheck()
    }
    const currentState = onboard.getState()
    console.log(currentState)
    return currentState;
    // await onboard.walletCheck();
}

async function readyToTransact() {
    const currentState = onboard.getState()
    if (!currentState.wallet.provider) {
        const walletSelected = await onboard.walletSelect()
        if (!walletSelected) return false
    }

    const ready = await onboard.walletCheck()
    return ready
}

function resetWallet() {
    localStorage.removeItem('selectedWallet');
    onboard.walletReset();
    const currentState = onboard.getState()

    return currentState;
}

export { web3js, onboard, login, readyToTransact, resetWallet }