import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
// import SearchBar from 'material-ui-search-bar'
import AutoSuggest from './AutoSuggest'

class App extends Component {
  constructor () {
    super()
    this.state = {
      dataSource: []
    }
  }

  render() {
    return (
      <AutoSuggest/>
    );
  }
}

export default App;
