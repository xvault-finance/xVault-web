import React, { Component } from 'react';

import { Container, Header, List } from "semantic-ui-react";

import { Button, Dropdown, Menu } from 'semantic-ui-react'
import UsdcForm from './form/usdcForm'
import UsdtForm from './form/usdtForm'
import { login, resetWallet, web3js } from './web3/connectWallet'
import { FormattedMessage } from 'react-intl';

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

          <FormattedMessage id="app.home">
            {
              (msg) => <Menu.Item
                name={msg}
                active={activeItem === 'Home'}
                onClick={this.handleItemClick}
              />
            }
          </FormattedMessage>

          <Menu.Menu position='right'>
            <FormattedMessage id="app.language">
              {
                (msg) => <Dropdown item text={msg}>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => this.props.setLocale('en-US')}>English</Dropdown.Item>
                    <Dropdown.Item onClick={() => this.props.setLocale('zh-cn')}>简中</Dropdown.Item>
                    <Dropdown.Item onClick={() => this.props.setLocale('zh-tw')}>繁中</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              }
            </FormattedMessage>

            <Menu.Item>
              {this.state.logged === true ? (

                <FormattedMessage id="app.disconnect">
                  {
                    (msg) => <Button
                      color='grey'
                      content={msg}
                      floated='right'
                      onClick={this.handleReset}
                    />
                  }
                </FormattedMessage>
              ) : (
                  <FormattedMessage id="app.connect">
                    {
                      (msg) => <Button
                        content={msg}
                        floated='right'
                        onClick={this.handleLogin}
                      />
                    }
                  </FormattedMessage>

                )}
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <UsdcForm data={this.state} />
        <br />
        <UsdtForm data={this.state} />

      </Container >
    )
  }
}

export default App;