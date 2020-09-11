import React, { Component } from 'react';

import { Button } from 'semantic-ui-react'
import { Container, Header, List } from "semantic-ui-react";
import AccordionExampleForm from './form/form'
import {login, resetWallet} from './web3/connectWallet'

const BigNumber = require('bignumber.js');

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