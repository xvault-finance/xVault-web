import React from 'react'
import { Button, Form, Segment, Message } from 'semantic-ui-react'
import { readyToTransact } from '../web3/connectWallet'
import { deposit, withdraw } from '../web3/transaction'
import { checkBalance } from '../web3/balanceCheck'
import { FormattedMessage } from 'react-intl';
import {injectIntl} from 'react-intl'; 
import './form.css'

const kovanUsdt = "0xe22da380ee6b445bb8273c81944adeb6e8450422";
const kovanxUsdt = "0x2b6cf5bd95b9d75de255f9dd48ff3b1d269e09d7";
const contractAddress = "0x2b6cF5bd95B9D75de255f9dd48Ff3b1D269E09D7";
const decimals = 6;

class UsdtForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usdtInput: 0,
            xusdtInput: 0,
            usdtBalance: 0,
            xusdtBalance: 0
        };

        this.maxClick = this.maxClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    async componentWillReceiveProps(nextProps) {
        if (this.props.data.logged !== nextProps.data.logged && nextProps.data.logged === true) {
            const usdtTokenBalanceCheck = await checkBalance({ tokenAddress: kovanUsdt })
            const xusdtTokenBalanceCheck = await checkBalance({ tokenAddress: kovanxUsdt })

            this.setState({
                usdtBalance: usdtTokenBalanceCheck / (10 ** 6),
                xusdtBalance: xusdtTokenBalanceCheck / (10 ** 6)
            })
        }
    }

    maxClick(name, balance) {
        console.log(name + "Input")
        balance = String(balance)
        this.setState({
            [name + "Input"]: balance,
        });
    }

    handleInputChange(e) {
        let value = e.target.value;
        console.log(e.target.name)
        if (!value.match(/^\d+(\.\d{1,2})?$/)) {
            return
        }

        // if value is not blank, then test the regex
        this.setState({
            [e.target.name + "Input"]: value
        });
    }

    render() {
        const { intl } = this.props;

        return (
            <div>
                <Message icon attached>
                    <img id="test" height="50px"
                        src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@94f058ab4a5214c6f27b7e2aba59fd8f3f4462aa/128/icon/usdt.png" alt="usdt" />
                    <Message.Content className="messageContent">
                        <Message.Header>USDT {intl.formatMessage({id: 'form.vault'})}</Message.Header>
                            <FormattedMessage id="form.apy" values={{ apy: '80%' }} /> 
                    </Message.Content>
                </Message>
                <Form className='attached fluid segment'>
                    <Form.Group widths={2}>
                        <Form.Input
                            name="usdt"
                            action={{ content: intl.formatMessage({id: 'form.max'}), onClick: (e) => { this.maxClick("usdt", this.state.usdtBalance) } }}
                            type='number' label={intl.formatMessage({id: 'form.balance'}) + this.state.usdtBalance + ' USDT'}
                            placeholder='0.00' value={this.state.usdtInput} onChange={this.handleInputChange} />
                        <Form.Input
                            name="xusdt"
                            action={{ content: intl.formatMessage({id: 'form.max'}), onClick: (e) => { this.maxClick("xusdt", this.state.xusdtBalance) } }}
                            type='number' label={intl.formatMessage({id: 'form.balance'}) + this.state.xusdtBalance + ' xUSDT'}
                            placeholder='0.00' value={this.state.xusdtInput} onChange={this.handleInputChange} />
                    </Form.Group>
                    {/* <Accordion as={Form.Field} panels={panels} /> */}

                    <Button
                        content={intl.formatMessage({id: 'form.deposit'})}
                        primary
                        onClick={async () => {
                            const ready = await readyToTransact()
                            if (!ready) return
                            // sendTransaction()
                            // approve()
                            deposit(this.state.usdtInput, kovanUsdt, contractAddress, decimals)
                        }}
                    />
                    <Button
                        content={intl.formatMessage({id: 'form.withdraw'})}
                        primary
                        onClick={async () => {
                            const ready = await readyToTransact()
                            if (!ready) return
                            // sendTransaction()
                            // approve()
                            withdraw(this.state.xusdtInput, contractAddress, decimals)
                        }}
                    />
                </Form>
            </div>
        )
    }
}

export default injectIntl(UsdtForm)