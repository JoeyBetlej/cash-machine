import React, { Component } from 'react';
import './List.css';

class List extends Component {
    render () {
        return (
            <table>
                <tbody>
                    {this.props.denominations.map((key, index) => (
                        <tr key={index}>
                        <th>${key}</th>
                        <th>{this.props[key]}</th>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }
}

export default List;