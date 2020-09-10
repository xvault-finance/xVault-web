import React, { Component } from 'react';

import { Button } from 'semantic-ui-react'
import { Container, Header, List } from "semantic-ui-react";
import AccordionExampleForm from './form/form'
import {login, resetWallet} from './web3/connectWallet'

const BigNumber = require('bignumber.js');

// let web3;

// const defaultWalletChecks = [
//   { checkName: 'connect' },
//   { checkName: 'network' },
//   { checkName: 'balance', minimumBalance: '0' }
// ]

// const tokenBalanceCheck = tokenBalance({ tokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f', tokenName: 'Dai', minimumBalance: 5 })

// const onboard = Onboard({
//   dappId: "2b2600b5-0267-4444-8c35-b18efce2693b",
//   networkId: 1,
//   subscriptions: {
//     wallet: wallet => {
//       web3 = new Web3(wallet.provider);
//       localStorage.setItem('selectedWallet', wallet.name);
//       console.log(wallet);
//     }
//   },
//   walletSelect: {
//     wallets: [
//       {
//         walletName: 'metamask',
//         preferred: true
//       },
//       {
//         walletName: 'coinbase',
//         preferred: true
//       },
//       {
//         walletName: "walletConnect",
//         infuraKey: "b19d1248bdaa4d5080dfc8ad2020a05e"
//       },
//     ]
//   },

//   walletCheck: [...defaultWalletChecks, tokenBalanceCheck]
// });

// async function login() {
//   const previouslySelectedWallet = localStorage.getItem('selectedWallet')

//   let status
//   if (previouslySelectedWallet == "undefined" || previouslySelectedWallet == false || previouslySelectedWallet == null) {
//     status = await onboard.walletSelect();
//   } else {
//     status = await onboard.walletSelect(previouslySelectedWallet);
//   }

//   if (status == true) {
//     let a = await onboard.walletCheck()
//     console.log(a)
//   }
//   const currentState = onboard.getState()
//   console.log(currentState)
//   return currentState;
//   // await onboard.walletCheck();
// }

// export default async function readyToTransact() {
//   if (!provider) {
//       const walletSelected = await onboard.walletSelect()
//       if (!walletSelected) return false
//   }

//   const ready = await onboard.walletCheck()
//   return ready
// }

// function resetWallet() {
//   localStorage.removeItem('selectedWallet');
//   onboard.walletReset();
//   const currentState = onboard.getState()

//   return currentState;
// }

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: false,
      currentState: {
        balance: 0
      },
      balance: 0
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  async componentDidMount() {
    const previouslySelectedWallet = localStorage.getItem('selectedWallet')

    if (previouslySelectedWallet == "undefined" || previouslySelectedWallet == false || previouslySelectedWallet == null) {
      console.log(previouslySelectedWallet)
    } else {
      this.handleLogin();
    }
  }

  async handleLogin() {
    let currentState = await login();

    let status = false;
    if (currentState.address !== null) {
      status = true
    }

    let balance = new BigNumber(currentState.balance);
    balance = balance.shiftedBy(-18)

    this.setState({
      logged: status,
      currentState: currentState,
      balance: balance
    });

    console.log(this.state)
  }

  async handleReset() {
    let currentState = resetWallet();

    await this.setState({
      logged: false,
      currentState: currentState,
      balance: 0
    });

    console.log(this.state)
  }

  render() {
    return (
      <Container style={{ margin: 20 }}>
        <div>
          {this.state.logged === true ? (
            <div>
              <h1>xVault
          {/* <div>Account: {wallet.account}</div>
          <div>Balance: {wallet.balance}</div> */}
                <Button
                  color='grey'
                  content='Disconnect Wallet'
                  floated='right'
                  onClick={this.handleReset}
                />
              </h1>
            </div>
          ) : (
              <div>
                <h1>xVault
                <Button
                    content='Connect Wallet'
                    floated='right'
                    onClick={this.handleLogin}
                  />
                </h1>
              </div>
            )}
          {/* <button onClick={this.handleChange}>Connect Wallet</button> */}
        </div>
        <AccordionExampleForm data={this.state} />
      </Container>
    )
  }
}

export default App;