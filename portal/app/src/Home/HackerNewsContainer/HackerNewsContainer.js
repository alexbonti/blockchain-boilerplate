// @flow

import React from "react"

import api from "~/util/api"
import HackerNews from "./HackerNews"

type Props = {}
type State = {
    posts: Array<Object>,
    isFetching: boolean
}

class HackerNewsContainer extends React.Component<Props, State> {
    state = {
        posts: [],
        isFetching: true
    }

    componentDidMount() {
        this.fetchData()
    }

    onRefreshClick = () => {
        this.setState((prevState, props) => ({
            isFetching: true
        }))

        this.fetchData()
    }

    fetchData = () => {
        api
            .hackerNews()
            .then(payload =>
                this.setState({
                    posts: payload.hits,
                    isFetching: false
                })
            )
            .catch(error => {
                this.setState(state => {
                    throw error
                })
            })
    }

    render() {
        const Loading = () => <h2>loading...</h2>
        return (
            <div>
                <h2>HackerNew UI</h2>
                <button onClick={this.onRefreshClick}>Refresh</button>
                {this.state.isFetching ? <Loading /> : <HackerNews posts={this.state.posts} />}
            </div>
        )
    }
}

export default HackerNewsContainer
