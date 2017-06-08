import React from 'react';
import CashMachine from './CashMachine';
import ReactTestUtils from 'react-dom/test-utils';

let atm;

beforeEach(() => {
  atm = ReactTestUtils.renderIntoDocument(<CashMachine />);
});

describe('withdraw', () => {
  it('should display invalid command error if the amount does not have a dollar sign', () => {
    atm.refs.withdrawInput.value = '40';
    atm.withdraw();
    expect(atm.state.errorType).toEqual('invalid');
    expect(ReactTestUtils.findAllInRenderedTree(atm, (element) => element.id === 'error')[0].innerHTML).toEqual('Invalid Command');
    expect(atm.state['100']).toEqual(10);
    expect(atm.state['50']).toEqual(10);
    expect(atm.state['20']).toEqual(10);
    expect(atm.state['10']).toEqual(10);
    expect(atm.state['5']).toEqual(10);
    expect(atm.state['1']).toEqual(10);
  });

  it('should display insufficient funds error if the atm does not have enough currency for the specified amount for withdrawl', () => {
    atm.refs.withdrawInput.value = '$1861';
    atm.withdraw();
    expect(atm.state.errorType).toEqual('insufficient');
    expect(ReactTestUtils.findAllInRenderedTree(atm, (element) => element.id === 'error')[0].innerHTML).toEqual('Insufficient Funds');
    expect(atm.state['100']).toEqual(10);
    expect(atm.state['50']).toEqual(10);
    expect(atm.state['20']).toEqual(10);
    expect(atm.state['10']).toEqual(10);
    expect(atm.state['5']).toEqual(10);
    expect(atm.state['1']).toEqual(10);
  });

  it('should set all denominations to zero when withdrawing the exact capacity', () => {
    atm.refs.withdrawInput.value = '$1860';
    atm.withdraw();
    expect(atm.state.errorType).toEqual('');
    expect(ReactTestUtils.findAllInRenderedTree(atm, (element) => element.id === 'error').length).toEqual(0);
    expect(atm.state['100']).toEqual(0);
    expect(atm.state['50']).toEqual(0);
    expect(atm.state['20']).toEqual(0);
    expect(atm.state['10']).toEqual(0);
    expect(atm.state['5']).toEqual(0);
    expect(atm.state['1']).toEqual(0);
  });

  it('should deduct a 50 and three ones when withdrawing $53', () => {
    atm.refs.withdrawInput.value = '$53';
    atm.withdraw();
    expect(atm.state.errorType).toEqual('');
    expect(ReactTestUtils.findAllInRenderedTree(atm, (element) => element.id === 'error').length).toEqual(0);
    expect(atm.state['100']).toEqual(10);
    expect(atm.state['50']).toEqual(9);
    expect(atm.state['20']).toEqual(10);
    expect(atm.state['10']).toEqual(10);
    expect(atm.state['5']).toEqual(10);
    expect(atm.state['1']).toEqual(7);
  });
});

describe('list denominations', () => {
  it('should return invalid command error if input is not a list of denominations', () => {
    atm.refs.denominationInput.value = 'test test';
    atm.listDenominations();
    expect(atm.state.errorType).toEqual('invalid');
    expect(ReactTestUtils.findAllInRenderedTree(atm, (element) => element.id === 'error')[0].innerHTML).toEqual('Invalid Command');
    expect(atm.state.denominations).toEqual([]);
  });
  it('should return invalid command error if input is empty', () => {
    atm.refs.denominationInput.value = '';
    atm.listDenominations();
    expect(atm.state.errorType).toEqual('invalid');
    expect(ReactTestUtils.findAllInRenderedTree(atm, (element) => element.id === 'error')[0].innerHTML).toEqual('Invalid Command');
    expect(atm.state.denominations).toEqual([]);
  });
  it('should return invalid command error if input does not have dollar signs in front of the denominations', () => {
    atm.refs.denominationInput.value = '20 50 100';
    atm.listDenominations();
    expect(atm.state.errorType).toEqual('invalid');
    expect(ReactTestUtils.findAllInRenderedTree(atm, (element) => element.id === 'error')[0].innerHTML).toEqual('Invalid Command');
    expect(atm.state.denominations).toEqual([]);
  });
  it('should filter list of denominations by the specified denominations', () => {
    atm.refs.denominationInput.value = '$20 $50 $100';
    atm.listDenominations();
    expect(atm.state.errorType).toEqual('');
    expect(atm.state.denominations).toEqual(['20', '50', '100']);
  });
  it('should return invalid command error if input contains an unsupported denomination', () => {
    atm.refs.denominationInput.value = '$10 $70';
    atm.listDenominations();
    expect(atm.state.errorType).toEqual('invalid');
    expect(ReactTestUtils.findAllInRenderedTree(atm, (element) => element.id === 'error')[0].innerHTML).toEqual('Invalid Command');
    expect(atm.state.denominations).toEqual([]);
  });
});

describe('restock', () => {
  it('should restore all denominations back to 10 after calling restock', () => {
    atm.setState({
        100: 0,
        50: 2,
        20: 4,
        10: 6,
        5: 8,
        1: 9,
      });
    atm.restock();
    expect(atm.state.errorType).toEqual('');
    expect(atm.state['100']).toEqual(10);
    expect(atm.state['50']).toEqual(10);
    expect(atm.state['20']).toEqual(10);
    expect(atm.state['10']).toEqual(10);
    expect(atm.state['5']).toEqual(10);
    expect(atm.state['1']).toEqual(10);
  });
});

describe('quit', () => {
  it('should hide errors and list of denominations, and should reset values', () => {
    atm.setState({
        100: 0,
        50: 2,
        20: 4,
        10: 6,
        5: 8,
        1: 9,
        errorType: 'invalid',
        denominations: [10, 20],
      });
    atm.quit();

    expect(atm.state['100']).toEqual(10);
    expect(atm.state['50']).toEqual(10);
    expect(atm.state['20']).toEqual(10);
    expect(atm.state['10']).toEqual(10);
    expect(atm.state['5']).toEqual(10);
    expect(atm.state['1']).toEqual(10);
    expect(atm.state.errorType).toEqual('');
    expect(atm.state.denominations).toEqual([]);
  });
});

