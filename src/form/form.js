import React from 'react'
import { Accordion, Button, Form, Segment, Input } from 'semantic-ui-react'
import { readyToTransact } from '../web3/connectWallet'
import { deposit, withdraw } from '../web3/transaction'
import { checkBalance } from '../web3/balanceCheck'

class AccordionExampleForm extends React.Component {
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
            const usdcTokenBalanceCheck = await checkBalance({ tokenAddress: '0xe22da380ee6b445bb8273c81944adeb6e8450422' })
            const xusdcTokenBalanceCheck = await checkBalance({ tokenAddress: '0x2b6cf5bd95b9d75de255f9dd48ff3b1d269e09d7' })
    
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

        return (
            <Segment>
                <Form>
                    <h2>USDC</h2>
                    <Form.Group widths={2}>
                        <Form.Input
                            name="usdc"
                            action={{ content: 'Max', onClick: (e) => { this.maxClick("usdc", this.state.usdcBalance) } }}
                            type='number' label={'Balance: ' + this.state.usdcBalance + ' USDC'}
                            placeholder='0.00' value={this.state.usdcInput} onChange={this.handleInputChange} />
                        <Form.Input
                            name="xusdc"
                            action={{ content: 'Max', onClick: (e) => { this.maxClick("xusdc", this.state.xusdcBalance) } }}
                            type='number' label={'Balance: ' + this.state.xusdcBalance + ' xUSDC'}
                            placeholder='0.00' value={this.state.xusdcInput} onChange={this.handleInputChange} />
                    </Form.Group>
                    {/* <Accordion as={Form.Field} panels={panels} /> */}

                    <Button
                        content='Deposit'
                        primary
                        onClick={async () => {
                            const ready = await readyToTransact()
                            if (!ready) return
                            // sendTransaction()
                            // approve()
                            deposit(this.state.usdcInput)
                        }}
                    />
                    <Button
                        content='Withdraw'
                        primary
                        onClick={async () => {
                            const ready = await readyToTransact()
                            if (!ready) return
                            // sendTransaction()
                            // approve()
                            withdraw(this.state.xusdcInput)
                        }}
                    />
                </Form>
            </Segment>
        )
    }
}

export default AccordionExampleForm