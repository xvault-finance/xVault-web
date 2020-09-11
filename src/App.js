import React, { Component } from 'react';

import { Container, Header, List } from "semantic-ui-react";

import { Button, Dropdown, Menu } from 'semantic-ui-react'
import UsdcForm from './form/usdcForm'
import { login, resetWallet, web3js } from './web3/connectWallet'

const BigNumber = require('bignumber.js');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: false,
      currentState: {
        balance: 0
      },
      balance: 0,
      activeItem: 'Home'
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

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
    const { activeItem } = this.state

    return (
      <Container style={{ margin: 20 }}>
        <Menu inverted>
          <Menu.Item
            name='xVault'
          />
          <Menu.Item
            name='Home'
            active={activeItem === 'Home'}
            onClick={this.handleItemClick}
          />

          <Menu.Menu position='right'>
            <Dropdown item text='Language'>
              <Dropdown.Menu>
                <Dropdown.Item>English</Dropdown.Item>
                <Dropdown.Item>Russian</Dropdown.Item>
                <Dropdown.Item>Spanish</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Menu.Item>
              {this.state.logged === true ? (

                <Button
                  color='grey'
                  content='Disconnect Wallet'
                  floated='right'
                  onClick={this.handleReset}
                />
              ) : (
                  <Button
                    content='Connect Wallet'
                    floated='right'
                    onClick={this.handleLogin}
                  />
                )}
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <UsdcForm data={this.state} />
        <UsdcForm data={this.state} />
        <UsdcForm data={this.state} />

      </Container>
    )
  }
}

export default App;