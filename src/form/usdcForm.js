import React from 'react'
import { Button, Form, Segment, Message } from 'semantic-ui-react'
import { readyToTransact } from '../web3/connectWallet'
import { deposit, withdraw } from '../web3/transaction'
import { checkBalance } from '../web3/balanceCheck'
import { FormattedMessage } from 'react-intl';
import {injectIntl} from 'react-intl'; 
import './form.css'

const kovanUsdc = "0xe22da380ee6b445bb8273c81944adeb6e8450422";
const kovanxUsdc = "0x2b6cf5bd95b9d75de255f9dd48ff3b1d269e09d7";
const contractAddress = "0x2b6cF5bd95B9D75de255f9dd48Ff3b1D269E09D7";
const decimals = 6;

class UsdcForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usdcInput: 0,
            xusdcInput: 0,
            usdcBalance: 0,
            xusdcBalance: 0
        };

        this.maxClick = this.maxClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    async componentWillReceiveProps(nextProps) {
        if (this.props.data.logged !== nextProps.data.logged && nextProps.data.logged === true) {
            const usdcTokenBalanceCheck = await checkBalance({ tokenAddress: kovanUsdc })
            const xusdcTokenBalanceCheck = await checkBalance({ tokenAddress: kovanxUsdc })

            this.setState({
                usdcBalance: usdcTokenBalanceCheck / (10 ** 6),
                xusdcBalance: xusdcTokenBalanceCheck / (10 ** 6)
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
                        src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@94f058ab4a5214c6f27b7e2aba59fd8f3f4462aa/128/icon/usdc.png" alt="usdc" />
                    <Message.Content className="messageContent">
                        <Message.Header>USDC {intl.formatMessage({id: 'form.vault'})}</Message.Header>
                        <FormattedMessage id="form.apy" values={{ apy: '80%' }} /> 
                    </Message.Content>
                </Message>
                <Form className='attached fluid segment'>
                    <Form.Group widths={2}>
                        <Form.Input
                            name="usdc"
                            action={{ content: intl.formatMessage({id: 'form.max'}), onClick: (e) => { this.maxClick("usdc", this.state.usdcBalance) } }}
                            type='number' label={intl.formatMessage({id: 'form.balance'}) + this.state.usdcBalance + ' USDC'}
                            placeholder='0.00' value={this.state.usdcInput} onChange={this.handleInputChange} />
                        <Form.Input
                            name="xusdc"
                            action={{ content: intl.formatMessage({id: 'form.max'}), onClick: (e) => { this.maxClick("xusdc", this.state.xusdcBalance) } }}
                            type='number' label={intl.formatMessage({id: 'form.balance'}) + this.state.xusdcBalance + ' xUSDC'}
                            placeholder='0.00' value={this.state.xusdcInput} onChange={this.handleInputChange} />
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
                            deposit(this.state.usdcInput, kovanUsdc, contractAddress, decimals)
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
                            withdraw(this.state.xusdcInput, contractAddress, decimals)
                        }}
                    />
                </Form>
            </div>
        )
    }
}

export default injectIntl(UsdcForm);