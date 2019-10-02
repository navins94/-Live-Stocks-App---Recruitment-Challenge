import React, { Component } from 'react';
import Stocks from './components/stocks.jsx'
import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Stocks />
      </div>
    );
  }
}

export default App;
