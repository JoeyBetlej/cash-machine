import React from 'react';
import ReactDOM from 'react-dom';
import CashMachine from './CashMachine';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<CashMachine />, document.getElementById('root'));
registerServiceWorker();
