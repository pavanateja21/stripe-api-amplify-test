import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { API } from 'aws-amplify';

class App extends Component {
  state = { coins: [], customers: [] };

  async componentDidMount(){
    try {
      const data = await API.get('cryptoapi1', '/coins?limit=5&start=100')
      console.log('data from Lambda REST API: ', data)
      this.setState({ coins: data.coins })

      const customersData = await API.get('customersListAPI', '/customers?limit=1')
      console.log('data from Stripe customers REST API: ', customersData)
      this.setState({ customers: customersData })
    } catch (err) {
      console.log('error fetching from Lambda API')
      console.log('error: ' + err);
    }
  }

  render() {
    return (
      <div className="App">
        <AmplifySignOut />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {
            this.state.coins.map((c, i) => (
              <div key={i}>
                <h2>{c.name}</h2>
                <p>{c.price_usd}</p>
              </div>
            ))
          }
          {
            this.state.customers.map((c, i) => (
              <div key={i}>
                <h2>{c.id}</h2>
                <p>{c.object}</p>
              </div>
            ))
          }
        </header>
      </div>
    );
  }
}

export default withAuthenticator(App, true);
