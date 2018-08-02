// @flow

import React from "react"
import { css } from "emotion"

type Props = {
    isLoading: boolean,
    submitData: Function
}
type State = {
    sender: string,
    receiver: string,
    amount: number | ""
}

const createClasses = () => {
    const form = css({
        display: "flex",
        justifyContent: "space-around",
        maxWidth: 500
    })
    const label = css({
        paddingRight: 5
    })

    return {
        form,
        label
    }
}

class ChaincodeForm extends React.Component<Props, State> {
    state = {
        sender: "a",
        receiver: "b",
        amount: 20
    }

    render() {
        const { submitData, isLoading } = this.props
        const { sender, receiver, amount } = this.state
        const classes = createClasses()

        return (
            <form
                className={classes.form}
                onSubmit={event => {
                    event.preventDefault()
                    submitData({
                        sender,
                        receiver,
                        amount: amount !== "" ? amount : 0
                    })
                }}
            >
                <div>
                    <label htmlFor="sender">
                        <span className={classes.label}>Sender:</span>
                        <select
                            id="sender"
                            value={sender}
                            onChange={event => {
                                this.setState({ sender: event.target.value })
                            }}
                        >
                            <option value="a">A</option>
                            <option value="b">B</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label htmlFor="receiver">
                        <span className={classes.label}>Reciever:</span>
                        <select
                            id="receiver"
                            value={receiver}
                            onChange={event => {
                                this.setState({ receiver: event.target.value })
                            }}
                        >
                            <option value="a">A</option>
                            <option value="b">B</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label htmlFor="amountInput">
                        <span className={classes.label}>Amount:</span>
                        <input
                            id="amount"
                            type="number"
                            onChange={event => {
                                this.setState({ amount: event.target.value })
                            }}
                            value={amount}
                        />
                    </label>
                </div>
                <div>
                    <button type="submit" disabled={isLoading}>
                        Submit
                    </button>
                </div>
            </form>
        )
    }
}

export default ChaincodeForm
