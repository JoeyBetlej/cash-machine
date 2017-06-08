import React, { Component } from 'react';
import './App.css';
import List from './List';


const values = [100, 50, 20, 10, 5, 1];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      100: 10,
      50: 10,
      20: 10,
      10: 10,
      5: 10,
      1: 10,
      input: '',
      denominationInput: '',
      errorType: '',
      denominations: [],
    }

    this.restock = this.restock.bind(this);
    this.withdraw = this.withdraw.bind(this);
    this.setError = this.setError.bind(this);
    this.listDenominations = this.listDenominations.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDenominationInputChange = this.handleDenominationInputChange.bind(this);
    this.quit = this.quit.bind(this);
  }

  restock() {
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

  handleInputChange(e) {
    this.setState({withdrawInput: e.target.value});
  }
  handleDenominationInputChange(e) {
    this.setState({denominationInput: e.target.value});
  }
  listDenominations() {
    const testRegex = /^([\s]{0,1}\$(100|[251]0|[15])[\s]{0,1})+$/;
    if (!testRegex.test(this.state.denominationInput)) {
      return this.setState({
        errorType: 'invalid',
      });
    }
    
    this.setState({
      errorType: '',
    });
    const matchRegex = /\$[\s]{0,1}(100|[251]0|[15])/g;
    let match = matchRegex.exec(this.state.denominationInput);
    const denominationValues = [];
    while(match != null) {
      if (values.includes(Number.parseInt(match[1], 10))) {
        denominationValues.push(match[1]);
        match = matchRegex.exec(this.state.denominationInput);
      } else {
        return this.setState({
          errorType: 'invalid',
        });
      }
    }

    this.setState({denominations: denominationValues});
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
    if (this.state.withdrawInput == null || !this.state.withdrawInput.startsWith('$')){
      return this.setState({
        errorType: 'invalid',
      });
    }

    let amount = this.state.withdrawInput.substring(1);
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
  quit() {
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
  render() {
    return (
      <div className="App">
        <h1>Cash Machine</h1>
        <List {...this.state} />
        {this.setError()}
        <div className="input-btn-group">
          <input id="withdraw-input" type="text" onChange={this.handleInputChange} placeholder="Enter dollar amount" />
          <button onClick={this.withdraw}>Withdraw</button>
        </div>
        <div className="input-btn-group">
          <input id="denomination-input" type="text" onChange={this.handleDenominationInputChange} placeholder="$10 $20 etc.."/>
          <button onClick={this.listDenominations}>Denominations</button>
        </div>
        <button className="button" onClick={this.restock}>Restock</button>
        <button className="button" onClick={this.quit}>Quit</button>
      </div>
    );
  }
}

export default App;
