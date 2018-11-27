import React, { Component } from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Proyecto from './Proyecto/Proyecto.js';
import ProyectoNuevo from './Proyecto/ProyectoNuevo.js';
import Persona from './Persona/Persona.js';
import PersonaNueva from './Persona/PersonaNueva.js';
import PersonaProyecto from './Persona/PersonaProyecto.js';
import TareaNueva from './Tarea/TareaNueva.js'
import Login from './Login/Login.js'

const AppRoutes = () =>
    <Switch>
  
       <Redirect from="/login" to="/"/>
      <Route exact path="/"  component={Login}/>
      <Route exact path='/proyectos'  component={Proyecto}/>
      <Route exact path='/proyectoNuevo' component={ProyectoNuevo}/>
      <Route exact path='/personaProyecto' component={PersonaProyecto}/>
      <Route exact path='/tareaNueva' component={TareaNueva}/>
      <Route exact path='/personas' component={Persona}/>
      <Route exact path='/personaNueva' component={PersonaNueva}/>

    </Switch>
export default AppRoutes;