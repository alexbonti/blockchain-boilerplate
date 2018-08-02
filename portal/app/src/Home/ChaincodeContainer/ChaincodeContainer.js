// @flow

import React from "react"

import api from "~/util/api"
import BalanceTable from "./BalanceTable"
import ChaincodeForm from "./ChaincodeForm"

type Props = {}
type State = {
    isLoading: boolean,
    a: ?number,
    b: ?number
}

class ChaincodeContainer extends React.Component<Props, State> {
    state = {
        isLoading: true,
        a: null,
        b: null
    }
    componentDidMount() {
        this.fetchData()
    }

    fetchData = () => {
        this.setState({
            isLoading: true
        })
        api
            .queryAll()
            .then(([a, b]: [number, number]) =>
                this.setState({
                    a,
                    b,
                    isLoading: false
                })
            )
            .catch(error => {
                this.setState(state => {
                    throw error
                })
            })
    }

    submitData = async ({ sender, receiver, amount }: { sender: string, receiver: string, amount: number }) => {
        if (sender === receiver) {
            alert("sender and receiver can't be the same")
        } else if (amount <= 0) {
            alert("invalid amount")
        } else {
            this.setState({
                isLoading: true
            })
            await api.move({
                sender,
                receiver,
                amount
            })
            await this.fetchData()
        }
    }

    render() {
        const { isLoading, a, b } = this.state
        return (
            <div>
                <h2>Chaincode UI</h2>
                <BalanceTable a={a} b={b} />
                <ChaincodeForm submitData={this.submitData} isLoading={isLoading} />
                <span css={{ visibility: isLoading ? undefined : "hidden" }}>Loading...</span>
            </div>
        )
    }
}

export default ChaincodeContainer
