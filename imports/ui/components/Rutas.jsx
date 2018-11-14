import React, { Component } from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Proyecto from './Proyecto/Proyecto.jsx';
import ProyectoNuevo from './Proyecto/ProyectoNuevo.jsx';
import Tarea from './Tarea/Tarea.jsx'
import Login from './Login/Login.jsx'

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