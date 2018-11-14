import React, { Component } from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Proyecto from './Proyecto/Proyecto.js';
import ProyectoNuevo from './Proyecto/ProyectoNuevo.js';
import Tarea from './Tarea/Tarea.js'
import Login from './Login/Login.js'

const AppRoutes = () =>
    <Switch>
     
     {/* <Redirect from="/login" to="/"/>
      <Route exact path="/"  component={Login}/>
      <Route exact path="/proyectos"  component={Proyecto}/>
      <Route exact path="/proyectoNuevo" component={ProyectoNuevo}/>
      <Route exact path="/tareas" component={Tarea}/> */}

       <Redirect from="/login" to="/"/>
      <Route exact path="/"  component={Login}/>
      <Route exact path='/proyectos'  component={Proyecto}/>
      <Route exact path='/proyectoNuevo' component={ProyectoNuevo}/>
      <Route exact path='/tareas' component={Tarea}/>
    
    </Switch>
export default AppRoutes;