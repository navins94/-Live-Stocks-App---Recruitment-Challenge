import React from 'react'
import "./style.css";
import TimeAgo from 'react-timeago'


const stocksUrl = 'ws://stocks.hulqmedia.com';

class Stocks extends React.Component {

   state = {
   stocks: {},
   connectionError: false
  }

  componentDidMount = () => {
    this.connection = new WebSocket(stocksUrl);
    this.connection.onmessage = this.saveNewStockValues;
    this.connection.onclose = () => { this.setState({connectionError: true}) }
  }

  saveNewStockValues = (event) => {
    let result = JSON.parse(event.data);
    let [up_values_count, down_values_count] = [0, 0];
    let current_time = Date.now();
    let new_stocks = this.state.stocks
    result.map((stock) =>
    {
      if(this.state.stocks[stock[0]])
      {
        new_stocks[stock[0]].current_value > Number(stock[1]) ? up_values_count++ : down_values_count++;

        new_stocks[stock[0]].current_value = Number(stock[1])
        new_stocks[stock[0]].history.push({time: current_time, price: Number(stock[1])})
      }
      else
      {
        new_stocks[stock[0]] = { current_value: stock[1], history: [{time: Date.now(), price: Number(stock[1])}], is_selected: false }
      }
    });
      this.setState({stocks: new_stocks}, () => {
          console.log()
      });
  }

  getStockValueColor = (stock) =>{
    if(stock.current_value < stock.history.slice(-2)[0].price){
      return 'red';
    }
    else if(stock.current_value > stock.history.slice(-2)[0].price){
      return 'green';
    }
    else{
      return null;
    }
  }

  render() {
    return (
      <div className='container'>
      <h1>React Live Stocks App</h1>
        <table>
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Price</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
          {Object.keys(this.state.stocks).map((stock_name, index) =>
            {
              return (
                <tr key={index}>
                  <td>{stock_name}</td>
                  <td className={this.getStockValueColor(this.state.stocks[stock_name])}>{this.state.stocks[stock_name].current_value.toFixed(2)}</td>
                  <td><TimeAgo date={ this.state.stocks[stock_name].history.slice(-1)[0].time } /></td>
                </tr>
                )
              }
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Stocks;
