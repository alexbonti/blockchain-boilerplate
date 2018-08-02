// @flow

import React from "react"
import { css } from "emotion"

type Props = {
    a: ?number,
    b: ?number
}

const classes = {
    table: css`
        th,
        td {
            border: 1px solid black;
        }
    `
}

const BalanceTable = ({ a, b }: Props) => (
    <div>
        <table className={classes.table}>
            <thead>
                <tr>
                    <th>Users:</th>
                    <th>A</th>
                    <th>B</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Balance</td>
                    <td>{a}</td>
                    <td>{b}</td>
                </tr>
            </tbody>
        </table>
    </div>
)

export default BalanceTable
