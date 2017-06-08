import React from 'react';
import App from './App';
import ReactTestUtils from 'react-dom/test-utils';

let app;

beforeEach(() => {
  app = ReactTestUtils.renderIntoDocument(<App />);
});

describe('withdraw', () => {
  it('should display invalid command error if the amount does not have a dollar sign', () => {
    app.state.withdrawInput = '40';
    app.withdraw();
    expect(app.state.errorType).toEqual('invalid');
    expect(ReactTestUtils.findAllInRenderedTree(app, (element) => element.id === 'error')[0].innerHTML).toEqual('Invalid Command');
    expect(app.state['100']).toEqual(10);
    expect(app.state['50']).toEqual(10);
    expect(app.state['20']).toEqual(10);
    expect(app.state['10']).toEqual(10);
    expect(app.state['5']).toEqual(10);
    expect(app.state['1']).toEqual(10);
  });

  it('should display insufficient funds error if the atm does not have enough currency for the specified amount for withdrawl', () => {
    app.state.withdrawInput = '$1861';
    app.withdraw();
    expect(app.state.errorType).toEqual('insufficient');
    expect(ReactTestUtils.findAllInRenderedTree(app, (element) => element.id === 'error')[0].innerHTML).toEqual('Insufficient Funds');
    expect(app.state['100']).toEqual(10);
    expect(app.state['50']).toEqual(10);
    expect(app.state['20']).toEqual(10);
    expect(app.state['10']).toEqual(10);
    expect(app.state['5']).toEqual(10);
    expect(app.state['1']).toEqual(10);
  });

  it('should set all denominations to zero when withdrawing the exact capacity', () => {
    app.state.withdrawInput = '$1860';
    app.withdraw();
    expect(app.state.errorType).toEqual('');
    expect(ReactTestUtils.findAllInRenderedTree(app, (element) => element.id === 'error').length).toEqual(0);
    expect(app.state['100']).toEqual(0);
    expect(app.state['50']).toEqual(0);
    expect(app.state['20']).toEqual(0);
    expect(app.state['10']).toEqual(0);
    expect(app.state['5']).toEqual(0);
    expect(app.state['1']).toEqual(0);
  });

  it('should deduct a 50 and three ones when withdrawing $53', () => {
    app.state.withdrawInput = '$53';
    app.withdraw();
    expect(app.state.errorType).toEqual('');
    expect(ReactTestUtils.findAllInRenderedTree(app, (element) => element.id === 'error').length).toEqual(0);
    expect(app.state['100']).toEqual(10);
    expect(app.state['50']).toEqual(9);
    expect(app.state['20']).toEqual(10);
    expect(app.state['10']).toEqual(10);
    expect(app.state['5']).toEqual(10);
    expect(app.state['1']).toEqual(7);
  });
});

describe('list denominations', () => {
  it('should return invalid command error if input is not a list of denominations', () => {
    app.state.denominationInput = 'test test';
    app.listDenominations();
    expect(app.state.errorType).toEqual('invalid');
    expect(ReactTestUtils.findAllInRenderedTree(app, (element) => element.id === 'error')[0].innerHTML).toEqual('Invalid Command');
    expect(app.state.denominations).toEqual([]);
  });
  it('should return invalid command error if input is empty', () => {
    app.state.denominationInput = '';
    app.listDenominations();
    expect(app.state.errorType).toEqual('invalid');
    expect(ReactTestUtils.findAllInRenderedTree(app, (element) => element.id === 'error')[0].innerHTML).toEqual('Invalid Command');
    expect(app.state.denominations).toEqual([]);
  });
  it('should return invalid command error if input does not have dollar signs in front of the denominations', () => {
    app.state.denominationInput = '20 50 100';
    app.listDenominations();
    expect(app.state.errorType).toEqual('invalid');
    expect(ReactTestUtils.findAllInRenderedTree(app, (element) => element.id === 'error')[0].innerHTML).toEqual('Invalid Command');
    expect(app.state.denominations).toEqual([]);
  });
  it('should filter list of denominations by the specified denominations', () => {
    app.state.denominationInput = '$20 $50 $100';
    app.listDenominations();
    expect(app.state.errorType).toEqual('');
    expect(app.state.denominations).toEqual(['20', '50', '100']);
  });
  it('should return invalid command error if input contains an unsupported denomination', () => {
    app.state.denominationInput = '$10 $70';
    app.listDenominations();
    expect(app.state.errorType).toEqual('invalid');
    expect(ReactTestUtils.findAllInRenderedTree(app, (element) => element.id === 'error')[0].innerHTML).toEqual('Invalid Command');
    expect(app.state.denominations).toEqual([]);
  });
});

describe('restock', () => {
  it('should restore all denominations back to 10 after calling restock', () => {
    app.setState({
        100: 0,
        50: 2,
        20: 4,
        10: 6,
        5: 8,
        1: 9,
      });
    app.restock();
    expect(app.state.errorType).toEqual('');
    expect(app.state['100']).toEqual(10);
    expect(app.state['50']).toEqual(10);
    expect(app.state['20']).toEqual(10);
    expect(app.state['10']).toEqual(10);
    expect(app.state['5']).toEqual(10);
    expect(app.state['1']).toEqual(10);
  });
});

describe('quit', () => {
  it('should hide errors and list of denominations, and should reset values', () => {
    app.setState({
        100: 0,
        50: 2,
        20: 4,
        10: 6,
        5: 8,
        1: 9,
        errorType: 'invalid',
        denominations: [10, 20],
      });
    app.quit();

    expect(app.state['100']).toEqual(10);
    expect(app.state['50']).toEqual(10);
    expect(app.state['20']).toEqual(10);
    expect(app.state['10']).toEqual(10);
    expect(app.state['5']).toEqual(10);
    expect(app.state['1']).toEqual(10);
    expect(app.state.errorType).toEqual('');
    expect(app.state.denominations).toEqual([]);
  });
});

