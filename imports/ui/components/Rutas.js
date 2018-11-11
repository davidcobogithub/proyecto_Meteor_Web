import React, { Component } from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Proyecto from './Proyecto/Proyecto';
import ProyectoNuevo from './Proyecto/ProyectoNuevo';
import Tarea from './Tarea/Tarea'
import Login from './Login/Login'

const AppRoutes = () =>
    <Switch>
     
     {/* <Redirect from="/login" to="/"/>
      <Route exact path="/"  component={Login}/>
      <Route exact path="/proyectos"  component={Proyecto}/>
      <Route exact path="/proyectoNuevo" component={ProyectoNuevo}/>
      <Route exact path="/tareas" component={Tarea}/> */}

       <Redirect from="/login" to="/"/>
      <Route exact path="/"  component={Login}/>
      <Route exact path="https://tallermeteorproy.herokuapp.com/proyectos"  component={Proyecto}/>
      <Route exact path="https://tallermeteorproy.herokuapp.com/proyectoNuevo" component={ProyectoNuevo}/>
      <Route exact path="https://tallermeteorproy.herokuapp.com/tareas" component={Tarea}/>
    
    </Switch>
export default AppRoutes;