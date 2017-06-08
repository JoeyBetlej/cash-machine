import React, { Component } from 'react';
import './CashMachine.css';
import List from './List';

const values = [100, 50, 20, 10, 5, 1];

class CashMachine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      100: 10,
      50: 10,
      20: 10,
      10: 10,
      5: 10,
      1: 10,
      errorType: '',
      denominations: [],
    }

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.listDenominations = this.listDenominations.bind(this);
    this.quit = this.quit.bind(this);
    this.restock = this.restock.bind(this);
    this.setError = this.setError.bind(this);
    this.withdraw = this.withdraw.bind(this);
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      if (event.target.id === 'withdraw-input') {
        this.withdraw();
      } else if (event.target.id === 'denomination-input') {
        this.listDenominations();
      }
    }
  }

  listDenominations() {
    const testRegex = /^([\s]{0,1}\$(100|[251]0|[15])[\s]{0,1})+$/;
    if (!testRegex.test(this.refs.denominationInput.value)) {
      this.refs.denominationInput.value = '';
      return this.setState({
        errorType: 'invalid',
      });
    }
    
    this.setState({
      errorType: '',
    });
    const matchRegex = /\$[\s]{0,1}(100|[251]0|[15])/g;
    let match = matchRegex.exec(this.refs.denominationInput.value);
    const denominationValues = [];
    while(match != null) {
      if (values.includes(Number.parseInt(match[1], 10))) {
        denominationValues.push(match[1]);
        match = matchRegex.exec(this.refs.denominationInput.value);
      } else {
        this.refs.denominationInput.value = '';
        return this.setState({
          errorType: 'invalid',
        });
      }
    }
    this.refs.denominationInput.value = '';
    this.setState({denominations: denominationValues});
  }

  quit() {
    this.refs.denominationInput.value = '';
    this.refs.withdrawInput.value = '';
    this.setState({
      denominations: [],
      errorType: '',
      100: 10,
      50: 10,
      20: 10,
      10: 10,
      5: 10,
      1: 10,
    })
  }

  restock() {
    this.refs.denominationInput.value = '';
    this.refs.withdrawInput.value = '';
    this.setState({
      100: 10,
      50: 10,
      20: 10,
      10: 10,
      5: 10,
      1: 10,
      errorType: '',
    });
  }

  setError() {
    switch (this.state.errorType) {
      case 'invalid':
        return <div id="error">Invalid Command</div>;
      case 'insufficient':
        return <div id="error">Insufficient Funds</div>;
      default:
        return;
    }
  }

  withdraw() {
    if (this.refs.withdrawInput.value == null || !this.refs.withdrawInput.value.startsWith('$')){
      this.refs.withdrawInput.value = "";
      return this.setState({
        errorType: 'invalid',
      });
    }

    let amount = this.refs.withdrawInput.value.substring(1);
    this.refs.withdrawInput.value = "";
    if (isNaN(amount) || amount <= 0) {
      return this.setState({
        errorType: 'invalid',
      });
    }
    this.setState({
      errorType: '',
      denominations: values,
    });
    
   
    const newState = {};
    for (const value of values) {
      if (value > amount || this.state[value] === 0) {
        continue;
      }
      while (amount >= value && (newState[value] == null || newState[value] > 0)) {
        amount = amount - value;
        newState[value] = (newState[value] || this.state[value]) - 1;
      }
    }
    if (amount) {
      this.setState({
        errorType: 'insufficient',
      });
    }
    if (amount === 0) {
      this.setState(newState)
    }
  }

  render() {
    return (
      <div className="CashMachine">
        <h1>Cash Machine</h1>
        <List {...this.state} />
        {this.setError()}
        <div className="input-btn-group">
          <input onKeyDown={this.handleKeyPress} ref="withdrawInput" id="withdraw-input" type="text" placeholder="Enter dollar amount" />
          <button onClick={this.withdraw}>Withdraw</button>
        </div>
        <div className="input-btn-group">
          <input onKeyDown={this.handleKeyPress} ref="denominationInput" id="denomination-input" type="text" placeholder="Enter Denominations"/>
          <button onClick={this.listDenominations}>Inquiry</button>
        </div>
        <button className="button" onClick={this.restock}>Restock</button>
        <button className="button" onClick={this.quit}>Quit</button>
      </div>
    );
  }
}

export default CashMachine;
