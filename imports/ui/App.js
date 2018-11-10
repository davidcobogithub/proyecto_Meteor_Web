import React, { Component } from 'react';
import Rutas from './components/Rutas'
import { BrowserRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import '../../client/main.css';

export default class App extends Component {

  render() {

    return (
      <BrowserRouter>
        <div className="App container">
          <Rutas></Rutas>

          {/* <Tasks owner={Meteor.userId()} /> */}
        </div>
      </BrowserRouter>
    );
  }
}


