import React, { Component } from 'react';
import Rutas from './components/Rutas'
import { BrowserRouter } from 'react-router-dom';
import '../../client/main.css';

export default class App extends Component {

  render() {

    return (
      <BrowserRouter>
        <div className="App container">
          <Rutas></Rutas>
        </div>
      </BrowserRouter>
    );
  }
}


