import React from 'react'
import { Accordion, Button, Form, Segment } from 'semantic-ui-react'
import {readyToTransact} from '../web3/connectWallet'
import {sendTransaction, approve} from '../web3/transaction'

const panels = [
    {
        key: 'details',
        title: 'Optional Details',
        content: {
            as: Form.Input,
            label: 'Maiden Name',
            placeholder: 'Maiden Name',
        },
    },
]

class AccordionExampleForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputBalance: 0
        };

        this.maxClick = this.maxClick.bind(this);
    }

    maxClick(balance) {
        this.setState({
            inputBalance: balance,
        });
    }

    render() {
        return (
            <Segment>
                <Form>
                    {console.log(this.props)}
                    <div>ETH</div>
                    <Form.Group widths={2}>
                        <Form.Input
                            action={{ content: 'Max', onClick: (e) => { this.maxClick(this.props.data.balance) } }}
                            type='number' label={'Balance: ' + this.props.data.balance + ' ETH'}
                            placeholder='0.00' value={this.state.inputBalance} />
                        <Form.Input label='0.0000 yETH (0.0000 ETH)' placeholder='0.00' />
                    </Form.Group>
                    {/* <Accordion as={Form.Field} panels={panels} /> */}

                    <Button
                        content='Deposit'
                        primary
                        onClick={async () => {
                            const ready = await readyToTransact()
                            if (!ready) return
                            // sendTransaction()
                            approve()
                        }}
                    />
                    <Button
                        content='Withdraw'
                        primary
                    />
                </Form>
            </Segment>
        )
    }
}

export default AccordionExampleForm